import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Product } from "../models/product.model.js";

const getProducts = asyncHandler(async (req, res) => {
    try {
      const prodcut = await Product.find();
      
      return res.status(200).json(new ApiResponse(200, prodcut));
    } catch (error) {
      console.log("error:", error);
      throw new ApiError(400, "error in geting product");
    }
  });

  export { getProducts };