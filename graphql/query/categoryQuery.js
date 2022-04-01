const { ObjectId } = require('mongodb');
const { Mongoose } = require('mongoose');
const {
  Category,
  Category_Attribute,
  Category_Spec,
  Spec,
  SpecOption,
  SpecExtraText,
  Attribute,
  AttributeOption,
} = require('../../model');

const categoryQuery = {
  getCategory: async (parent, { id, withAttrOpts, withSpecOpts }) => {
    try {
      const pipelineCatAttr = [
        {
          $match: {
            Category: ObjectId(id),
          },
        },
        {
          $lookup: {
            from: Attribute.collection.name,
            localField: 'Attribute',
            foreignField: '_id',
            pipeline: [],
            as: 'Attribute',
          },
        },
      ];

      pipelineCatAttr.push({
        $unwind: {
          path: '$Attribute',
          preserveNullAndEmptyArrays: true,
        },
      });
      pipelineCatAttr.push({
        $lookup: {
          from: AttributeOption.collection.name,
          localField: 'Attribute._id',
          foreignField: 'Attribute',
          as: 'Attribute.AttributeOptions',
          pipeline: [
            {
              $match: {
                isDelete: { $ne: true },
              },
            },
          ],
        },
      });

      const attributes = await Category_Attribute.aggregate(pipelineCatAttr);

      const specs = await Category_Spec.aggregate([
        {
          $match: {
            Category: ObjectId(id),
          },
        },
        {
          $lookup: {
            from: Spec.collection.name,
            localField: 'Spec',
            foreignField: '_id',
            pipeline: [],
            as: 'Spec',
          },
        },
        {
          $unwind: {
            path: '$Spec',
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $lookup: {
            from: SpecOption.collection.name,
            localField: 'Spec._id',
            foreignField: 'Spec',
            as: 'Spec.SpecOptions',
            // pipeline: [{ $match: { default: { $eq: true } } }],
          },
        },
        {
          $lookup: {
            from: SpecExtraText.collection.name,
            localField: 'Spec._id',
            foreignField: 'Spec',
            as: 'Spec.SpecExtraTexts',
          },
        },
      ]);

      const cat = await Category.findById(id).lean();
      let catWithConnections = cat;

      if (attributes.length !== 0) {
        const attrConnect = {
          attributes: {
            edges: attributes.map((attr) => ({ node: attr.Attribute })),
          },
        };
        catWithConnections = { ...catWithConnections, ...attrConnect };
      }
      if (specs.length !== 0) {
        const specConnect = {
          specs: {
            edges: specs.map((spec) => ({ node: spec.Spec })),
          },
        };
        catWithConnections = { ...catWithConnections, ...specConnect };
      }
      return catWithConnections;
    } catch (error) {
      console.log('ERROR ', error.message);
    }
  },
  getAllCategory: async () => {
    return await Category.find();
  },
  getAllAttributeInCategory: async (parent, { categoryId }) => {
    const attributeIds = await Category_Attribute.find({
      categoryId: categoryId,
    }).select('_id');
    return;
  },

  checkExistCategory: async (parent, { categorySlug }) => {
    const categoryExist = await Category.findOne({ slug: categorySlug });

    return !!categoryExist;
  },
};
module.exports = { categoryQuery };
