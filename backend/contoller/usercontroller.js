// logic for registration
import {User} from '../models/usermodel.js'
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export const register = async (req,res)=>{
    try {
        const {fullname,email,phoneNumber,password,role} = req.body;
        if(!fullname || !email || !phoneNumber || !password || !role){
            return res.status(400).jsonn({
                message: "something is missing",
                success: false,
            });
        }
        const user = await User.findOne({email});
        if(user){
            return res.status(400).json({
                message: "user already exists",
                success: false,
            })
        }
        const hashedPassword = await bcrypt.hash(password,10);
        await User.create({
            fullname,
            email,
            phoneNumber,
            password: hashedPassword, 
            role
        });
        return res.status(201).json({
            message: "Accpunt created successfully",
            success: true
        });
    } catch (error) {
        console.log(error)
    }
}
// logic for login
export const login = async(req,res)=>{
    try{
        const {email,password,role} = req.body;
        if(!email || !password || !role){
            return res.status(400).jsonn({
                message: "something is missing",
                success: false,
            });
        };
        let user = await User.findOne({email});
        if(!user){
            return res.statsu(400).json({
                message:"incorrect email or password",
                success: false,
            })
        }
        const isPasswordMatched = await bcrypt.compare(password,user.password);
        if(!isPasswordMatched){
            return res.statsu(400).json({
                message: "incorrect email or password",
                success: false,
            })
        };
        // check role is correct or not
        if(user != user.role){
            return res.status(400).json({
                message: "account doesn't exist with current role" ,
                success: false ,
            })
        };
        const tokenData = {
            userId: user._id
        }
        const token = await jwt.sign(tokenData,process.env.SECRET_KEY,{expiresIn: '1d'});

        user = {
            _id: user._id,
            fullname: user.fullname,
            email: user.email,
            phoneNumber:user.phoneNumber,
            role: user.role,
            profile: user.profile
        }

        return res.status(200).cookie("token", token,{maxAge:1*24*60*60*1000, httpsOnly:true, sameSite: 'strict' }).json({
            message:`welcome back ${user.fullname}`,
            success: true,
        });
        
    }
    catch(error){
        console.log(error);
    }
}
// logic for logout
export const logout = async(req,res)=>{
    try {
        return res.status(200).cookie("token","",{maxAge:0}).json({
            messgae: "Logout successfully",
            success: true
        })
    } catch (error) {
        console.log(error)   
    }
}
// logic to update profile
export const updateProfile = async(req,res) =>{
    try{
        const {fullname,email,phoneNumber,bio,skills} = req.body;
        const file = req.file;
        if(!email || !email || !phoneNumber || !bio || !skills){
            return res.status(400).jsonn({
                message: "something is missing",
                success: false,
            });
        };

        // cloudinary  ayega idhar 

        const skillsArray = skills.split(",");
        const userId = req.id;
        let user = await User.findById(userId);
        if(!user){
            return res.status(400).json({
                message:"user not found",
                success:false,
            });
        }
        // updating data
        user.fullname = fullname,
        user.email = email,
        user.phoneNumber = phoneNumber,
        user.profile.bio = bio,
        user.profile.skills = skillsArray

        //resume comes later here

        await user.save();

        user = {
            _id: user._id,
            fullname: user.fullname,
            email: user.email,
            phoneNumber:user.phoneNumber,
            role: user.role,
            profile: user.profile
        }
        return res.status(200).json({
            message:" Profile updated successfully",
            user,
            success: false,
        })

        
    }
    catch{
        console.log(error);
    }
}