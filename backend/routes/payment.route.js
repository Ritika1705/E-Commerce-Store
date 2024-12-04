import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { stripe } from "../lib/stripe.js";
import Coupon from "../models/coupon.model.js";
import { createCheckoutSession, checkoutSuccess } from "../controllers/payment.controller.js";
import Order from "../models/order.model.js";

const router = express.Router();

router.post("/create-checkout-session", protectRoute, createCheckoutSession);

router.post("/checkout-success", protectRoute, checkoutSuccess);


export default router;
