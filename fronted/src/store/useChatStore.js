import {create} from "zustand";
import toast from "react-hot-toast";
import {axiosInstance} from "../lib/axios";
import {useAuthStore} from "./useAuthStore";

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
        set({isMessagesLoading:true});
        try{
            const res=await axiosInstance.get(`/messages/${user_id}`);
            set({messages:res.data});
        }catch(e){
            toast.error(e.response.data.message);
        }finally{
            set({isMessagesLoading:false});
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

    subscribeToMessages:()=>{
        const {selectedUser}=get();
        if(!selectedUser) return ;
        const socket=useAuthStore.getState().socket;

        socket.on("newMessage",(newMessage)=>{
            if(newMessage.sender_id===selectedUser.id){
                set({messages:[...get().messages,newMessage]});
            }
        })
    },

    unSubscribeToMessages:()=>{ // to remove the event listener
        const socket=useAuthStore.getState().socket;
        socket.off("newMessage");
    },

    setSelectedUser:((selectedUser)=>{
        set({selectedUser:selectedUser});
    })

}))