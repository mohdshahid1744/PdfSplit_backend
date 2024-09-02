import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    pdf:{
        type: String,
    },
    uploadDate: {
         type: Date, 
         default: Date.now },
})

const userModel = mongoose.model("User", userSchema);

export default userModel;