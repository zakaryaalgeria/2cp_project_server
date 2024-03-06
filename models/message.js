import mongoose from "mongoose";

// Declare the Schema of the Mongo model
var messageSchema = new mongoose.Schema({
    content:{
        type:String,
        maxlength: 200,
    },
    sender:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    }
},{
    timestamps:true
});

export default mongoose.model('Message', messageSchema);