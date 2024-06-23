import { Router } from "express";
import { registerUser,loginUser,logoutUser, refreshAccessToken } from "../controllers/user.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

import { getProducts } from "../controllers/product.controller.js";

const router = Router();
router.route("/register").post(registerUser);

router.route("/login").post(loginUser);
router.route("/refresh-token").post(refreshAccessToken);
router.route("/logout").post(verifyJWT, logoutUser);

router.route("/getProducts").get(getProducts);

export default router;
