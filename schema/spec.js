const specFields = `
        name: String!
        slug: String!
        type: SpecOptionType
        orderInCard: Int
    `;

const specOptionFields = `
    name: String!
    slug: String!
    default: Boolean
    `;
const specExtraTextFields = `
      name: String!
      slug: String!
      type: SpecExtraTextType!
    `;

const specSchema = `

union IntOrString = IntBox | StringBox

type IntBox {
  value: Int
}

type StringBox {
  value: String
}

enum SpecOptionType {
    string
    number
}

enum SpecExtraTextType {
    after
before
}

type Spec {
    _id: ID!
 ${specFields}
 SpecOptions: [SpecOption]
 SpecExtraTexts: [SpecExtraText]
 Category: [Category] 
  }

type SpecOption {
    _id: ID!
    ${specOptionFields}  
    Spec: Spec!
    SpecExtraText: [SpecExtraText!] 
  }

type SpecExtraText {
    _id: ID!
  ${specExtraTextFields}
      SpecOption: [SpecOption]
  Spec: Spec!
}

input SpecProductFilter {
  spec: String
  specOpt: String
}

input SpecInput {
  _id: ID
   ${specFields}
}

input SpecOptionInput {
  _id: ID
    ${specOptionFields}
}

input SpecExtraTextInput {
   ${specExtraTextFields}
}
`;

module.exports = { specSchema };
