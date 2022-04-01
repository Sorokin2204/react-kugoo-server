const { ObjectId } = require('mongodb');
const {
  Attribute,
  AttributeOption,
  Product_AttributeOption,
} = require('../../model');

const attributeQuery = {
  getDefaultProductAttributes: async (parent, { productId }) => {
    const defaultAttrs = await Product_AttributeOption.aggregate([
      { $match: { Product: ObjectId(productId) } },
      {
        $lookup: {
          from: AttributeOption.collection.name,
          localField: 'AttributeOption',
          foreignField: '_id',
          pipeline: [
            {
              $match: {
                isDelete: { $ne: true },
              },
            },
          ],
          as: 'AttributeOption',
        },
      },
      { $match: { AttributeOption: { $ne: [] } } },
      { $addFields: { AttributeOption: { $first: '$AttributeOption' } } },
      {
        $group: {
          _id: '$AttributeOption.Attribute',
          AttributeOption: { $first: '$AttributeOption' },
          customPrice: { $first: '$customPrice' },
          customSublabel: { $first: '$customSublabel' },
        },
      },
    ]);

    return defaultAttrs.map((attrOpt) => ({
      customPrice: attrOpt?.customPrice,
      customSublabel: attrOpt?.customSublabel,
      node: {
        ...attrOpt.AttributeOption,
        Attribute: { _id: attrOpt.AttributeOption.Attribute },
      },
    }));
  },
  getAllAttribute: async () => {
    try {
      const attrsOptions = await Attribute.aggregate([
        {
          $lookup: {
            from: AttributeOption.collection.name,
            localField: '_id',
            foreignField: 'Attribute',
            pipeline: [{ $match: { isDelete: { $ne: true } } }],
            as: 'AttributeOptions',
          },
        },
      ]);
      return attrsOptions;
    } catch (error) {
      console.log(error.message);
    }
  },
  getAttribute: async (parent, { attrId, attrOptId }) => {
    try {
      if (attrOptId) {
        return await Attribute.aggregate([
          {
            $match: {
              _id: ObjectId(attrId),
            },
          },
          {
            $lookup: {
              from: AttributeOption.collection.name,
              localField: '_id',
              foreignField: 'Attribute',
              pipeline: [
                {
                  $match: {
                    isDelete: { $ne: true },
                  },
                },
              ],
              as: 'AttributeOptions',
            },
          },
        ]);
      }
      if (attrId) {
        return await Attribute.findById(attrId);
      }
      throw new Error('Not valid attrId and attrOptId');
    } catch (error) {
      console.log(error.message);
    }
  },
};
module.exports = { attributeQuery };
