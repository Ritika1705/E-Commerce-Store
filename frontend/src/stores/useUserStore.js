import { create } from "zustand";
import { toast } from "react-hot-toast";
import axiosInstance from "../../lib/axios";


const axios = axiosInstance;

export const useUserStore = create((set, get) => ({
	user: null,
	loading: false,
	checkingAuth: true,

	signup: async ({ name, email, password, confirmPassword, role }) => {
		set({ loading: true });
	
		if (password !== confirmPassword) {
			set({ loading: false });
			return toast.error("Passwords do not match");
		}
	
		try {
			// Include role in the request payload
			const res = await axios.post("/auth/signup", { name, email, password, role });
			set({ user: res.data, loading: false });
		} catch (error) {
			set({ loading: false });
			toast.error(error.response.data.message || "An error occurred");
		}
	},	

	login: async(email, password) => {
		set({loading: true});

		try {
			const res = await axios.post("/auth/login", { name, email, password });
			set({ user: res.data, loading: false });
		} catch (error) {
			set({ loading: false });
			toast.error(error.response.data.message || "An error occurred");
		}
	},

	checkAuth: async() => {
		set({checkingAuth: true});
		try{
			const res = await axios.get("/auth/profile");
			console.log(res.data);
			set({user: res.data, checkingAuth: false});
		}catch(error){
			console.log(error.message);
			set({checkingAuth: false, user: null});
		}
	},

	logout: async() => {
		try{
			await axios.post("/auth/logout");
			set({user: null});
		}
		catch(error){
			toast.error(error.response.data.message || "An error occurred while logging out");
		}
	}
}));
