
import pgClient from "../lib/db.js";
import cloudinary from "../lib/cloudinary.js";
import {getReceiverSocketId,ws} from "../lib/socket.js";

export const getUsersForSidebar=async (req,res)=>{
    try{
        const loggedId=req.user.id;
        const getUsersQuery="SELECT id,email,full_name,profile_pic,created_at,updated_at FROM users WHERE id!=$1";
        const response=await pgClient.query(getUsersQuery,[loggedId]);

        res.status(200).json(response.rows);

    }catch(e){
        console.log("Error in getUsersForSidebar",e.message);
        res.status(500).json({message:"Internal server error"});
    }
}

export const getMessages=async (req,res)=>{
    try{
        const {id:userIdToChat}=req.params;
        const sender_id=req.user.id;

        if(!userIdToChat){
            return res.status(400).json({message:"Receiver_ id is required"});
        }

        const getMessagesQuery="SELECT * FROM messages WHERE (sender_id=$1 AND receiver_id=$2) OR (sender_id=$2 AND receiver_id=$1)";
        const response=await pgClient.query(getMessagesQuery,[sender_id,userIdToChat]);
        const messages=response.rows;

        res.status(200).json(messages);
    }catch(e){
        console.log("Error in getMessages controller ",e.message);
        res.status(500).json({message:"Internal server error"});
    }
}

export const sendMessage=async (req,res)=>{
    try{
        const {text,image}=req.body;
        const {id:receiver_id}=req.params;
        const sender_id=req.user.id;

        let imageUrl=null;
        if(image){
            const uploadedResponse=await cloudinary.uploader.upload(image);
            imageUrl=uploadedResponse.secure_url;
        }

        const sendMessageQuery="INSERT INTO messages(sender_id,receiver_id,text,image) VALUES($1,$2,$3,$4) RETURNING *";
        const response =await pgClient.query(sendMessageQuery,[sender_id,receiver_id,text,imageUrl]);

        const newMessage=response.rows[0];
        const receiverSocketId=getReceiverSocketId(receiver_id);
        if(receiverSocketId){
            ws.to(receiverSocketId).emit("newMessage",newMessage);
        }

        res.status(201).json(response.rows[0]);

    }catch(e){
        console.log("Error in sendMessage controller ",e.message);
        res.status(500).json({message:"Internal server error"});
    }
}