import {create} from "zustand";
import toast from "react-hot-toast";
import {axiosInstance} from "../lib/axios";

export const useChatStore=create((set,get)=>({
    messages:[],
    users:[],
    selectedUser:null,
    isUsersLoading:false,
    isMessagesLoading:false,

    getUsers:async()=>{
        set({isUsersLoading:true});
        try{
           const res=await axiosInstance.get("/messages/users");
           set({users:res.data});
        }catch(e){
            toast.error(e.response.data.message);
        }finally{
            set({isUsersLoading:false});
        }
    },

    getMessages:async(user_id)=>{
        set({isMessageLoading:true});
        try{
            const res=await axiosInstance.get(`/messages/${user_id}`);
            set({messages:res.data});
        }catch(e){
            toast.error(e.response.data.message);
        }finally{
            set({isMessageLoading:false});
        }
    },

    sendMessage:async(messageData)=>{
        const {selectedUser,messages}=get();
        try{
            const res=await axiosInstance.post(`/messages/send/${selectedUser.id}`,messageData);
            set({messages:[...messages,res.data]});
        }catch(e){
            toast.error(e.response.data.message);
        }
    },

    setSelectedUser:((selectedUser)=>{
        set({selectedUser:selectedUser})
    })

}))