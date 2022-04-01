const { ObjectId } = require('mongodb');
const {
  Spec,
  SpecOption,
  SpecExtraText,
  Product_SpecOption,
  Category_Spec,
} = require('../../model');

const specMutation = {
  createSpec: async (
    parent,
    { spec, specOpts, specExtraAfter, specExtraBefore },
  ) => {
    const newSpec = await new Spec(spec).save();
    if (SpecOption.length !== 0) {
      await SpecOption.insertMany(
        specOpts.map((specOpt) => ({
          ...specOpt,
          Spec: newSpec._id,
          default: true,
        })),
      );
    }

    if (specExtraAfter.length !== 0) {
      await SpecExtraText.insertMany(
        specExtraAfter.map((specAfter) => ({
          ...specAfter,
          Spec: newSpec._id,
        })),
      );
    }
    if (specExtraBefore.length !== 0) {
      await SpecExtraText.insertMany(
        specExtraBefore.map((specBefore) => ({
          ...specBefore,
          Spec: newSpec._id,
        })),
      );
    }
  },
  deleteSpec: async (parent, { specId }) => {
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
        $addFields: {
          SpecOption: { $arrayElemAt: ['$SpecOption', 0] },
        },
      },
      {
        $match: {
          'SpecOption.Spec': ObjectId(specId),
        },
      },
      {
        $project: {
          _id: 1,
        },
      },
    ]);
    await Product_SpecOption.deleteMany({
      _id: productSpecOptIds.map((prodSpecOptId) => prodSpecOptId._id),
    });
    await Spec.deleteOne({ _id: specId });
    await SpecOption.deleteMany({ Spec: specId });
    await Category_Spec.deleteMany({ Spec: specId });

    return;
  },
  updateSpec: async (parent, { newOpts, updOpts, deleteIdOpts, updSpec }) => {
    await Spec.updateOne({ _id: updSpec._id }, { ...updSpec });
    await SpecOption.insertMany(
      newOpts.map((newOpt) => ({ ...newOpt, Spec: updSpec._id })),
    );
    for (uptOpt of updOpts) {
      await SpecOption.updateOne({ _id: uptOpt._id }, uptOpt);
    }
    await Product_SpecOption.deleteMany({ SpecOption: deleteIdOpts });
    await SpecOption.deleteMany({ _id: deleteIdOpts });
  },
};
module.exports = { specMutation };
