import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { User } from '../models/index.js';

export const router = express.Router();

export const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.sendStatus(401);
  }

  jwt.verify(token, 'your-secret-key', (err, user) => {
    if (err) {
      return res.sendStatus(403);
    }
    req.user = user; // Set the user ID in the request object
    next();
  });
};

// Route for user signup
router.post('/signup', async (req, res) => {
  try {
    const { username, email, password, accountType, industry, university, major } = req.body;

    //Check if the email already exists in the database
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(409).json({ message: 'Email already exists' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const newUser = await User.create({ username, email, password: hashedPassword, accountType });

    // If the account type is 'company', store the industry
    if (accountType === 'company') {
      newUser.industry = industry;
      await newUser.save();
    }

    if (accountType === 'student') {
      newUser.university = university;
      newUser.major = major;
      await newUser.save();
    }
    // Generate a JWT token
    const token = jwt.sign({ userId: newUser.id }, 'your-secret-key');

    res.status(201).json({ user: newUser, token });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Route for user login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if the email exists in the database
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Compare the provided password with the hashed password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid password' });
    }

    // Generate a JWT token
    const token = jwt.sign({ userId: user.id }, 'your-secret-key');

    res.json({ user, token });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

//Get all users
router.get('/users', async (req, res) => {
  try {
    const users = await User.findAll();
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});