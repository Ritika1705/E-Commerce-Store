import { create } from "zustand";
import axiosInstance from "../../lib/axios";
import { toast } from "react-hot-toast";

const axios = axiosInstance;

export const useCartStore = create((set,get) => ({
    cart: [],
    coupon: null,
    total: 0,
    subtotal: 0,
    isCouponApplied: false,

    getMyCoupon: async () => {
		try {
			const response = await axios.get("http://localhost:5002/api/coupons");
			set({ coupon: response.data });
		} catch (error) {
			console.error("Error fetching coupon:", error);
		}
	},

    applyCoupon: async (code) => {
        try{
            const response = await axios.post("http://localhost:5002/api/coupons/validate", {code});
            set({coupon: response.data, isCouponApplied: true});
            get().calculateTotals();
            toast.success("Coupon applied successfully");
        }catch(error){
            toast.error(error.response.data.message || "Failed to apply coupon");
        }

    },

    removeCoupon: async () => {
        set({coupon: null, isCouponApplied: false});
        get().calculateTotals();
        toast.success("Coupon removed successfully");
    },
    
    getCartItems: async () => {
		try {
			const res = await axios.get("http://localhost:5002/api/cart");
            console.log(res.data);
			set({ cart: res.data.cartItems });
			get().calculateTotals();
		} catch (error) {
            console.log(error);
			set({ cart: [] });
			toast.error(error.response.data.message || "An error occurred");
		}
	},

    clearCart: async () => {
        await axios.delete("http://localhost:5002/api/cart");
        set({cart: [], coupon: null, total: 0, subtotal: 0});
    },

    addToCart: async(product) => {
        try{
            await axios.post("http://localhost:5002/api/cart", {productId: product._id});
            toast.success("Product added to cart successfully");

            set((prevState) => {
                const existingItem = prevState.cart.find((item) => item._id === product._id);
                const newCart = existingItem ? prevState.cart.map((item) => item._id === product._id ? {...item, quantity: item.quantity + 1} : item) : [...prevState.cart, {...product, quantity: 1}];
                return {cart: newCart};

            });
            get().calculateTotals();
        }
        catch(error){
            toast.error(error.response.data.message || "An error occurred");
        }
    },

    calculateTotals: () => {
        const {cart, coupon} = get();
		const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

        let total = subtotal;

        if(coupon){
            const discount = subtotal * (coupon.discountPercentage / 100);
            total = subtotal - discount;
        }

        set({subtotal, total});
    },

    removeFromCart : async(productId) => {
        await axios.delete(`http://localhost:5002/api/cart` , {data: {productId}});
        set((prevState) => ({cart: prevState.cart.filter((item) => item._id !== productId)}));
        get().calculateTotals();
    },

    updateQuantity: async(productId, quantity) => {
        if(quantity === 0){
            get().removeFromCart(productId);
            return;
        }

        await axios.put(`http://localhost:5002/api/cart/${productId}`, {quantity});
        set((prevState) => ({
            cart: prevState.cart.map((item) => (item._id === productId ? {...item, quantity} : item))
        }));
        get().calculateTotals();
    }
}))