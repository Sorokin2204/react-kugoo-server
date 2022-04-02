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
const fs = require('fs').promises;

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
    path.join(process.cwd(), './backup/Product.json'),
    JSON.stringify(product),
  );
  fs.writeFileSync(
    path.join(process.cwd(), './backup/Category.json'),
    JSON.stringify(category),
  );
  fs.writeFileSync(
    path.join(process.cwd(), './backup/category_Attribute.json'),
    JSON.stringify(category_Attribute),
  );
  fs.writeFileSync(
    path.join(process.cwd(), './backup/attributeOption.json'),
    JSON.stringify(attributeOption),
  );
  fs.writeFileSync(
    path.join(process.cwd(), './backup/Category_Spec.json'),
    JSON.stringify(category_Spec),
  );
  fs.writeFileSync(
    path.join(process.cwd(), './backup/Product_AttributeOption.json'),
    JSON.stringify(product_AttributeOption),
  );
  fs.writeFileSync(
    path.join(process.cwd(), './backup/Spec.json'),
    JSON.stringify(spec),
  );
  fs.writeFileSync(
    path.join(process.cwd(), './backup/SpecOption.json'),
    JSON.stringify(specOption),
  );
  fs.writeFileSync(
    path.join(process.cwd(), './backup/Product_SpecOption.json'),
    JSON.stringify(product_SpecOption),
  );
  fs.writeFileSync(
    path.join(process.cwd(), './backup/orderProduct.json'),
    JSON.stringify(orderProduct),
  );
  fs.writeFileSync(
    path.join(process.cwd(), './backup/order.json'),
    JSON.stringify(order),
  );
};

const importDb = () => {
  new Promise((resolve, reject) => {
    // let AttributeRaw = fs.readFile(
    //   path.join(process.cwd(), './backup/Attribute.json'),
    // );
    let ProductRaw = fs.readFile(
      path.join(process.cwd(), './backup/Product.json'),
    );
    // let CategoryRaw = fs.readFile(
    //   path.join(process.cwd(), './backup/Category.json'),
    // );
    // let Category_AttributeRaw = fs.readFile(
    //   path.join(process.cwd(), './backup/Category_Attribute.json'),
    // );
    // let AttributeOptionRaw = fs.readFile(
    //   path.join(process.cwd(), './backup/AttributeOption.json'),
    // );
    // let Category_SpecRaw = fs.readFile(
    //   path.join(process.cwd(), './backup/Category_Spec.json'),
    // );
    // let SpecRaw = fs.readFile(path.join(process.cwd(), './backup/Spec.json'));
    // let SpecOptionRaw = fs.readFile(
    //   path.join(process.cwd(), './backup/SpecOption.json'),
    // );
    // let Product_SpecOptionRaw = fs.readFile(
    //   path.join(process.cwd(), './backup/Product_SpecOption.json'),
    // );
    // let OrderRaw = fs.readFile(path.join(process.cwd(), './backup/Order.json'));
    // let OrderProductRaw = fs.readFile(
    //   path.join(process.cwd(), './backup/OrderProduct.json'),
    // );

    // let Product_AttributeOptionRaw = fs.readFile(
    //   path.join(process.cwd(), './backup/Product_AttributeOption.json'),
    // );
    Promise.all([
      AttributeRaw,
      ProductRaw,
      CategoryRaw,
      Category_AttributeRaw,
      AttributeOptionRaw,
      Category_SpecRaw,
      SpecRaw,
      SpecOptionRaw,
      Product_SpecOptionRaw,
      OrderRaw,
      OrderProductRaw,
      Product_AttributeOptionRaw,
    ])
      .then(
        ([
          AttributeResault,
          ProductResault,
          CategoryResault,
          Category_AttributeResault,
          AttributeOptionResault,
          Category_SpecResault,
          SpecResault,
          SpecOptionResault,
          Product_SpecOptionResault,
          OrderResault,
          OrderProductResault,
          Product_AttributeOptionResault,
        ]) => {
          // let AttributeData = JSON.parse(AttributeResault);
          let ProductData = JSON.parse(ProductResault);
          // let CategoryData = JSON.parse(CategoryResault);
          // let Category_AttributeData = JSON.parse(Category_AttributeResault);
          // let AttributeOptionData = JSON.parse(AttributeOptionResault);
          // let Category_SpecData = JSON.parse(Category_SpecResault);
          // let Product_AttributeOptionData = JSON.parse(
          //   Product_AttributeOptionResault,
          // );
          // let SpecData = JSON.parse(SpecResault);
          // let SpecOptionData = JSON.parse(SpecOptionResault);
          // let Product_SpecOptionData = JSON.parse(Product_SpecOptionResault);
          // let OrderData = JSON.parse(OrderResault);
          // let OrderProductData = JSON.parse(OrderProductResault);

          Promise.all([
            Product.insertMany(
              ProductData.map((product) => new Product(product)),
            ).catch((err) => console.log(err)),
            // Category.insertMany(
            //   CategoryData.map((CategoryItem) => new Category(CategoryItem)),
            // ),
            // Category_Attribute.insertMany(
            //   Category_AttributeData.map(
            //     (Category_AttributeItem) =>
            //       new Category_Attribute(Category_AttributeItem),
            //   ),
            // ),
            // Attribute.insertMany(
            //   AttributeData.map(
            //     (AttributeItem) => new Attribute(AttributeItem),
            //   ),
            // ),
            // AttributeOption.insertMany(
            //   AttributeOptionData.map(
            //     (AttributeOptionItem) =>
            //       new AttributeOption(AttributeOptionItem),
            //   ),
            // ),
            // Category_Spec.insertMany(
            //   Category_SpecData.map(
            //     (Category_SpecItem) => new Category_Spec(Category_SpecItem),
            //   ),
            // ),
            // Product_AttributeOption.insertMany(
            //   Product_AttributeOptionData.map(
            //     (Product_AttributeOptionItem) =>
            //       new Product_AttributeOption(Product_AttributeOptionItem),
            //   ),
            // ),
            // Spec.insertMany(SpecData.map((SpecItem) => new Spec(SpecItem))),
            // SpecOption.insertMany(
            //   SpecOptionData.map(
            //     (SpecOptionItem) => new SpecOption(SpecOptionItem),
            //   ),
            // ),
            // Product_SpecOption.insertMany(
            //   Product_SpecOptionData.map(
            //     (Product_SpecOptionItem) =>
            //       new Product_SpecOption(Product_SpecOptionItem),
            //   ),
            // ),
            // Order.insertMany(
            //   OrderData.map((OrderItem) => new Order(OrderItem)),
            // ),
            // OrderProduct.insertMany(
            //   OrderProductData.map(
            //     (OrderProductItem) => new OrderProduct(OrderProductItem),
            //   ),
            // ),
          ])
            .then(() => resolve())
            .catch((err) => reject(err));
        },
      )
      .catch((err) => {
        reject(err);
      });
  });
};

const dbMutation = {
  resetDatabase: async () => {
    try {
      await mongoose.connection.dropDatabase();
      await importDb();
    } catch (error) {
      console.log(error);
    }
  },
};

module.exports = { dbMutation };
