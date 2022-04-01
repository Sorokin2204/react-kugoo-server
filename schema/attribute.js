const attributeFields = `
    name: String!
    slug: String!
    `;

const attributeOptionFields = `
    label: String!
    subLabel: String
    slug: String!
    defaultPrice: Int
    defaultChecked : Boolean!
    `;
const attributeSchema = `
 type Attribute {
  _id: ID!
  ${attributeFields}
  AttributeOptions: [AttributeOption]
  }

  input AttributeInput {
    _id: ID
   ${attributeFields}
  }

  type AttributeOption {
    _id: ID!
   ${attributeOptionFields}
    Attribute: Attribute
    Products: [Product]
  }

    input AttributeOptionInput {
    ${attributeOptionFields}
  }
`;
module.exports = { attributeSchema };
