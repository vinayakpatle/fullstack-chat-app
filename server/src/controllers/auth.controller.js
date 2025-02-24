import pgClient from "../lib/db.js";
import bcrypt from "bcrypt";
import generateToken from "../lib/utils.js";
import cloudinary from "../lib/cloudinary.js";


export const signup=async(req,res)=>{
    const {email,full_name,password}=req.body;

    try{
        if(!email || !full_name || !password){
            return res.status(400).json({message:"All field are required"});
        }

        if(password.length<6){
            return res.status(400).json({message:"Password must be atleast 6 character"});
        }
        const userExistQuery="SELECT * FROM users WHERE email=$1";
        const response1=await pgClient.query(userExistQuery,[email]);
        const user=response1.rows[0];
        if(user){
            return res.status(400).json({message:"User already exist"});
        }

        const hashedPassword=await bcrypt.hash(password,10) //10-salt round
        const createUserQuery="INSERT INTO users(email,full_name,password) VALUES($1,$2,$3) RETURNING id,profile_pic,created_at";
        const response2 =await pgClient.query(createUserQuery,[email,full_name,hashedPassword]);
        const newUser=response2.rows[0];

        const token=generateToken(newUser.id,res);

        res.status(201).json({
            id:newUser.id,
            email,
            full_name,
            profile_pic:newUser.profile_pic,
            created_at:newUser.created_at,
            token
        })

    }catch(e){
        console.log("Error in signup controller ",e.message);
        res.status(500).json({message:"Internal server problem"})
    }
}

export const login=async (req,res)=>{
    const {email, password}=req.body;

    try{
        const userExistQuery="SELECT * FROM users WHERE email=$1";
        const response=await pgClient.query(userExistQuery,[email]);
        const user=response.rows[0];

        if(!user){
            return res.status(400).json({message:"Invalid credentials"});
        }

        const isPasswordMatch=await bcrypt.compare(password,user.password);
        if(!isPasswordMatch){
            return res.status(400).json({message:"Invalid credentials"});
        }

        const token=generateToken(user.id,res);

        res.status(200).json({
            id:user.id,
            email:user.email,
            full_name:user.full_name,
            profile_pic:user.profile_pic,
            created_at:user.created_at,
            token
        })
    }catch(e){
        console.log("Error in login controller",e.message);
        res.status(500).json({message:"Internal server error"})
    }
}

export const logout=(req,res)=>{
    try{
        res.cookie("jwt","",{maxAge:0});
        res.status(200).json({message:"Logged out successfully"});
    }catch(e){
        console.log("Error in logout controller",e.message);
        res.status(500).json({message:"Internal server error"});
    }
}

export const updateProfile=async(req,res)=>{

    try{
        const {profile_pic}=req.body;
        const user=req.user;
        if(!profile_pic){
            return res.status(400).json({message:"Profile_pic is required"});
        }

        const uploadResponse=await cloudinary.uploader.upload(profile_pic);
        const updateQuery="UPDATE users SET profile_pic=$1 WHERE id=$2 RETURNING id,email,full_name,profile_pic,created_at";
        const response=await pgClient.query(updateQuery,[uploadResponse.secure_url,user.id]);
        
        if(response.rows.length===0){
            return res.status(400).json({message:"User not found"});
        }
        const updatedUser=response.rows[0];
        res.status(200).json(updatedUser);

    }catch(e){
        console.log("Error in profile_update controller",e.message);
        res.status(500).json({message:"Internal server error"});
    }
}


export const authCheck=(req,res)=>{
    try{
        res.status(200).json(req.user);
    }catch(e){
        console.log("Error in authChech controller",e.message);
        res.status(500).json({message:"Internal server error"});
    }
}