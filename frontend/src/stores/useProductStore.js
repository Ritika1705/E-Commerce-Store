import { create } from "zustand";
import toast from "react-hot-toast";
import axiosInstance from "../../lib/axios";
import { p } from "framer-motion/client";


const axios = axiosInstance;

export const useProductStore = create((set) => ({
	products: [],
	loading: false,

	setProducts: (products) => set({ products }),
	createProduct: async (productData) => {
		set({ loading: true });
		try {
            const token = localStorage.getItem("accessToken");
            console.log(token);
			const res = await axios.post("/products", productData, {
                headers: {
                    Authorization: `Bearer ${token}`, // Attach the token to the header
                },
            });
			set((prevState) => ({
				products: [...prevState.products, res.data],
				loading: false,
			}));
		} catch (error) {
			toast.error(error.response.data.error);
			set({ loading: false });
		}
	},
	
    fetchAllProducts: async () => {
        set({loading: true});
        try{
            const response = await axios.get("/products");
            set({products: response.data.products, loading: false});
        }catch(error){
            set({error: "Failed to fetch products", loading: false});
            toast.error(error.response.data.error || "Failed to fetch products");
        }
    },

    fetchProductsByCategory: async (category) => {
        set({loading: true});
        try{
            const response = await axios.get(`/products/category/${category}`);
            set({products: response.data.products, loading: false});
        }
        catch(error){
            set({error: "Failed to fetch products", loading: false});
            toast.error(error.response.data.error || "Failed to fetch products");
        }
    },

    deleteProduct: async (productId) => {
        set({loading: true});
        try{
            const res = await axios.delete(`/products/${productId}`);
            console.log(res);
            set((prevProducts) => ({
                products: prevProducts.products.filter((product) => product._id !== productId),
                loading: false
            }));
        }
        catch(error){
            set({loading: false});
            toast.error(error.response.data.error || "Failed to delete product");
        }
    },
    

    toggleFeaturedProduct: async (productId) => {
		set({ loading: true });
		try {
			const response = await axios.patch(`/products/${productId}`);
            console.log(response.data);
            console.log(response.data.product.isFeatured);
			// this will update the isFeatured prop of the product
			set((prevProducts) => ({
				products: prevProducts.products.map((product) =>
					product._id === productId ? { ...product, isFeatured: response.data.product.isFeatured } : product
				),
				loading: false,
			}));
		} catch (error) {
			set({ loading: false });
			toast.error(error.response.data.error || "Failed to update product");
		}
	},

    fetchFeaturedProducts: async () => {
        set({loading: true});
        try{
            const response = await axios.get("/products/featured");
            set({products: response.data.products, loading: false});
        }
        catch(error){
            set({error: "Failed to fetch products", loading: false});
            console.log("Error fetching featured products: ", error);
        }
    }
}));