import Order from "../models/Order.js";

export const createOrder = async (req, res) => {
    try {
        if (req.user.role === "admin") {
            return res.status(403).json({ message: "Admin accounts cannot place orders" });
        }
        const { serviceId, serviceName, description,
            name, phone, delivery, address, notes,
            amount } = req.body;


        const order = await Order.create({
            user: req.user.id,
            serviceId,
            serviceName,
            description,
            name,
            phone,
            delivery,
            address,
            notes,
            amount,
            file: req.files ? req.files.map(f => f.filename) : [], //array 
        });

        res.status(201).json({
            message: "Order created successfully",
            order,
        });


    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

//get my orders
export const getMyOrders = async (req, res) => {
    try {
        const orders = await Order.find
            ({ user: req.user.id }).sort
            ({
                createdAt: -1
            });

        res.json(orders);
    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
};

//Get all orders(admin only)
export const getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find().populate
            ("user", "name phone").sort
            ({ createdAt: -1 });
        res.json(orders);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }

};

//Updage Order Status (Admin only)
export const updateOrderStatus = async (req, res) => {
    try {
        console.log("Update request:", req.params.id, req.body.status);
        const { status } = req.body;

        const order = await Order.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true }
        );
        console.log("Updated order:", order);

        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }
        res.json({ message: "Status updated", order });

    } catch (error) {
        console.log("Error:", error.message);
        res.status(500).json({ message: error.message });
    }
};