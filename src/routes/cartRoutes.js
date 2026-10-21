import express from "express";
import {
  getCart,
  addToCart,
  updateCartItem,
  removeCartItem,
} from "../controllers/cartController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.use(protect);

router.route("/").get(getCart).post(addToCart);

router.route("/update").put(updateCartItem);

router.route("/remove").delete(removeCartItem);

export default router;
