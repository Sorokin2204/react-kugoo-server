const { ObjectId } = require('mongodb');
const {
  Product,
  Product_SpecOption,
  SpecOption,
  ProductSpecOption_SpecExtraText,
  SpecExtraText,
  Product_AttributeOption,
  AttributeOption,
  Attribute,
  Category_Attribute,
  Category_Spec,
  Spec,
  Category,
} = require('../../model');
const { showSpec } = require('../../scrapper/AddScrapedProduct');
const browserObject = require('../../scrapper/browser');
const scraperController = require('../../scrapper/pageController');
const _ = require('lodash');

const productQuery = {
  searchProducts: async (parent, { searchText }) => {
    const allProduct = await getProductsCard(
      [
        {
          $match: { name: { $regex: searchText, $options: 'i' } },
        },
        {
          $lookup: {
            from: Category.collection.name,
            localField: 'Category',
            foreignField: '_id',
            as: 'Category',
          },
        },
      ],
      [],
      // [{ $limit: 5 }],
      [],
    );

    const allProductDto = allProduct[0].data.map((product) => ({
      ...product,
      images:
        product.images.length !== 0
          ? product.images.filter((img) => img.order === 0)
          : [],
      Category: product.Category[0],
      SpecOptions: {
        edges: product.SpecOptions.map((specOpt) => ({
          node: {
            ...specOpt.SpecOption,
            Spec: { _id: specOpt.SpecOption.Spec },
          },
        })),
      },
    }));
    return allProductDto;
  },
  getAllProduct: async () => {
    //Start the browser and create a browser instance
    // let browserInstance = browserObject.startBrowser();
    // Pass the browser instance to the scraper controller
    // scraperController(browserInstance);
    return await Product.aggregate([
      { $match: { isDeleted: false } },
      {
        $lookup: {
          from: Category.collection.name,
          localField: 'Category',
          foreignField: '_id',
          as: 'Category',
        },
      },
      {
        $addFields: {
          Category: { $arrayElemAt: ['$Category', 0] },
        },
      },
    ]);
  },
  getAllProductFromCart: async (parent, { productsFromCart }) => {
    const attrsFromCart = [];
    productsFromCart.map((prod) =>
      prod.attributes.map((attr) => attrsFromCart.push(ObjectId(attr.attrOpt))),
    );
    const productsInCart = await Product.aggregate([
      {
        $match: {
          _id: {
            $in: productsFromCart.map((prod) => ObjectId(prod.productId)),
          },
        },
      },

      {
        $lookup: {
          from: Category.collection.name,
          localField: 'Category',
          foreignField: '_id',
          as: 'Category',
        },
      },
      {
        $lookup: {
          from: Product_AttributeOption.collection.name,
          localField: '_id',
          foreignField: 'Product',
          as: 'AttributeOptions',
          pipeline: [
            {
              $lookup: {
                from: AttributeOption.collection.name,
                localField: 'AttributeOption',
                foreignField: '_id',
                as: 'AttributeOption',
                pipeline: [
                  {
                    $match: { isDelete: { $ne: true } },
                  },
                  {
                    $lookup: {
                      from: Attribute.collection.name,
                      localField: 'Attribute',
                      foreignField: '_id',
                      as: 'Attribute',
                    },
                  },
                ],
              },
            },
          ],
        },
      },
    ]).catch((err) => console.log(err));

    const allProductDto = productsInCart.map((product) => ({
      ...product,
      images:
        product.images.length !== 0
          ? product.images.filter((img) => img.order === 0)
          : [],
      Category: product.Category[0],
      AttributeOptions: {
        edges: product.AttributeOptions.map((attrOpt) => ({
          node: {
            ...attrOpt.AttributeOption[0],
            Attribute: attrOpt.AttributeOption[0].Attribute[0],
          },
          ...(attrOpt?.customPrice && { customPrice: attrOpt?.customPrice }),
          ...(attrOpt?.customSublabel && {
            customSublabel: attrOpt?.customSublabel,
          }),
        })),
      },
    }));
    return allProductDto;
  },
  getAllProductCard: async (
    parent,
    { category, filter, sort, offset, limit },
  ) => {
    let aggregateAfter = [];
    switch (sort) {
      case 'popular':
        break;
      case 'high-price':
        aggregateAfter.push({ $sort: { price: -1 } });
        break;
      case 'low-price':
        aggregateAfter.push({ $sort: { price: 1 } });
        break;
      case 'name':
        aggregateAfter.push({ $sort: { name: 1 } });
        break;

      default:
        break;
    }
    const categoryFind = await Category.findOne({ slug: category }).select(
      'name',
    );
    const allProduct = await getProductsCard(
      [{ $match: { Category: ObjectId(categoryFind._id) } }],
      [...aggregateAfter, { $skip: offset }, { $limit: limit }],
      Object.values(_.groupBy(filter, 'spec')),
    );
    const count = parseInt(allProduct[0]?.count[0]?.count);
    const hasNextPage = count > offset + limit;
    const allProductDto = allProduct[0].data.map((product) => ({
      ...product,
      Category: { _id: product.Category },
      images:
        product.images.length !== 0
          ? product.images.filter((img) => img.order === 0)
          : [],
      SpecOptions: {
        edges: product.SpecOptions.map((specOpt) => ({
          node: {
            ...specOpt.SpecOption,
            Spec: { _id: specOpt.SpecOption.Spec },
          },
        })),
      },
    }));
    return {
      pageProduct: allProductDto,
      pageInfo: { hasNextPage, category: { name: categoryFind.name } },
    };
  },
  getProduct: async (parent, { productSlug }) => {
    const findProduct = await Product.aggregate([
      { $match: { isDeleted: false } },
      {
        $match: {
          slug: productSlug,
        },
      },
      {
        $sort: {
          'images.order': 1,
        },
      },
      {
        $lookup: {
          from: Category.collection.name,
          localField: 'Category',
          foreignField: '_id',
          as: 'Category',
        },
      },
      {
        $lookup: {
          from: Product_AttributeOption.collection.name,
          localField: '_id',
          foreignField: 'Product',
          as: 'AttributeOptions',
          pipeline: [
            {
              $lookup: {
                from: AttributeOption.collection.name,
                localField: 'AttributeOption',
                foreignField: '_id',
                as: 'AttributeOption',
                pipeline: [
                  {
                    $lookup: {
                      from: Attribute.collection.name,
                      localField: 'Attribute',
                      foreignField: '_id',
                      as: 'Attribute',
                    },
                  },
                ],
              },
            },
          ],
        },
      },
      {
        $lookup: {
          from: Product_SpecOption.collection.name,
          localField: '_id',
          foreignField: 'Product',
          as: 'SpecOptions',
          pipeline: [
            { $project: { Product: 0, __v: 0 } },
            {
              $lookup: {
                from: SpecOption.collection.name,
                localField: 'SpecOption',
                foreignField: '_id',
                as: 'SpecOption',
                pipeline: [
                  {
                    $lookup: {
                      from: Spec.collection.name,
                      localField: 'Spec',
                      foreignField: '_id',
                      as: 'Spec',
                    },
                  },
                ],
              },
            },
            {
              $lookup: {
                from: ProductSpecOption_SpecExtraText.collection.name,
                localField: '_id',
                foreignField: 'Product_SpecOption',
                as: 'SpecExtraText',
                pipeline: [
                  {
                    $lookup: {
                      from: SpecExtraText.collection.name,
                      localField: 'SpecExtraText',
                      foreignField: '_id',
                      as: 'SpecExtraText',
                    },
                  },
                ],
              },
            },
          ],
        },
      },
    ]);

    const productData = {
      ...findProduct[0],
      Category: findProduct[0].Category[0],
      SpecOptions: {
        edges: findProduct[0].SpecOptions.map((specOpt) => ({
          node: {
            ...specOpt.SpecOption[0],
            Spec: specOpt.SpecOption[0].Spec[0],
          },
          SpecExtraTexts: specOpt.SpecExtraText.map(
            (specExtra) => specExtra.SpecExtraText[0],
          ),
        })),
      },
      AttributeOptions: {
        edges: findProduct[0].AttributeOptions.map((attrOpt) => ({
          node: {
            ...attrOpt.AttributeOption[0],
            Attribute: attrOpt.AttributeOption[0].Attribute[0],
          },
          ...(attrOpt?.customPrice && { customPrice: attrOpt?.customPrice }),
          ...(attrOpt?.customSublabel && {
            customSublabel: attrOpt?.customSublabel,
          }),
        })),
      },
    };
    return productData;
  },
};

const getProductsCard = async (aggregateBefore, aggregateAfter, filter) => {
  try {
    const specInCard = await Spec.find({
      orderInCard: { $exists: true },
    }).select('_id');
    specInCardIds = specInCard.map((spec) => spec._id);
    let filterIds = [];
    if (filter.length !== 0) {
      filter.map((filterSpec) => {
        filterSpec.map((filterSpecOpt) =>
          filterIds.push(ObjectId(filterSpecOpt.specOpt)),
        );
      });
    }

    let aggregateOptions = [];
    let productOption = [
      { $match: { isDeleted: false } },

      {
        $lookup: {
          from: Product_SpecOption.collection.name,
          localField: '_id',
          foreignField: 'Product',
          as: 'SpecOptions',
        },
      },
      { $addFields: { SpecOptions: '$SpecOptions.SpecOption' } },
      { $addFields: { filter: [] } },
      ...filter.map((filterItem) => ({
        $addFields: {
          filter: {
            $concatArrays: [
              '$filter',
              {
                $setIntersection: [
                  filterItem.map((specItem) => ObjectId(specItem.specOpt)),
                  '$SpecOptions',
                ],
              },
            ],
          },
        },
      })),
      { $match: { filter: { $size: filter.length } } },
      {
        $facet: {
          count: [{ $count: 'count' }],
          data: [
            {
              $lookup: {
                from: Product_SpecOption.collection.name,
                localField: '_id',
                foreignField: 'Product',
                as: 'SpecOptions',
                pipeline: [
                  { $project: { Product: 0 } },
                  {
                    $lookup: {
                      from: SpecOption.collection.name,
                      localField: 'SpecOption',
                      foreignField: '_id',
                      as: 'SpecOption',
                      pipeline: [],
                    },
                  },
                  { $unwind: '$SpecOption' },
                  { $unwind: '$SpecOption.Spec' },
                  { $match: { 'SpecOption.Spec': { $in: specInCardIds } } },
                ],
              },
            },
            ...(aggregateAfter || []),
          ],
        },
      },
    ];

    aggregateOptions = [...(aggregateBefore || []), ...productOption];
    return await Product.aggregate(aggregateOptions);
  } catch (error) {
    console.log(error);
  }
};

module.exports = { productQuery };
