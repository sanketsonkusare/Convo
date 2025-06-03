import jwt from "jsonwebtoken";
import User from "../models/usermodel.js";

export const authenticator = async (req, res, next) => {
    try{
        const token = req.cookies.jwt;

        if(!token){
            return res.status(401).json({message: "You're unauthorised user"});
        }

        const decoded = jwt.verify(token,process.env.JWT_SECRET)
        if(!decoded){
            return res.status(401).json({message: "You're unauthorised user"});
        }
        
        const user = await User.findById(decoded.userId).select("-password");
        if(!user){
            return res.status(401).json({message: "Invalid User"});
        }

        req.user = user

        next()
    } catch (error) {
        console.log("Error in authenticator middleware", error.message);
        res.status(500).json({ message: "Internal server Error" });
    }
}