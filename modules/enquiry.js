import mongoose, { Mongoose } from 'mongoose'

const userSchema = new mongoose.Schema({
    email:{
        type:String,
        required:true,
    },
    comment:{
        type:String,
        required:true
    },
    status:{
        type:String,
        default:"In progress",
        enum:["In progress","Contacted"]
    },
    projectId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Project"
    },
    serviceId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Service"
    },
    sort:{
        type:String,
        enum:["general","project","service"],
        default:'general'
    }
},{
    timestamps:true
});

//Export the model
export default mongoose.model('Enquiry', userSchema);