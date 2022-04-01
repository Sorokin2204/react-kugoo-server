const categoryFields = `
    name: String!
    slug: String!
`;
const categorySchema = `
  type Category {
    _id: ID!
  ${categoryFields}
     Products: [Product] #@relationship
    attributes: Category_Attribute_Connection
    specs: Category_Spec_Connection
  }

    input CategoryInput {
      _id: ID
    ${categoryFields}
    parentCategory: CategoryInput
    Products: [ProductInput] #@relationship
  }

`;

module.exports = { categorySchema };
