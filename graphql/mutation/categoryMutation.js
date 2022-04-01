const { ObjectId } = require('mongodb');
const {
  Category,
  AttributeOption,
  Attribute,
  Category_Attribute,
  Category_Spec,
  Product_SpecOption,
  Product,
  SpecOption,
  Product_AttributeOption,
} = require('../../model');
const { fetchFakeServer } = require('../../utils/fetchFakeServer');

const categoryMutation = {
  createCategory: async (parent, { cat, catAttrIds, catSpecIds }) => {
    const newCat = await new Category(cat).save();

    const newCatAttrs = await Category_Attribute.insertMany(
      catAttrIds.map((attrId) => ({
        Category: newCat._id,
        Attribute: attrId,
      })),
    );
    const newCatSpecs = await Category_Spec.insertMany(
      catSpecIds.map((specId) => ({
        Category: newCat._id,
        Spec: specId,
      })),
    );
    return newCat;
  },

  deleteCategory: async (parent, { catId }) => {
    await Product.updateMany({ Category: catId }, { isDeleted: true });
    await Category_Attribute.deleteMany({
      Category: catId,
    });
    await Category_Spec.deleteMany({
      Category: catId,
    });
    await Category.findByIdAndDelete(catId);
    return;
  },

  updateCategory: async (
    parent,
    { updCategory, deleteIdSpecs, newIdSpecs, deleteIdAttrs, newIdAttrs },
  ) => {
    await Category.updateOne({ _id: updCategory._id }, updCategory);

    if (newIdAttrs.length !== 0) {
      await Category_Attribute.insertMany(
        newIdAttrs.map((newAttr) => ({
          Category: updCategory._id,
          Attribute: newAttr,
        })),
      );
    }

    if (newIdSpecs.length !== 0) {
      await Category_Spec.insertMany(
        newIdSpecs.map((newSpec) => ({
          Category: updCategory._id,
          Spec: newSpec,
        })),
      );
    }

    if (deleteIdSpecs.length !== 0) {
      const productSpecOptIds = await Product_SpecOption.aggregate([
        {
          $lookup: {
            from: SpecOption.collection.name,
            localField: 'SpecOption',
            foreignField: '_id',
            as: 'SpecOption',
            pipeline: [{ $project: { Spec: 1 } }],
          },
        },
        {
          $lookup: {
            from: Product.collection.name,
            localField: 'Product',
            foreignField: '_id',
            as: 'Product',
            pipeline: [{ $project: { Category: 1 } }],
          },
        },
        {
          $addFields: {
            Product: { $arrayElemAt: ['$Product', 0] },
          },
        },
        {
          $addFields: {
            SpecOption: { $arrayElemAt: ['$SpecOption', 0] },
          },
        },
        {
          $match: { 'Product.Category': ObjectId(updCategory._id) },
        },
        {
          $match: {
            'SpecOption.Spec': {
              $in: deleteIdSpecs.map((specOptId) => ObjectId(specOptId)),
            },
          },
        },
        {
          $project: {
            _id: 1,
          },
        },
      ]);
      await Category_Spec.deleteMany({ Spec: deleteIdSpecs });
      await Product_SpecOption.deleteMany({
        _id: productSpecOptIds.map((prodSpecOptId) => prodSpecOptId._id),
      });
    }

    if (deleteIdAttrs.length !== 0) {
      const productAttrOptIds = await Product_AttributeOption.aggregate([
        {
          $lookup: {
            from: AttributeOption.collection.name,
            localField: 'AttributeOption',
            foreignField: '_id',
            as: 'AttributeOption',
            pipeline: [{ $project: { Attribute: 1 } }],
          },
        },
        {
          $lookup: {
            from: Product.collection.name,
            localField: 'Product',
            foreignField: '_id',
            as: 'Product',
            pipeline: [{ $project: { Category: 1 } }],
          },
        },
        {
          $addFields: {
            Product: { $arrayElemAt: ['$Product', 0] },
          },
        },
        {
          $addFields: {
            AttributeOption: { $arrayElemAt: ['$AttributeOption', 0] },
          },
        },
        {
          $match: { 'Product.Category': ObjectId(updCategory._id) },
        },
        {
          $match: {
            'AttributeOption.Attribute': {
              $in: deleteIdAttrs.map((attrOptId) => ObjectId(attrOptId)),
            },
          },
        },
        {
          $project: {
            _id: 1,
          },
        },
      ]);
      await Product_AttributeOption.deleteMany({
        _id: productAttrOptIds.map((prodAttrOptId) => prodAttrOptId._id),
      });
      await Category_Attribute.deleteMany({ Attribute: deleteIdAttrs });
    }
  },
};
module.exports = { categoryMutation };
