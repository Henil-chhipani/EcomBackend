import mongoose from "mongoose";
import { DB_NAME } from "../constant.js";
import dotenv from "dotenv";
dotenv.config();
import { Product } from "../models/product.model.js";

const connectDB = async () => {
  try {
 

    const connectinstance = await mongoose.connect(`${process.env.MONGODB_URL}/${DB_NAME}`, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(
      `Mongodb connected DB host: ${connectinstance.connection.host}`
    );

    const exampleProducts = [
      {
        name: "Chintu",
        description:
          "Lightweight and breathable running shoes for a comfortable and supportive run.",
        price: 99.95,
        stock: 100,
        category: "Clothing",
        subCategory: "Shoes",
        brand: "Acme",
        thumbnail: "thumbnail2.jpg",
      },
      {
        name: "BD",
        description: "High-performance tennis racket for professional players.",
        price: 199.99,
        stock: 50,
        category: "Sports",
        subCategory: "Tennis",
        brand: "SportX",
        thumbnail: "thumbnail3.jpg",
      }
    ];

    // Function to insert products into the database
    const insertProducts = async () => {
      try {
        const insertedProducts = await Product.insertMany(exampleProducts);
        console.log("Example products inserted successfully:", insertedProducts);
      } catch (error) {
        console.error("Error inserting example products:", error);
      } finally {
        mongoose.connection.close();
      }
    };

    // insertProducts();


  } catch (error) {
    console.log("error", error);
    process.exit(1);
  }
};

export default connectDB;
