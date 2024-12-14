import { motion } from "framer-motion";
import { useCartStore } from "../stores/useCartStore";
import { Link } from "react-router-dom";
import { MoveRight } from "lucide-react";
import { loadStripe } from "@stripe/stripe-js";
import axiosInstance from "../../lib/axios";


const axios = axiosInstance;
const stripePromise = loadStripe("pk_test_B4aHikxAG1fv3GmTHSTcR5CT00HRUwqpbo");

const OrderSummary = () => {

    const {total, subtotal, coupon, isCouponApplied, cart} = useCartStore();
    
    const savings = subtotal - total;
    const formattedSubtotal = subtotal.toFixed(2);
    const formattedTotal = total.toFixed(2);
    const formattedSavings = savings.toFixed(2);

    const handlePayment = async () => {
        const stripe = await stripePromise;
        const res = await axios.post("http://localhost:5002/api/payments/create-checkout-session", {
            products: cart,
            couponCode: coupon ? coupon.code : null,
        });

        const session = res.data;

        console.log("session is here", session);
        console.log("session is here", session.sessionId);

        const result = await stripe.redirectToCheckout({ 
            sessionId: session.sessionId
        });

        if (result.error) {
            console.error(result.error.message);
        }
        
    }

    return (
        <motion.div
            className='space-y-4 rounded-lg border border-gray-700 bg-gray-800 p-4 shadow-sm sm:p-6'
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <p className="text-xl font-semibold text-cyan-400">Order Summary</p>

            <div className="space-y-4">
                <div className="space-y-2">
                    <dl className="flex items-center justify-between gap-4">
                        <dt className="text-base font-normal text-gray-300">Original price</dt>
                        <dd className="text-base font-semibold text-cyan-400">₹{formattedSubtotal}</dd>
                    </dl>
                    {savings > 0 && (
                        <dl className="flex items-center justify-between gap-4">
                            <dt className="text-base font-normal text-gray-300">Savings</dt>
                            <dd className="text-base font-semibold text-cyan-400">-₹{formattedSavings}</dd>
                        </dl>
                    )}
                    {coupon && isCouponApplied && (
                        <dl className="flex items-center justify-between gap-4">
                            <dt className="text-base font-normal text-gray-300">({coupon.code})</dt>
                            <dd className="text-base font-semibold text-cyan-400">-{coupon.discountPercentage}%</dd>
                        </dl>
                    )}
                    <dl className="flex items-center justify-between gap-4 border-t border-gray-600 pt-2">
                        <dt className="text-base font-bold text-white">Total</dt>
                        <dd className="text-base font-bold text-cyan-400">₹{formattedTotal}</dd>
                    </dl>
                </div>
            </div>
            <motion.button
                className="flex w-full items-center justify-center rounded-lg bg-cyan-600 px-5 py-2.5 text-sm
                font-medium text-white hover:bg-cyan-700 focus:outline-none focus:ring-4 focus:ring-cyan-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handlePayment}
            >
                Proceed to Checkout
            </motion.button>
            <div className="flex items-center justify-center gap-2">
                <span className="text-sm font-normal text-gray-400">or</span>
                <Link
                    to='/'
                    className="inline-flex items-center gap-2 text-sm font-medium text-cyan-400 underline hover:text-cyan-300 hover:no-underline"
                >
                    Continue Shopping
                    <MoveRight size={16}/>
                </Link>
            </div>
        </motion.div>
    )
};

export default OrderSummary;