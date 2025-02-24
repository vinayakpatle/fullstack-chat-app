import {Server} from "socket.io";
import http  from 'http';
import express from "express";

const app=express();
const server=http.createServer(app);

const ws=new Server(server,{
    cors:{
        origin:["http://localhost:5173"],
    }
})

// to store all the users socket id which are connected to the server 
const usersSocketMap={};  //{user_id:socket_id}

export const getReceiverSocketId=(receiver_id)=>{
    return usersSocketMap[receiver_id];
}

ws.on("connection",(socket)=>{
    console.log(`A user connected ${socket.id}`);

    const user_id=socket.handshake.query.user_id;
    usersSocketMap[user_id]=socket.id;

    socket.emit("getOnlineUsers",Object.keys(usersSocketMap)); // send all the online users to the connected user 

    socket.on("disconnect",()=>{
        console.log(`A user disconnected ${socket.id}`);
        delete usersSocketMap[user_id];
        socket.emit("getOnlineUsers",Object.keys(usersSocketMap));
    })
})

export {app,ws,server};