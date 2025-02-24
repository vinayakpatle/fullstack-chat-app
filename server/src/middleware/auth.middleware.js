import jwt from "jsonwebtoken";
import pgClient from "../lib/db.js";

const authMiddleware=async (req,res,next)=>{
    try{
        const token=req.cookies.jwt;
       
        if(!token){
            return res.status(400).json({message:"Unauthorized-Token not provided"});
        }

        const decoded=jwt.verify(token,process.env.JWT_SECRET);
       
        if(!decoded){
            return res.status(400).json({message:"Unauthorized-Invalid token"});
        }

        const findUserQuery="SELECT id,email,full_name,profile_pic,created_at,updated_at FROM users WHERE id=$1";
        const response=await pgClient.query(findUserQuery,[decoded.user_id]);
        const user=response.rows[0];

        if(!user){
            res.status(400).json({message:"User not found"});
        }

        req.user=user;
        next();

    }catch(e){
        console.log("Error in auth-middleware",e.message);
        res.status(500).json({message:"Internal server error"});
    }
}

export default authMiddleware;