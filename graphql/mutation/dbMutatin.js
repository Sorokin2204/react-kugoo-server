const {
  Category,
  AttributeOption,
  Attribute,
  Category_Attribute,
  Category_Spec,
  Order,
  OrderProduct,
} = require('../../model');

const mongoose = require('mongoose');
const path = require('path');
const util = require('util');
const exec = util.promisify(require('child_process').exec);

async function mongoexport(collection) {
  out_string =
    'mongorestore --uri="mongodb+srv://daniil:xK&AMb9E8CmzWM037F@cluster0.t9qys.mongodb.net/kugooStoreDbCopy"  dump/kugooStoreDb';
  await exec(out_string);
}

const dbMutation = {
  resetDatabase: async () => {
    await mongoose.connection.dropDatabase();
    await mongoexport();
  },
};
module.exports = { dbMutation };
