const { ObjectId } = require('mongodb');
const {
  Category,
  Category_Attribute,
  Spec,
  SpecOption,
  SpecExtraText,
  Order,
  OrderProduct,
  Product,
  AttributeOption,
} = require('../../model');

const orderQuery = {
  getAllOrders: async () => {
    let total = 0;
    const resaultProducts = await Order.aggregate([
      {
        $lookup: {
          from: OrderProduct.collection.name,
          localField: '_id',
          foreignField: 'Order',
          as: 'OrderProducts',
          pipeline: [
            {
              $addFields: {
                total: { $multiply: ['$totalPrice', '$pieces'] },
              },
            },
          ],
        },
      },
      { $unwind: '$OrderProducts' },
      { $unwind: '$OrderProducts.total' },
      {
        $group: {
          _id: '$_id',
          city: { $first: '$city' },
          street: { $first: '$street' },
          buildingNumber: { $first: '$buildingNumber' },
          buildingPart: { $first: '$buildingPart' },
          buildingFlat: { $first: '$buildingFlat' },
          buildingIndex: { $first: '$buildingIndex' },
          name: { $first: '$name' },
          surname: { $first: '$surname' },
          phone: { $first: '$phone' },
          email: { $first: '$email' },
          comment: { $first: '$comment' },

          OrderProducts: { $push: '$OrderProducts' },

          total: { $sum: '$OrderProducts.total' },
        },
      },
    ]);

    return resaultProducts;
  },
  getOrder: async (parent, { orderId }) => {
    const resaultOrder = await Order.aggregate([
      { $match: { _id: ObjectId(orderId) } },
      {
        $lookup: {
          from: OrderProduct.collection.name,
          localField: '_id',
          foreignField: 'Order',
          as: 'OrderProducts',
          pipeline: [
            {
              $addFields: {
                total: { $multiply: ['$totalPrice', '$pieces'] },
              },
            },
            {
              $lookup: {
                from: Product.collection.name,
                localField: 'Product',
                foreignField: '_id',
                as: 'Product',
                pipeline: [
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
                ],
              },
            },
            {
              $addFields: {
                Product: { $first: '$Product' },
              },
            },
            {
              $lookup: {
                from: AttributeOption.collection.name,
                localField: 'AttributeOptions',
                foreignField: '_id',
                as: 'AttributeOptions',
              },
            },
          ],
        },
      },
      { $unwind: '$OrderProducts' },
      { $unwind: '$OrderProducts.total' },
      {
        $group: {
          _id: '$_id',
          city: { $first: '$city' },
          street: { $first: '$street' },
          buildingNumber: { $first: '$buildingNumber' },
          buildingPart: { $first: '$buildingPart' },
          buildingFlat: { $first: '$buildingFlat' },
          buildingIndex: { $first: '$buildingIndex' },
          name: { $first: '$name' },
          surname: { $first: '$surname' },
          phone: { $first: '$phone' },
          email: { $first: '$email' },
          comment: { $first: '$comment' },

          OrderProducts: { $push: '$OrderProducts' },

          total: { $sum: '$OrderProducts.total' },
        },
      },
    ]);

    return resaultOrder[0];
  },
};
module.exports = { orderQuery };
