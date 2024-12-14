import { create } from "zustand";
import { toast } from "react-hot-toast";
import axiosInstance from "../../lib/axios";


const axios = axiosInstance;

export const useUserStore = create((set, get) => ({
	user: null,
	loading: false,
	checkingAuth: true,

	signup: async ({ name, email, password, confirmPassword }) => {
		set({ loading: true });

		if (password !== confirmPassword) {
			set({ loading: false });
			return toast.error("Passwords do not match");
		}

		try {
			const res = await axios.post("http://localhost:5002/api/auth/signup", { name, email, password });
			set({ user: res.data, loading: false });
		} catch (error) {
			set({ loading: false });
			toast.error(error.response.data.message || "An error occurred");
		}
	},

	login: async(email, password) => {
		set({loading: true});

		try {
			const res = await axios.post("http://localhost:5002/api/auth/login", { name, email, password });
			set({ user: res.data, loading: false });
		} catch (error) {
			set({ loading: false });
			toast.error(error.response.data.message || "An error occurred");
		}
	},

	checkAuth: async() => {
		set({checkingAuth: true});
		try{
			const res = await axios.get("http://localhost:5002/api/auth/profile");
			console.log(res.data);
			set({user: res.data, checkingAuth: false});
		}catch(error){
			console.log(error.message);
			set({checkingAuth: false, user: null});
		}
	},

	logout: async() => {
		try{
			await axios.post("http://localhost:5002/api/auth/logout");
			set({user: null});
		}
		catch(error){
			toast.error(error.response.data.message || "An error occurred while logging out");
		}
	}
}));
