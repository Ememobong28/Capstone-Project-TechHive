import mongoose from "mongoose";

const MessageSchema = new mongoose.Schema(
  {
    message: {
      text: { type: String, required: true },
    }, 

    sender: {
        type: String,
        ref: "User",
        required: true,
    },
    receiver: {
        type: String,
        ref: "User",
        required: true,
      },
},
  {
    timestamps: true,
  }
);


export default mongoose.model('Messages', MessageSchema);
