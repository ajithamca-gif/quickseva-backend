import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,

    },
    serviceId: {
        type: Number,
        required: true,

    },
    serviceName: {
        type: String,
        required: true,

    },
    description:{
        type: String,
        default:"",
    },
    name: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
        required: true,

    },
    delivery: {
        type: String,
        enum: ["pickup", "doorstep"],
        default: "pickup",

    },
    address: {
        type: String,
        default: "",

    },
    notes: {
        type: String,
        default: "",

    },
    amount: {
        type: Number,
        // enum:["pending", "processing", "completed", "cancelled"],
        // default:"pending",
        required: true,
    },
    file:{
        type: [String], // array of filenames
        default: [],
    },
    status: {
        type: String,
        enum: ["pending", "processing", "completed", "cancelled"],
        default: "pending",
    },

}, {
    timestamps: true
});
export default mongoose.model("Order", orderSchema);