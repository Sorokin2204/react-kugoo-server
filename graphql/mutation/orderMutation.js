const {
  Category,
  AttributeOption,
  Attribute,
  Category_Attribute,
  Category_Spec,
  Order,
  OrderProduct,
} = require('../../model');

const orderMutation = {
  createOrder: async (parent, { orderInfo, productsInfo }) => {
    const newOrder = await new Order(orderInfo).save();
    const newOrderProducts = productsInfo.map((prodInfo) => {
      const newOrderProd = {
        pieces: prodInfo.pieces,
        totalPrice: prodInfo.totalPrice,
        Order: newOrder._id,
        Product: prodInfo.productId,
        AttributeOptions: prodInfo.attributes.map((attr) => attr.attrOpt),
      };
      return new OrderProduct(newOrderProd).save();
    });
    await Promise.all(newOrderProducts);
  },
};
module.exports = { orderMutation };
