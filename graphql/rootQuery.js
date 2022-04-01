const { attributeQuery } = require('./query/attributeQuery');
const { categoryQuery } = require('./query/categoryQuery');
const { specQuery } = require('./query/specQuery');
const { productQuery } = require('./query/productQuery');
const { orderQuery } = require('./query/orderQuery');

const rootQuery = {
  ...categoryQuery,
  ...attributeQuery,
  ...specQuery,
  ...productQuery,
  ...orderQuery,
};
module.exports = { rootQuery };
