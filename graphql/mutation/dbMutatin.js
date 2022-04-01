const {
  Product,
  Category,
  Category_Attribute,
  Attribute,
  AttributeOption,
  Category_Spec,
  Product_AttributeOption,
  Spec,
  SpecOption,
  Product_SpecOption,
  Order,
  OrderProduct,
} = require('../../model');

const mongoose = require('mongoose');
const path = require('path');
const util = require('util');
const exec = util.promisify(require('child_process').exec);
var fs = require('fs');

async function mongoexport(collection) {
  out_string =
    'mongorestore --uri="mongodb+srv://daniil:xK&AMb9E8CmzWM037F@cluster0.t9qys.mongodb.net/kugooStoreDbCopy"  dump/kugooStoreDb';
  await exec(out_string);
}

const exportDb = async () => {
  const atrribute = await Attribute.find().lean();
  const product = await Product.find().lean();
  const category = await Category.find().lean();
  const category_Attribute = await Category_Attribute.find().lean();
  const attributeOption = await AttributeOption.find().lean();
  const category_Spec = await Category_Spec.find().lean();
  const product_AttributeOption = await Product_AttributeOption.find().lean();
  const spec = await Spec.find().lean();
  const specOption = await SpecOption.find().lean();
  const product_SpecOption = await Product_SpecOption.find().lean();
  const order = await Order.find().lean();
  const orderProduct = await OrderProduct.find().lean();

  fs.writeFileSync(
    path.join(__dirname, '../../backup/Product.json'),
    JSON.stringify(product),
  );
  fs.writeFileSync(
    path.join(__dirname, '../../backup/Category.json'),
    JSON.stringify(category),
  );
  fs.writeFileSync(
    path.join(__dirname, '../../backup/category_Attribute.json'),
    JSON.stringify(category_Attribute),
  );
  fs.writeFileSync(
    path.join(__dirname, '../../backup/attributeOption.json'),
    JSON.stringify(attributeOption),
  );
  fs.writeFileSync(
    path.join(__dirname, '../../backup/Category_Spec.json'),
    JSON.stringify(category_Spec),
  );
  fs.writeFileSync(
    path.join(__dirname, '../../backup/Product_AttributeOption.json'),
    JSON.stringify(product_AttributeOption),
  );
  fs.writeFileSync(
    path.join(__dirname, '../../backup/Spec.json'),
    JSON.stringify(spec),
  );
  fs.writeFileSync(
    path.join(__dirname, '../../backup/SpecOption.json'),
    JSON.stringify(specOption),
  );
  fs.writeFileSync(
    path.join(__dirname, '../../backup/Product_SpecOption.json'),
    JSON.stringify(product_SpecOption),
  );
  fs.writeFileSync(
    path.join(__dirname, '../../backup/orderProduct.json'),
    JSON.stringify(orderProduct),
  );
  fs.writeFileSync(
    path.join(__dirname, '../../backup/order.json'),
    JSON.stringify(order),
  );
};

const importDb = async () => {
  let AttributeRaw = fs.readFileSync(
    path.join(__dirname, '../../backup/Attribute.json'),
  );
  let ProductRaw = fs.readFileSync(
    path.join(__dirname, '../../backup/Product.json'),
  );
  let CategoryRaw = fs.readFileSync(
    path.join(__dirname, '../../backup/Category.json'),
  );
  let Category_AttributeRaw = fs.readFileSync(
    path.join(__dirname, '../../backup/Category_Attribute.json'),
  );
  let AttributeOptionRaw = fs.readFileSync(
    path.join(__dirname, '../../backup/AttributeOption.json'),
  );
  let Category_SpecRaw = fs.readFileSync(
    path.join(__dirname, '../../backup/Category_Spec.json'),
  );
  let SpecRaw = fs.readFileSync(path.join(__dirname, '../../backup/Spec.json'));
  let SpecOptionRaw = fs.readFileSync(
    path.join(__dirname, '../../backup/SpecOption.json'),
  );
  let Product_SpecOptionRaw = fs.readFileSync(
    path.join(__dirname, '../../backup/Product_SpecOption.json'),
  );
  let OrderRaw = fs.readFileSync(
    path.join(__dirname, '../../backup/Order.json'),
  );
  let OrderProductRaw = fs.readFileSync(
    path.join(__dirname, '../../backup/OrderProduct.json'),
  );

  let Product_AttributeOptionRaw = fs.readFileSync(
    path.join(__dirname, '../../backup/Product_AttributeOption.json'),
  );

  let AttributeData = JSON.parse(AttributeRaw);
  let ProductData = JSON.parse(ProductRaw);
  let CategoryData = JSON.parse(CategoryRaw);
  let Category_AttributeData = JSON.parse(Category_AttributeRaw);
  let AttributeOptionData = JSON.parse(AttributeOptionRaw);
  let Category_SpecData = JSON.parse(Category_SpecRaw);
  let Product_AttributeOptionData = JSON.parse(Product_AttributeOptionRaw);
  let SpecData = JSON.parse(SpecRaw);
  let SpecOptionData = JSON.parse(SpecOptionRaw);
  let Product_SpecOptionData = JSON.parse(Product_SpecOptionRaw);
  let OrderData = JSON.parse(OrderRaw);
  let OrderProductData = JSON.parse(OrderProductRaw);
  await Product.insertMany(
    ProductData.map((product) => new Product(product)),
  ).catch((err) => console.log(err));
  await Category.insertMany(
    CategoryData.map((CategoryItem) => new Category(CategoryItem)),
  );
  await Category_Attribute.insertMany(
    Category_AttributeData.map(
      (Category_AttributeItem) =>
        new Category_Attribute(Category_AttributeItem),
    ),
  );
  await Attribute.insertMany(
    AttributeData.map((AttributeItem) => new Attribute(AttributeItem)),
  );
  await AttributeOption.insertMany(
    AttributeOptionData.map(
      (AttributeOptionItem) => new AttributeOption(AttributeOptionItem),
    ),
  );
  await Category_Spec.insertMany(
    Category_SpecData.map(
      (Category_SpecItem) => new Category_Spec(Category_SpecItem),
    ),
  );
  await Product_AttributeOption.insertMany(
    Product_AttributeOptionData.map(
      (Product_AttributeOptionItem) =>
        new Product_AttributeOption(Product_AttributeOptionItem),
    ),
  );
  await Spec.insertMany(SpecData.map((SpecItem) => new Spec(SpecItem)));
  await SpecOption.insertMany(
    SpecOptionData.map((SpecOptionItem) => new SpecOption(SpecOptionItem)),
  );
  await Product_SpecOption.insertMany(
    Product_SpecOptionData.map(
      (Product_SpecOptionItem) =>
        new Product_SpecOption(Product_SpecOptionItem),
    ),
  );
  await Order.insertMany(OrderData.map((OrderItem) => new Order(OrderItem)));
  await OrderProduct.insertMany(
    OrderProductData.map(
      (OrderProductItem) => new OrderProduct(OrderProductItem),
    ),
  );
};

const dbMutation = {
  resetDatabase: async () => {
    await mongoose.connection.dropDatabase();
    await importDb();
  },
};
module.exports = { dbMutation };
