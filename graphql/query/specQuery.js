const {
  Category,
  Category_Attribute,
  Spec,
  SpecOption,
  SpecExtraText,
  Category_Spec,
} = require('../../model');

const specQuery = {
  getAllSpec: async () => {
    return await Spec.find();
  },
  getAllSpecWithOptions: async (parent, { categorySlug }) => {
    try {
      const cat = await Category.find({ slug: categorySlug });
      const catSpecs = await Category_Spec.find({ Category: cat[0]._id });

      const specsOptions = await Spec.aggregate([
        {
          $match: { _id: { $in: catSpecs.map((spec) => spec.Spec) } },
        },
        {
          $lookup: {
            from: SpecOption.collection.name,
            localField: '_id',
            foreignField: 'Spec',
            as: 'SpecOptions',
          },
        },
      ]);
      return specsOptions;
    } catch (error) {
      console.log(error.message);
    }
  },

  getSpec: async (parent, { specId }) => {
    const spec = await Spec.findById(specId).lean();
    const specOpts = await SpecOption.find({ Spec: specId }, { Spec: 0 });
    const specExtraTexts = await SpecExtraText.find(
      { Spec: specId },
      { Spec: 0 },
    );
    return {
      ...spec,
      SpecOptions: specOpts,
      SpecExtraTexts: specExtraTexts,
    };
  },
};
module.exports = { specQuery };
