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
} = require('../model');

const { default: slugify } = require('slugify');
const fs = require('fs');
const { Mongoose } = require('mongoose');

const categoryId = '6217ea604b383c2109a245a8';

const addAttributeOptionToDb = async (
  currentAttr,
  attrOpts,
  product,
  newProduct,
) => {
  for (const attrOpt of attrOpts) {
    let currentAttrOpt = await AttributeOption.findOne({
      label: attrOpt.label,
    });
    if (!currentAttrOpt) {
      console.log(`[${product.title}] - Create attribute ${attrOpt.label}`);
      currentAttrOpt = await new AttributeOption({
        label: attrOpt.label,
        slug: slugify(attrOpt.label, { lower: true }),
        defaultPrice: attrOpt.price,
        Attribute: currentAttr._id,
      }).save();
    }
    await new Product_AttributeOption({
      Product: newProduct._id,
      AttributeOption: currentAttrOpt._id,
    }).save();
  }
};

const addAttributToDb = async (product, newProduct) => {
  for (const attr of product.attributes) {
    if (attr.options.lenght === 0) {
      return [...results, attr];
    }
    let currentAttr = await Attribute.findOne({ name: attr.name });
    if (!currentAttr) {
      currentAttr = await new Attribute({
        name: attr.name,
        slug: slugify(attr.name, { lower: true }),
      }).save();
      await new Category_Attribute({
        Category: categoryId,
        Attribute: currentAttr,
      }).save();
    }
    await addAttributeOptionToDb(
      currentAttr,
      attr.options,
      product,
      newProduct._id,
    );
  }
};

const addProductToDb = async (product) => {
  // 1.Ищем существует ли продукт с названием
  const findProduct = await Product.findOne({
    name: product.title,
  });
  if (findProduct) {
    return;
  }
  // 2. Создаем объект продукта
  const newProduct = await new Product({
    name: product.title,
    slug: product.slug,
    vendorCode: product.sku,
    price: product.price,
    images: product.images.map((img) => ({ name: img.fileName })),
    Category: categoryId,
  }).save();
  return newProduct;
};

const addSpecificationToDb = async (product, newProduct) => {
  // 4.Добавляем характеристики
  for (const spec of product.specifications) {
    let currentSpec = await Spec.findOne({
      name: spec.label,
    });
    if (!currentSpec) {
      currentSpec = await new Spec({
        name: spec.label,
        slug: slugify(spec.label, { lower: true }),
        type: 'string',
      }).save();
      await new Category_Spec({
        Category: categoryId,
        Spec: currentSpec._id,
      }).save();
    }
    let currentSpecOpt = await SpecOption.findOne({
      name: spec.value,
    });
    if (!currentSpecOpt) {
      currentSpecOpt = await new SpecOption({
        name: spec.value,
        slug: slugify(spec.value, { lower: true }),
        default: true,
        Spec: currentSpec._id,
      }).save();
    }

    await new Product_SpecOption({
      Product: newProduct._id,
      SpecOption: currentSpecOpt._id,
    }).save();
  }
};

const saveProductToDb = async (product) => {
  const newProduct = await addProductToDb(product);
  if (!newProduct) {
    return;
  }
  await addAttributToDb(product, newProduct);
  await addSpecificationToDb(product, newProduct);
  console.log(`Added "${product.title}"`);
};

const showSpec = async () => {
  try {
    var data = fs.readFileSync('productData.json');
    var allProduct = JSON.parse(data);
    const specs = [
      { label: 'Масса нетто', opt: [] },
      { label: 'Мощность', opt: [] },
      { label: 'Аккумулятор', opt: [] },
      { label: 'Максимальная скорость', opt: [] },
      { label: 'Максимальный пробег', opt: [] },
      { label: 'Время полной зарядки', opt: [] },
      { label: 'Максимальная нагрузка', opt: [] },
      { label: 'Габариты (ДШВ), см', opt: [] },
      { label: 'Подсветка', opt: [] },
      { label: 'Привод', opt: [] },
      { label: 'Тормозная система', opt: [] },
      { label: 'Комплектация', opt: [] },
      { label: 'Гарантия', opt: [] },
    ];

    await Product.deleteMany();
    await Product_SpecOption.deleteMany();
    await SpecOption.deleteMany();
    await ProductSpecOption_SpecExtraText.deleteMany();
    await SpecExtraText.deleteMany();
    await Product_AttributeOption.deleteMany();
    await AttributeOption.deleteMany();
    await Attribute.deleteMany();
    await Category_Attribute.deleteMany();
    await Category_Spec.deleteMany();
    await Spec.deleteMany();

    const allProductFilter = allProduct.map((prod) => filterProduct(prod));

    for (const product of allProductFilter) {
      await saveProductToDb(product);
    }
  } catch (error) {
    console.log(error);
  }
};

const filterProduct = (product) => {
  let sku = product.sku ? product.sku : generateSku();
  let attributes = generateAttributes(
    product.attributes,
    product.attributesSelect,
  );
  let price = product.price
    ? parseInt(product.price.replace(/\s/g, ''))
    : generatePrice();
  return {
    title: product.title,
    slug: product.slug,
    sku,
    attributes,
    price,
    specifications: product.specifications,
    images: product.images,
  };
};

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

const generateSku = () => {
  let sku = '';
  sku += getRandomInt(100000, 999999);
  sku += getRandomInt(100000, 999999);
  return sku;
};
const generatePrice = () => {
  return getRandomInt(10000, 20000);
};

const priceRegex = /(?:^|\s)([+]?[0-9]* (([р][.]?)|([р][у][б][.]?)))/;
const generateAttributes = (attrs, attrSelects) => {
  let attributes = [
    {
      name: 'Дополнительные услуги',
      options: attrs.map((attr) => getAttrFromString(attr)),
    },
  ];
  attrSelects.map((attrSelect) =>
    attributes.push({
      name: attrSelect.name,
      options: attrSelect.options[0].map((attrOpt) =>
        getAttrFromString(attrOpt),
      ),
    }),
  );

  return attributes;
};

const getAttrFromString = (attr) => {
  const attrArr = attr.split(priceRegex);
  const label = attrArr[0];
  price = attrArr?.[1];
  if (price) {
    price = parseInt(price?.match(/\d+/)[0]);
    if (isNaN(price)) price = 0;
  } else {
    price = 0;
  }
  return {
    label,
    price,
  };
};

module.exports = { showSpec };
