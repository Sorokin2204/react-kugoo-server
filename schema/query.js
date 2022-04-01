const querySchema = `
  type Query {
### CATEGORY
    getCategory(id: String, withAttrOpts: Boolean!,withSpecOpts: Boolean!): Category
    getAllCategory: [Category]
    checkExistCategory(categorySlug: String): Boolean
### PRODUCT
searchProducts(searchText: String): [Product]
    getProduct(productSlug: String): Product
    getAllProductFromCart(productsFromCart: [ProductsFromCartInput]): [Product]
    getAllProductCard(category: String, filter: [SpecProductFilter], sort: String, offset: Int, limit: Int): ProductPage
    getAllProduct: [Product]
### ATTRIBUTE
getDefaultProductAttributes(productId: String): [Product_AttributeOption_Edge]
    getAttribute(attrId: String, attrOptId: String): Attribute
    getAllAttribute: [Attribute]
    getAllAttributeInCategory(categorySlug: String): Category
    ### SPEC
    getAllSpec: [Spec]
    getSpec(specId: String): Spec
   getAllSpecWithOptions(categorySlug: String): [Spec]
 ### ORDER
 getAllOrders: [Order]
 getOrder(orderId: String): Order
  }
`;
module.exports = { querySchema };
