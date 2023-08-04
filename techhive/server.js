import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import multer from 'multer';
import mongoose from 'mongoose';
import { body, validationResult } from 'express-validator';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { sequelize } from './database.js';
import { Internship, UserLikedInternship, SavedInternship } from './models/index.js';
import { User } from './models/index.js';
import {router as authRoutes} from './routes/authRoutes.js';
import { authenticateToken } from './routes/authRoutes.js';
import sgMail from '@sendgrid/mail';
import recommendationRoutes from './routes/recommendationRoutes.js';
import dotenv from 'dotenv';
import { Server } from 'socket.io';
import session from 'express-session';
import messageRoutes from './routes/messages.js'
import SequelizeStoreInit from 'connect-session-sequelize';


sgMail.setApiKey('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');

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
dotenv.config();

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
app.use(express.json()); //Middleware for parsing JSON bodies from HTTP requests
app.use(morgan('combined'));

//Storing sessions in database

const SequelizeStore = SequelizeStoreInit(session.Store);
const sessionStore = new SequelizeStore({
  db: sequelize
});

app.use('/api', recommendationRoutes);

//Configure session middleware
app.use(
  session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: false,
    store: sessionStore,
    cookie: {
      sameSite: false,
      secure: false,
      expires: new Date(Date.now() + (365 * 24 * 60 * 60 * 1000)) // 1 year in milliseconds
    }
  })
);
sessionStore.sync();

//MongoDb Database Setup
mongoose.set('debug', true);

mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
 })
.then(() => {
  console.log("DB Connection Successfull")
 }).catch((err) => {
  console.log(err.message)
 })

const server = app.listen(process.env.PORT, ()=> {
  console.log(`Server Started on Port ${process.env.PORT}`)
});

//Setting up socket io
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    credentials: true,
  },
});

global.onlineUsers = new Map();
io.on("connection", (socket) => {
  global.chatSocket = socket;
  socket.on("add-user", (userId) => {
    onlineUsers.set(userId, socket.id);
  });

  socket.on("send-msg", (data) => {
    const sendUserSocket = onlineUsers.get(data.to);
    if (sendUserSocket) {
      socket.to(sendUserSocket).emit("msg-receiver", data.msg);
    }
  })
})

// Setup multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'images/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({
  storage: storage,
  fileFilter: function (req, file, cb) {
    // accept image files only
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/i)) {
      return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
  },
  limits: { fileSize: 1024 * 1024 * 10 },
});

// Route for user authentication and account creation
app.use('/auth', authRoutes);
app.use('/api/messages', messageRoutes)
app.use('/images', express.static(path.join(__dirname, 'images')));
app.use('/profile-images', express.static(path.join(__dirname, 'profile-images')));


app.get('/', (req, res) => {
  res.send('Welcome to the TechHive API!');
});

//Route to get all internships
app.get('/internships', async (req, res) => {
  try {
    const internships = await Internship.findAll();
    res.json(internships);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

//Route to get internships by id
app.get('/internships/:id', async (req, res) => {
  try {
    const internships = await Internship.findByPk(req.params.id);
    if (internships) {
      res.json(internships);
    } else {
      res.status(404).json({ message: 'Internship not found' });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Route for posting internships
app.post(
  '/internships',
  upload.single('picture'),
  [
    body('title').isLength({ min: 1 }).withMessage('Title is required'),
    body('link').isURL().withMessage('Link must be a valid URL'),
    body('description').isLength({ min: 1 }).withMessage('Description is required'),
    body('company').isLength({ min: 1 }).withMessage('Company is required'),
  ],
  async (req, res) => {
    // Convert 'category' back to an array
    if (typeof req.body.category === 'string') {
      req.body.category = JSON.parse(req.body.category);
    }

    // validate
    const errors = validationResult(req);

    if (!Array.isArray(req.body.category) || req.body.category.length === 0) {
      errors.errors.push({
        value: req.body.category,
        msg: 'Category is required and must be an array',
        param: 'category',
        location: 'body',
      });
    }

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const internship = req.body;
      internship.picture = req.file.filename;
      const newInternship = await Internship.create(internship);

      // Get all student users' email addresses from the database
      const studentUsers = await User.findAll({
        where: {
          accountType: 'student',
        },
      });
      
      const sendPromises = studentUsers.map(async (student) => {
        const msg = {
          to: student.email,
          from: 'techhivewebsite@gmail.com', 
          subject: 'New Internship Opportunity',
          text: `Dear ${student.username}, a new internship is available. Check it out: ${internship.link}`,
          html: `<p>Dear ${student.username},</p><p>A new internship is available. Check it out: <a href="${internship.link}">${internship.link}</a></p>`,
        };
        
        try {
          await sgMail.send(msg);
          console.log(`Email sent to ${student.email}`);
        } catch (error) {
          console.error(`Error sending email to ${student.email}:`, error);
        }
      });

      // Wait for all email sending promises to complete
      await Promise.all(sendPromises);

      res.status(201).json(newInternship);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Could not create internship' });
    }
  }
);

// Route to get all users
app.get('/users', async (req, res) => {
  try {
    const users = await User.findAll();
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Route to get a user by id
app.get('/users/:id', async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Route to update user profile
app.put('/users/:id', [
  body('username').isLength({ min: 1 }).withMessage('Username is required'),
  body('email').isEmail().withMessage('Email must be a valid email address'),
  
], async (req, res) => {
  const userId = req.params.id;
  const updatedUserData = req.body;

  try {
    // Validate request body
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Check if the user exists in the database
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update user data with the provided changes
    user.username = updatedUserData.username;
    user.email = updatedUserData.email;
    user.linkedin = updatedUserData.linkedin

    // Save the updated user data in the database
    await user.save();

    // Return the updated user data
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// Setup multer for profile picture uploads
const profilePictureStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'profile-images/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const profilePictureUpload = multer({
  storage: profilePictureStorage,
  fileFilter: function (req, file, cb) {
    // accept image files only
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/i)) {
      return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
  },
  limits: { fileSize: 1024 * 1024 * 100 },
});

// Route to upload a profile picture
app.post('/users/:userId/profilePicture', profilePictureUpload.single('profilePicture'), async (req, res) => {
  try {
    const user = await User.findByPk(req.params.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.profilePicture = req.file.filename;
    await user.save();

    res.status(200).json({ profilePicture: user.profilePicture });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// Route to serve profile pictures
app.get('/profile/picture/:userId', async (req, res) => {
  try {
    const user = await User.findByPk(req.params.userId);
    if (!user || !user.profilePicture) {
      return res.status(404).json({ message: 'Profile picture not found' });
    }

    const filePath = path.join(__dirname,'profile-images', user.profilePicture);
    res.sendFile(filePath);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

//Routes for Saved Internships
app.post('/internships/:id/save', async (req, res) => {
  const userId = req.body.userId;
  const internshipId = req.params.id;

  try {
    const savedInternship = await SavedInternship.create({ userId, internshipId });
    res.json(savedInternship);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/internships/:id/save', async (req, res) => {
  const userId = req.body.userId;
  const internshipId = req.params.id;

  try {
    await SavedInternship.destroy({ where: { userId, internshipId } });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/users/:id/saved-internships', async (req, res) => {
  const userId = req.params.id;

  try {
    const savedInternships = await SavedInternship.findAll({
      where: { userId },
      include: Internship,
    });
    res.json(savedInternships.map(si => si.Internship));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/like-internships/:id', async (req, res) => {
  const userId = req.body.userId;
  const internshipId = req.params.id;

  try {
    // Check if the user has already liked the internship
    const existingLike = await UserLikedInternship.findOne({
      where: { userId, internshipId },
    });

    if (existingLike) {
      // User already liked the internship, so delete the like
      await UserLikedInternship.destroy({ where: { userId, internshipId } });
      res.json({ liked: false });
    } else {
      // User did not like the internship, so create a new like entry
      await UserLikedInternship.create({ userId, internshipId });
      res.json({ liked: true });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

sequelize
  .sync({ alter: true })
  .then(() => {
    const port = 3000;
    app.listen(port, () => {
      console.log(`App is listening on port ${port}`);
    });
  })
  .catch((error) => {
    console.error('Unable to connect to the database:', error);
  });
