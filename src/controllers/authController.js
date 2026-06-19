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
        otpStore[phone] = otp;

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

        if(otpStore[phone] !== otp){
            return res.status(400).json({message: "Invalid OTP"});
        }

        //OTP correct-delete it
        delete otpStore[phone];

        //User already exists?
        let user = await User.findOne({phone});

        if(!user){
            //New user - create
            user = await User.create({name: name || "User", phone});
        }

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