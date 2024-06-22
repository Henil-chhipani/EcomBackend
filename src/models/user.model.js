import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true, // Ensure emails are unique
      match: [/.+\@.+\..+/, "Please enter a valid email address"], // Email validation
    },
    password: {
      type: String,
      required: true,
    },
  },
  { timestamps: true } // Automatically add createdAt and updatedAt fields
);


userSchema.pre("save", async function (next) {
    if(!this.isModified("Password")) return next();
    this.Password = await bcrypt.hash(this.Password, 10)
    next();
  })

  userSchema.methods.isPasswordCorrect = async function(Password){
    return await bcrypt.compare(Password, this.Password)
  }

  
userSchema.methods.genrateAccessToken = function () {
    return jwt.sign(
      {
        _id: this._id,
        Email: this.Email,
        FirstName: this.FirstName,
        Phone: this.Phone,
      },
      process.env.ACCESS_TOKEN_SECRET,
      {
        expiresIn: process.env.ACCESS_TOKEN_EXPIRY
      }
    );
  };

  userSchema.methods.genrateRefreshToken = function () {
    return jwt.sign(
      {
        Email: this.Email,
      },
      process.env.REFRESH_TOKEN_SECRET,
      {
        expiresIn: process.env.REFRESH_TOKEN_EXPIRY
      }
    );
  };

// Create the User model from the schema
export const User = mongoose.model("User", userSchema);
