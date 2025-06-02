import User from "../models/usermodel.js";
import bcrypt from "bcryptjs";
import { generateToken } from "../lib/utils.js";
import cloudinary from "../lib/cloudinary.js"

export const signup = async (req, res) => {
    const {username, email, password} = req.body;
    try{
        if (!username || !email || !password){
            return res.status(400).json({message:"All fields are required"});
        }
        if (password.length < 6) {
            return res.status(400).json({message:"Password must be at least 6 characters long"});
        }

        const user = await User.findOne({email})

        if(user) return res.status(400).json({message:"Email already exists"});

        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password,salt)

        const newUser = new User({
            username : username,
            email : email,
            password:hashedPassword,
        })
        if(newUser) {
            generateToken(newUser._id,res)
            await newUser.save();

            res.status(201).json({
                _id:newUser._id,
                username: newUser.username,
                email: newUser.email,
                profilepic: newUser.profilepic,
                createdAt: newuser.createdAt,
            });
        } else {
            res.status(400).json({ message: "Invalid user data "});
        }
    } catch (error) {
        console.log("Error in signup controller", error.message);
        res.status(500).json({message:"Internal server Error"});
    }
};

export const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        if (!email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Invalid email or password" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid email or password" });
        }

        generateToken(user._id, res);

        res.status(200).json({
            _id: user._id,
            username: user.username,
            email: user.email,
            profilepic: user.profilepic,
            createdAt: user.createdAt,
        });
    } catch (error) {
        console.log("Error in login controller", error.message);
        res.status(500).json({ message: "Internal server Error" });
    }
};

export const logout = (req, res) => {
    try{
        res.cookie("jwt","",{maxAge:0});
        res.status(200).json({message:"logged out successfully"});
    } catch(error) {
        console.log("Error in logging out controller", error.message);
        res.status(500).json({ message: "Internal server Error" });
    }
};

export const updateProfile = async (req, res) => {
    try{
        const {profilepic} = req.body;
        const userId = req.user._id;

        if(!profilepic){
            return res.status(401).json({message: "Profile Picture is required"});
        }

        const uploadRes = await cloudinary.uploader.upload(profilepic)
        const updatedUser = await User.findByIdAndUpdate(
            userId,{profilepic: uploadRes.secure_url}, {new: true}
        );
        res.status(200).json(updatedUser);
    } catch (error) {
        console.log("Error in update profile",error);
        res.status(500).json({message:"Internal server error"});
    }
};

export const checkAuth = async (req, res) =>{
    try{
        res.status(200).json(req.user);
    } catch (error){
        console.log("Error in checkAuth controller", error.message);
        res.status(500).json({ message: "Internal server Error" });
    }
}