var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ProductSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  slug: {
    type: String,
    required: true,
    unique: true,
  },
  price: {
    type: Number,
    required: true,
  },
  discountPrice: {
    type: Number,
    required: false,
  },
  vendorCode: {
    type: String,
    required: true,
  },
  isDeleted: {
    type: Boolean,
    required: true,
    default: false,
  },
  images: [
    {
      order: { type: Number, required: true },
      name: {
        type: String,
        required: true,
      },
    },
  ],
  viewsCounter: {
    type: Number,
    required: false,
    default: 0,
  },
  Category: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'Category',
  },
});
ProductSchema.index({ name: 'text' });
const Product = mongoose.model('Product', ProductSchema);
//////////////////////////// SPEC ////////////////////////////
var SpecSchema = new Schema({
  name: {
    type: Schema.Types.Mixed,
    required: true,
  },
  slug: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ['string', 'number'],
    required: true,
  },
  orderInCard: {
    type: Number,
    min: 1,
    max: 4,
    required: false,
  },
});
const Spec = mongoose.model('Spec', SpecSchema);
//////////////////////////// SPEC_OPTION ////////////////////////////
var SpecOptionSchema = new Schema({
  slug: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  default: {
    type: Boolean,
    required: false,
    default: false,
  },
  Spec: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'Spec',
  },
});
const SpecOption = mongoose.model('SpecOption', SpecOptionSchema);
//////////////////////////// SPEC_EXTRA_TEXT ////////////////////////////
var SpecExtraTextSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  slug: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ['after', 'before'],
  },
  Spec: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'Spec',
  },
});
const SpecExtraText = mongoose.model('SpecExtraText', SpecExtraTextSchema);
//////////////////////////// CATEGORY_SPEC ////////////////////////////
var Category_SpecSchema = new Schema({
  Category: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'Category',
  },
  Spec: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'Spec',
  },
});
const Category_Spec = mongoose.model('Category_Spec', Category_SpecSchema);

//////////////////////////// AttributeOption ////////////////////////////
var AttributeOptionSchema = new Schema({
  label: {
    type: String,
    required: true,
  },
  slug: {
    type: String,
    required: true,
  },
  subLabel: {
    type: String,
  },
  defaultPrice: {
    type: Number,
    required: false,
    default: 0,
  },
  isDelete: {
    type: Boolean,
    required: true,
    default: false,
  },
  Attribute: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'Attribute',
  },

  defaultChecked: {
    type: Boolean,
    required: true,
    default: false,
  },
});
const AttributeOption = mongoose.model(
  'AttributeOption',
  AttributeOptionSchema,
);
//////////////////////////// Attribute ////////////////////////////

var AttributeSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  slug: {
    type: String,
    required: true,
  },
  AttributeOptions: [
    {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'AttributeOption',
    },
  ],
});
const Attribute = mongoose.model('Attribute', AttributeSchema);
//////////////////////////// CATEGORY_ATTRUBUTE ////////////////////////////
var Category_AttributeSchema = new Schema({
  Attribute: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'Attribute',
  },
  Category: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'Category',
  },
});
const Category_Attribute = mongoose.model(
  'Category_Attribute',
  Category_AttributeSchema,
);
//////////////////////////// CATEGORY ////////////////////////////

var CategorySchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  slug: {
    type: String,
    required: true,
  },
  parentCategory: {
    type: Schema.Types.ObjectId,
    required: false,
    ref: 'Category',
  },
});
const Category = mongoose.model('Category', CategorySchema);

var Product_AttributeOptionSchema = new Schema({
  Product: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'Product',
  },
  AttributeOption: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'AttributeOption',
  },
  customPrice: {
    type: Number,
  },
  customSublabel: {
    type: String,
  },
});
const Product_AttributeOption = mongoose.model(
  'Product_AttributeOption',
  Product_AttributeOptionSchema,
);

var Product_SpecOptionSchema = new Schema({
  SpecOption: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'SpecOption',
  },
  Product: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'Product',
  },
});

const Product_SpecOption = mongoose.model(
  'Product_SpecOption',
  Product_SpecOptionSchema,
);

var ProductSpecOption_SpecExtraTextSchema = new Schema({
  SpecExtraText: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'SpecExtraText',
  },
  Product_SpecOption: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'Product_SpecOption',
  },
});

const ProductSpecOption_SpecExtraText = mongoose.model(
  'ProductSpecOption_SpecExtraText',
  ProductSpecOption_SpecExtraTextSchema,
);

var OrderSchema = new Schema({
  city: {
    type: String,
    required: true,
  },
  street: {
    type: String,
    required: true,
  },
  buildingNumber: {
    type: Number,
    required: true,
  },
  buildingPart: {
    type: Number,
  },
  buildingFlat: {
    type: Number,
  },
  buildingIndex: {
    type: Number,
  },
  name: {
    type: String,
    required: true,
  },
  surname: {
    type: String,
    required: true,
  },
  phone: {
    type: Number,
    required: true,
  },
  email: {
    type: String,
  },
  comment: {
    type: String,
  },
});

const Order = mongoose.model('Order', OrderSchema);

var OrderProductSchema = new Schema({
  pieces: {
    type: Number,
    required: true,
  },
  totalPrice: {
    type: Number,
    required: true,
  },
  Order: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'Order',
  },
  Product: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'Product',
  },
  AttributeOptions: [
    {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'AttributeOption',
    },
  ],
});
const OrderProduct = mongoose.model('OrderProduct', OrderProductSchema);

// var OrderProduct_ProductAttributeOptionSchema = new Schema({
//   OrderProduct: {
//     type: Schema.Types.ObjectId,
//     required: true,
//     ref: 'OrderProduct',
//   },
//   Product_AttributeOption: {
//     type: Schema.Types.ObjectId,
//     required: true,
//     ref: 'Product_AttributeOption',
//   },
// });
// const OrderProduct_ProductAttributeOption = mongoose.model(
//   'OrderProduct_ProductAttributeOption',
//   OrderProduct_ProductAttributeOptionSchema,
// );

module.exports = {
  Product,
  Category,
  Category_Attribute,
  Attribute,
  AttributeOption,
  Category_Spec,
  Product_AttributeOption,
  Spec,
  SpecOption,
  SpecExtraText,
  Product_SpecOption,
  ProductSpecOption_SpecExtraText,
  Order,
  OrderProduct,
  // OrderProduct_ProductAttributeOption,
};
