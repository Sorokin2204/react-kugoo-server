const mutationSchema = `
  type Mutation {
### CATEGORY
      deleteCategory(catId: String): String
      createCategory(cat: CategoryInput, catAttrIds: [String], catSpecIds: [String]): Category
      updateCategory(updCategory: CategoryInput, deleteIdSpecs: [String], newIdSpecs: [String] , deleteIdAttrs: [String], newIdAttrs: [String]): String
### PRODUCT  
      createProduct(product: ProductInput): String
      updateProduct(product: ProductInput): String
      deleteProduct(productId: String): String
### ATTRIBUTE
    createAttributeWithOptions(attr: AttributeInput, attrOpt: AttributeOptionInput ): String
    updateAttribute(updAttr: AttributeInput): String
  
### ATTRIBUTE_OPTION
    updateAttributeOption(attrOptId: String, newAttrOpt: AttributeOptionInput ): String
    createAttributeOptionInAttribute(attrId: String, attrOpt: AttributeOptionInput): String
    deleteAttributeOption(attrOptId: String): String
### SPEC
      createSpec(spec: SpecInput, specOpts: [SpecOptionInput], specExtraAfter: [SpecExtraTextInput], specExtraBefore: [SpecExtraTextInput]): String
      deleteSpec(specId: String): String
      updateSpec(updSpec, : SpecInput, newOpts: [SpecOptionInput], updOpts: [SpecOptionInput], deleteIdOpts: [String]): String
### ORDER
    createOrder(orderInfo: OrderInput, productsInfo: [ProductsFromCartInput]): String
### DATABASE
    resetDatabase: String

}`;

module.exports = { mutationSchema };
