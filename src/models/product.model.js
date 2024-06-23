// import mongoose, { Schema } from "mongoose";

// const productSchema = new Schema(
//   {
//     name: {
//       type: String,
//       required: true,
//     },
//     description: {
//       type: String,
//       required: true,
//     },
//     price: {
//       type: Number,
//       required: true,
//     },
//     stock: {
//       type: Number,
//       required: true,
//     },
//     category: {
//       type: String,
//       required: true,
//     },
//     subCategory: {
//       type: String,
//       required: true,
//     },
//     brand: {
//       type: String,
//       required: true,
//     },
//     thumbnail: {
//       type: String,
//       required: true,
      
//     },
//   },
//   { timestamps: true }
// );

// export const Product = mongoose.model("Product", productSchema);


import mongoose,{Schema} from 'mongoose';

const productSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  stock: {
    type: Number,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  subCategory: {
    type: String,
    required: true,
  },
  brand: {
    type: String,
    required: true,
  },
  thumbnail: {
    type: String,
    required: true,
  },
}, {
  timestamps: true, // Adds createdAt and updatedAt fields
});

export const Product = mongoose.model('Product', productSchema);

 
