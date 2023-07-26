import Messages from '../models/messageModel.js';
import { User } from '../models/index.js';
import mongoose from 'mongoose';

export async function getMessages(req, res, next) {
    try {
      const { from, to } = req.body;
  
      // Check if the sender and receiver exist in the user database using Sequelize
      const senderExists = await User.findOne({ where: { username: from } });
      const receiverExists = await User.findOne({ where: { username: to } });

      // If either the sender or receiver doesn't exist, return an error response
      if (!senderExists || !receiverExists) {
        return res.status(404).json({ error: "Sender or receiver does not exist." });
      }
  
      // Now use Mongoose to find messages between the specified sender and receiver
      const messages = await Messages.find({
        sender: from,
        receiver: to,
      }).sort({ updatedAt: 1 });
  
      const projectedMessages = messages.map((msg) => {
        return {
          fromSelf: msg.sender === from,
          message: msg.message.text,
          sender: msg.sender,
          receiver: msg.receiver,
        };
      });
      res.json(projectedMessages);
    } catch (ex) {
      next(ex);
    }
}


export async function addMessage(req, res, next) {
    try {
      const { from, to, message } = req.body;
      
      // Check if the sender and receiver exist in the user database
      const senderExists = await User.findOne({ where: { username: from } });
      const receiverExists = await User.findOne({ where: { username: to } });

      // If either the sender or receiver doesn't exist, return an error response
      if (!senderExists || !receiverExists) {
        return res.status(404).json({ error: "Sender or receiver does not exist." });
      }
  
      const data = await Messages.create({
        message: { text: message },
        sender: from,
        receiver: to,
      });
  
      if (data) return res.json({ msg: "Message added successfully." });
      else return res.json({ msg: "Failed to add message to the database" });
    } catch (ex) {
      next(ex);
    }
}
