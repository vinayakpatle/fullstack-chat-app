import {create} from "zustand";
import {axiosInstance} from '../lib/axios.js';
import {toast} from "react-hot-toast";


export const useAuthStore=create((set)=>({
    authUser:null,

    isSigningUp:false,
    isLogingUp:false,
    isUpdatingProfile:false,
    onlineUsers:[],

    isCheckingAuth:true,

    authCheck:async ()=>{
        try{
            const response=await axiosInstance.get("/auth/check");
            set({authUser:response.data});
        }catch(e){
            console.log("Error in authCheck",e);
            set({authUser:null});
        }finally{
            set({isCheckingAuth:false});
        }
    },

    signup:async(data)=>{
        set({isSigningUp:true});
        try{
            const res=await axiosInstance.post("/auth/signup",data);
            set({authUser:res.data});
            toast.success("Account created successfully");
        }catch(e){
            toast.error(e.response.data.message);
        }finally{
            set({isSigningUp:false})
        }
    },

    login:async(data)=>{
        set({isLoginUp:true});
        try{
            const res=await axiosInstance.post("/auth/login",data);
            set({authUser:res.data});
            toast.success("Logged in successfully");
        }catch(e){
            toast.error(e.response.data.message);
        }finally{
            set({isLoginUp:false});
        }
    },

    logout:async()=>{
        try{
            await axiosInstance.post("/auth/logout")
            set({authUser:null});
            toast.success("Logged out successfully");
        }catch(e){
            toast.error(e.response.data.message);
        }
    },

    updateProfile:async(data)=>{
        set({isUpdatingProfile:true});
        try{
            const res=await axiosInstance.put("/auth/update-profile",data);
            set({authUser:res.data});
            toast.success("Profile updated successfully");
        }catch(e){
            console.log("Error in updateProfile",e);
            toast.error(e.response.data.message);
        }finally{
            set({isUpdatingProfile:false});
        }
    },


}))