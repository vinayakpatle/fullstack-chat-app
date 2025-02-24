import jwt from "jsonwebtoken";

const generateToken=(user_id,res)=>{
    const token=jwt.sign({user_id},process.env.JWT_SECRET,{
        expiresIn:"7d",
    });

    res.cookie("jwt",token,{
        maxAge:7*24*60*60*1000, // milisecond
        httpOnly:true,
        sameSite:"strict",
        secure:process.env.NODE_ENV!=="development"
    })

    return token;
}

export default generateToken;