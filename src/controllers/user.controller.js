import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { Product } from "../models/product.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken";

const genrateAccessAndRefreshToken = async (userID) => {
  try {
    const user = await User.findById(userID);
    const accessToken = user.genrateAccessToken();
    const refreshToken = user.genrateRefreshToken();

    user.refreshToken = refreshToken;
    user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (err) {
    console.log(err);
    throw new ApiError(
      500,
      "somthing went worng while genrating Refresh and access token"
    );
  }
};

const refreshAccessToken = asyncHandler(async (req, res) => {
  const incomingRefreshToken =
    req.cookies.refershToken || req.body.refreshToken;

  if (!incomingRefreshToken) {
    throw new ApiError(401, "Unauthorized requst");
  }
  try {
    const decodedToken = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );
    const user = await User.findById(decodedToken?._id);
    if (!user) {
      throw new ApiError(401, "Invalid refresh token");
    }
    if (incomingRefreshToken !== user?.refershToken) {
      throw new ApiError(401, "Refresh token is expired or used ");
    }

    const options = {
      httpOnly: true,
      secure: true,
    };

    const { accessToken, newRefreshToken } = await genrateAccessAndRefreshToken(user._id);
    return res
      .status(200)
      .cookie("access Token", accessToken, options)
      .cookie("refresh Token", newRefreshToken, options)
      .json(
        new ApiResponse(
          200,
          { accessToken, refreshToken: newRefreshToken },
          "Access Token refreshed"
        )
      );
  } catch (error) {
    throw new ApiError(401, error?.message || "Invalid refresh token");
  }
});

const registerUser = asyncHandler(async (req, res) => {
  // get user details from frontend
  // validation - not empty
  // check if user already exists: username, email
  // check for images, check for avatar
  // upload them to cloudinary, avatar
  // create user object - create entry in db
  // remove password and refresh token field from response
  // check for user creation
  // return res

  const { name, email, password } = req.body;
  console.log("email: ", req.body);

  if ([name, email, password].some((field) => field?.trim() === "")) {
    throw new ApiError(400, "All fields are required");
  }

  const existedUser = await User.findOne({
    $or: [{ email }],
  });

  if (existedUser) {
    throw new ApiError(409, "User with email or username already exists");
  }
  //console.log(req.files);

  const user = await User.create({
    name,
    email,
    password,
  });

  const createdUser = await User.findById(user._id).select(
    "-Password -refreshToken"
  );

  if (!createdUser) {
    throw new ApiError(500, "Something went wrong while registering the user");
  }

  return res
    .status(201)
    .json(new ApiResponse(200, createdUser, "User registered Successfully"));
});

const loginUser = asyncHandler(async (req, res) => {
  // req body data
  // email match
  // check pass
  // if there than login
  const { email, password } = req.body;
  if (!email) {
    throw new ApiError(400, "Email is require");
  }
  const user = await  User.findOne({ email });
  if (!user) {
    throw new ApiError(404, "User is not exist");
  }
  const isPasswordValid = await user.isPasswordCorrect(password);

  if (!isPasswordValid) {
    throw new ApiError(401, "Password is not correct");
  }

  const { accessToken, refreshToken } = await genrateAccessAndRefreshToken(
    user._id
  );
  console.log("acc", accessToken);
  const logedInUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  const options = {
    httpOnly: true,
    secure: true,
    path: "/",
  };
  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        {
          user: logedInUser,
          accessToken,
          refreshToken,
        },
        "User logged in successfully"
      )
    );
});

const logoutUser = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: {
        refershToken: undefined,
      },
    },
    {
      new: true,
    }
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refershToken", options)
    .json(new ApiResponse(200, {}, "User logged Out"));
});

export { registerUser, loginUser, logoutUser, refreshAccessToken };
