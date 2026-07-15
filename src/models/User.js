import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true,
        unique: true,
    },

    role: {
        type: String,
        enum: ["user", "admin"],
        default: "user",
    },
    otp: String,
    otpExpiry: Date,
},

    {
        timestamps: true
    },

);
export default mongoose.model("User", userSchema);