const { gql } = require('apollo-server-express');
const { buildSchema } = require('type-graphql');
const { attributeSchema } = require('./attribute');
const { categorySchema } = require('./category');
const { connectionsSchema } = require('./connections');
const { mutationSchema } = require('./mutation');
const { orderSchema } = require('./order');
const productSchema = require('./product');
const { querySchema } = require('./query');
const { specSchema } = require('./spec');

const sch = gql`
  scalar Upload
  #### CONNECTIONS-EDGES ####
  ${connectionsSchema}
  #### PRODUCT ####
  ${productSchema}
  #### CATEGORY ####
  ${categorySchema}
  #### ATTRIBUTE ####
  ${attributeSchema}
  #### SPEC ####
  ${specSchema}
  #### ORDER ####
  ${orderSchema}
  #### QUERIES ####
  ${querySchema}
  #### MUTATIONS ####
  ${mutationSchema}
`;

module.exports = sch;
