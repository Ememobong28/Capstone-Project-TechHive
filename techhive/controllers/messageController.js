import Messages from '../models/messageModel.js'
import { User } from '../models/index.js';
import mongoose from 'mongoose';
import { isValidObjectId } from 'mongoose';

export async function getMessages(req, res, next) {
    try {
      const { from, to } = req.body;
  
      // Find the sender and receiver users based on their usernames
      const senderUser = await User.findOne({ where: { username: from } });
      const receiverUser = await User.findOne({ where: { username: to } });
  
      if (!senderUser || !receiverUser) {
        return res.status(404).json({ error: 'Invalid usernames' });
      }
  
      // Get the corresponding MongoDB ObjectIds for sender and receiver
      const fromObjectId = senderUser._id;
      const toObjectId = receiverUser._id;
  
      const messages = await Messages.find({
        users: {
          $all: [fromObjectId, toObjectId],
        },
      }).sort({ updatedAt: 1 });
  
      const projectedMessages = messages.map((msg) => {
        return {
          fromSelf: msg.sender.toString() === fromObjectId.toString(),
          message: msg.message.text,
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
  
      const senderUser = await User.findOne({ username: from });
      if (!senderUser) {
        return res.status(404).json({ msg: 'Sender user not found' });
      }
  
      const data = await Messages.create({
        message: { text: message },
        users: [from, to],
        sender: new mongoose.Types.ObjectId(senderUser.id), 
      });
  
      if (data) return res.json({ msg: 'Message added successfully.' });
      else return res.json({ msg: 'Failed to add message to the database' });
    } catch (ex) {
      next(ex);
    }
  }
  
  
  
  
  
  
  