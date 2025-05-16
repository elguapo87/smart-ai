import mongoose from "mongoose";

const userAuthSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
    },
    password: { 
        type: String, 
        required: true 
    }
}, { timestamps: true });

const userAuthModel = mongoose.models.userAuth || mongoose.model("userAuth", userAuthSchema);

export default userAuthModel;