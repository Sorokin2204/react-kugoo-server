const { ObjectId } = require('mongodb');
const { Mongoose } = require('mongoose');
const {
  Spec,
  Product,
  Product_SpecOption,
  SpecExtraText,
  ProductSpecOption_SpecExtraText,
  SpecOption,
  AttributeOption,
  Product_AttributeOption,
  Category,
} = require('../../model');
const fs = require('fs');
const path = require('path');
const { UserInputError } = require('apollo-server-core');
const appDir = path.dirname(require.main.filename);

const createProductSpecs = (specs, productId) => {
  specs.map(async (spec) => {
    let specOptId = spec.specOptId;
    if (!specOptId) {
      const name =
        spec.type === 'number' ? parseInt(spec.customValue) : spec.customValue;
      const newSpecOption = await new SpecOption({
        name: name,
        slug: name,
        Spec: spec.specId,
      }).save();
      specOptId = newSpecOption._id;
    }
    const newProductSpec = await new Product_SpecOption({
      Product: productId,
      SpecOption: specOptId,
    }).save();
    if (spec.afterId) {
      const newProductSpecAfter = await new ProductSpecOption_SpecExtraText({
        Product_SpecOption: newProductSpec._id,
        SpecExtraText: spec.afterId,
      }).save();
    }
    if (spec.beforeId) {
      const newProductSpecBefore = await new ProductSpecOption_SpecExtraText({
        Product_SpecOption: newProductSpec._id,
        SpecExtraText: spec.beforeId,
      }).save();
    }
  });
};
const createProductAttributes = (attributes, productId) => {
  attributes.map(async (attr) => {
    await new Product_AttributeOption({
      AttributeOption: attr._id,
      Product: productId,
      ...(attr.customPrice && { customPrice: attr.customPrice }),
      ...(attr.customSublabel && { customSublabel: attr.customSublabel }),
    }).save();
  });
};

const updateSpecOptions = async (product) => {
  const updSpecOpts = product.specs
    .filter((spec) => spec.specOptId)
    .map((specMap) => specMap.specOptId);
  await Product_SpecOption.deleteMany({
    SpecOption: { $nin: updSpecOpts },
    Product: product._id,
  });
  const updProductSpecOpts = updSpecOpts.map((updSpecOpt) => ({
    SpecOption: updSpecOpt,
    Product: product._id,
  }));
  for (updProductSpecOpt of updProductSpecOpts) {
    await Product_SpecOption.updateOne(updProductSpecOpt, updProductSpecOpt, {
      upsert: true,
    });
  }
};
const updateAttributeOptions = async (product) => {
  await Product_AttributeOption.deleteMany({
    AttributeOption: { $nin: product.attributes.map((attr) => attr._id) },
    Product: product._id,
  });
  const updProductAttributeOpts = product.attributes.map((updAttrOpt) => ({
    AttributeOption: updAttrOpt._id,
    Product: product._id,
    customPrice: updAttrOpt.customPrice,
    customSublabel: updAttrOpt.customSublabel,
  }));
  for (updProductAttributeOpt of updProductAttributeOpts) {
    await Product_AttributeOption.updateOne(
      {
        AttributeOption: updProductAttributeOpt.AttributeOption,
        Product: updProductAttributeOpt.Product,
      },
      updProductAttributeOpt,
      {
        upsert: true,
      },
    );
  }
};
const saveFile = async (img) => {
  const { createReadStream, filename } = await img.file;
  const newFileName = ObjectId() + '-' + getValidFileName(img.name);
  const stream = createReadStream();
  const pathName = path.join(
    __dirname,
    '../../static/products',
    `/${newFileName}`,
  );
  await stream.pipe(fs.createWriteStream(pathName));
  return newFileName;
};

const deleteFile = async (filename) => {
  const pathFile = path.join(
    __dirname,
    '../../static/products',
    `/${filename}`,
  );
  try {
    if (fs.existsSync(pathFile)) {
      fs.unlinkSync(pathFile);
    }
  } catch (err) {
    console.error(err);
  }
};
const deleteImages = async (product) => {
  let oldImages = await Product.findOne({
    _id: product._id,
  }).select('images');
  let deleteImages = [];
  if (product.images.length !== 0) {
    deleteImages = oldImages.images.filter(
      (imgOld) =>
        product.images.findIndex(
          (imgNew) => imgNew._id === imgOld._id.toString(),
        ) == -1,
    );

    if (deleteImages.length !== 0) {
      for (deleteImg of deleteImages) {
        await deleteFile(deleteImg.name);
      }
    }
  }
};

const addImages = async (images) => {
  let newImages = [];
  let index = 0;
  if (images.length !== 0) {
    for (img of images) {
      if (img.file) {
        const fileName = await saveFile(img);
        newImages.push({
          name: fileName,
          order: index,
        });
      } else {
        newImages.push({
          _id: img._id,
          name: img.name,
          order: index,
        });
      }
      index++;
    }
  }

  return newImages;
};

const getValidFileName = (filename) =>
  filename.toLowerCase().replace(/\s+/g, '-').replace(/\-\-+/g, '-');

const updateImages = async (product) => {
  await deleteImages(product);
  return await addImages(product.images);
};

const createImages = async (images) => {
  return await addImages(images);
};

const productMutation = {
  createProduct: async (parent, { product }) => {
    try {
      const existProductSlug = await Product.find({ slug: product.slug });
      const existProductName = await Product.find({ name: product.name });
      if (existProductName.length !== 0) {
        if (existProductName[0]._id != product._id) {
          throw new UserInputError('Invalid argument value', {
            argumentName: 'name',
          });
        }
      }

      if (existProductSlug.length !== 0) {
        if (existProductSlug[0]._id != product._id) {
          throw new UserInputError('Invalid argument value', {
            argumentName: 'slug',
          });
        }
      }

      const { attributes, specs, category, images, ...productData } = product;
      const newImages = await createImages(images);
      const newProduct = await new Product({
        ...productData,
        images: newImages,
        Category: category,
      }).save();
      if (specs?.length !== 0) {
        createProductSpecs(specs, newProduct._id);
      }
      if (attributes?.length !== 0) {
        createProductAttributes(attributes, newProduct._id);
      }
    } catch (error) {
      console.log(error);
    }
  },
  updateProduct: async (parent, { product }) => {
    const existProductSlug = await Product.find({ slug: product.slug });
    const existProductName = await Product.find({ name: product.name });
    if (existProductName.length !== 0) {
      if (existProductName[0]._id != product._id) {
        throw new UserInputError('Invalid argument value', {
          argumentName: 'name',
        });
      }
    }

    if (existProductSlug.length !== 0) {
      if (existProductSlug[0]._id != product._id) {
        throw new UserInputError('Invalid argument value', {
          argumentName: 'slug',
        });
      }
    }

    let { attributes, specs, ...productRest } = product;

    const { category, ...productRestNoCat } = productRest;
    await updateSpecOptions(product);
    await updateAttributeOptions(product);
    const images = await updateImages(product);
    await Product.updateOne(
      { _id: product._id },
      { ...productRestNoCat, Category: category, images: images },
    );
  },
  deleteProduct: async (parent, { productId }) => {
    await Product.updateOne({ _id: productId }, { isDeleted: true });
  },
};

module.exports = { productMutation };
