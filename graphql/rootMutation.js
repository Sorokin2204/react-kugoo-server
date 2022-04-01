const { attributeMutation } = require('./mutation/attributeMutation');
const { categoryMutation } = require('./mutation/categoryMutation');
const { dbMutation } = require('./mutation/dbMutatin');
const { orderMutation } = require('./mutation/orderMutation');
const { productMutation } = require('./mutation/productMutation');
const { specMutation } = require('./mutation/specMutation');

const rootMutation = {
  ...categoryMutation,
  ...attributeMutation,
  ...specMutation,
  ...productMutation,
  ...orderMutation,
  ...dbMutation,
};
module.exports = { rootMutation };
