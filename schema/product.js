const productImageFields = `
_id: ID
    name: String    
  order: Int
`;
const productFields = `
  name: String!
  slug: String!
    price: Int!
    discountPrice: Int
    vendorCode: String!

`;

const productFromCartSchema = `
productId: String
  pieces: Int
  totalPrice: Int
    
`;

const productSchema = `
input AttributesFromCart {
attr: String
attrOpt: String
}



input ProductsFromCartInput {
  _id: String
  ${productFromCartSchema}
  attributes: [AttributesFromCart]
}

type PageInfo {
  hasNextPage: Boolean
  category: Category
}

type ProductPage {
  pageProduct: [Product]
  pageInfo: PageInfo
}

type ProductsFromCart {
  _id: String
  ${productFromCartSchema}
}

 type ProductImage {
     ${productImageFields}
     
  }

  type Product {
    _id: ID!
   ${productFields}
   isDeleted: Boolean
    viewsCounter: Int
    images: [ProductImage]
    Category: Category
    SpecOptions: Product_SpecOption_Connection
    AttributeOptions: Product_AttributeOption_Connection
  }


  input ProductImageInput {
     ${productImageFields}
    file: Upload
  }

    input ProductInput {
      _id: ID
    ${productFields}
    category: String!
    images: [ProductImageInput]
    attributes:[ProductAttributesDtoInput]
    specs: [ProductSpecDtoInput]
}
input ProductAttributesDtoInput {
  _id: String!
  customPrice: Int
  customSublabel: String
}
input ProductSpecDtoInput {
  specId: String!
  specOptId: String
  type: String
  customValue: String
  afterId: String
  beforeId: String
}



`;
module.exports = productSchema;
