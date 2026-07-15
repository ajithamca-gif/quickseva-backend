import User from "../models/User.js";
import jwt from "jsonwebtoken";

//OTP Generate
const generateOTP = () => {
    return Math.floor(100000+Math.random() * 900000).toString();

};

//Store OTP temporarily
const otpStore = {};

//Send OTP
export const sendOTP = async (req, res) => {
    try{
        const {phone} = req.body;

        if(!phone || phone.length !==10){
            return res.status(400).json({
                message: "Valid phone number required"
            });
        }
        const otp = generateOTP();

        //DB -upsert
        await User.findOneAndUpdate(
            {phone},
            {phone, otp, otpExpiry: Date.now()+5*60*1000},
            {upsert: true, new:true}
        )

        //Later: Real SMS via Twilio/MSG91
        console.log(`OTP for ${phone}:${otp}`);

        res.json({message:"OTP sent successfully", otp});//Remove otp in production
    }
    catch(err){
        res.status(500).json({message: err.message});
    }
}

//Verify OTP
export const verifyOTP = async (req, res) => {
    try{
        const {phone, otp, name}=req.body;
        const user = await User.findOne({phone});

        if(!user || user.otp !== otp || user.otpExpiry < Date.now()){
            return res.status(400).json({message: "Invalid OTP"});
        }

        user.otp = undefined;
        user.otpExpiry = undefined;
        if(name) user.name = name;
        await user.save();


        //JWT token generate
        const token = jwt.sign(
            {id: user._id, role:user.role},
            process.env.JWT_SECRET,
            {expiresIn:"7d"}
        );

        res.json({
            message:"Login successful",
            token,
            user:{id:user._id, name:user.name, phone: user.phone, role:user.role}
        });

    } catch(err) {
        res.status(500).json({message: err.message});
    }
};