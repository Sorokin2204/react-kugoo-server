const orderFields = `
  city: String
  street: String
  buildingNumber: Int 
  buildingPart: Int
  buildingFlat: Int
  buildingIndex: Int
  name: String
  surname: String
  phone: Int
  email: String
  comment: String
`;
const orderSchema = `
  type Order {
    _id: ID!
  ${orderFields}
  OrderProducts: [OrderProduct]
  total: Int
  }

   input OrderInput {
  ${orderFields}
  }
 type OrderProduct {
    _id: ID!
   pieces: Int
  totalPrice: Int
  Order: Order
  Product: Product
  AttributeOptions: [AttributeOption]
  total: Int
  }
 

`;

module.exports = { orderSchema };
