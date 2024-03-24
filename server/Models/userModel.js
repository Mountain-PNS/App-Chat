import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required : true,
            minlenght : 3,
            maxlenght : 30
        },
        email : {
            type : String,
            required : true,
            minlenght : 3,
            maxlenght : 200
        },
        password : {
            type : String,
            required : true,
            minlenght : 3,
            maxlenght : 1024
        }
    },
    {
        timestamps: true
    }
)
export default mongoose.model('User',userSchema)