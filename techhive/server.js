import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import multer from 'multer';
import { body, validationResult } from 'express-validator';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { sequelize } from './database.js';
import { Internship } from './models/index.js';
import { User } from './models/index.js';
import { SavedInternship } from './models/savedInternships.js';
import {router as authRoutes} from './routes/authRoutes.js';
import { authenticateToken } from './routes/authRoutes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

app.use(cors());
app.use(express.json()); //Middleware for parsing JSON bodies from HTTP requests
app.use(morgan('combined'));

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

app.use('/images', express.static(path.join(__dirname, 'images')));

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
      internship.picture = req.file.filename; // Assigning the saved file name to the picture field
      const newInternship = await Internship.create(internship);
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
  limits: { fileSize: 1024 * 1024 * 10 },
});

// Route to upload a profile picture
app.post(
  '/profile/picture',
  authenticateToken,
  profilePictureUpload.single('picture'),
  async (req, res) => {
    try {
      // Save the profile picture filename to the user's record in the database
      const user = await User.findByPk(req.user.id);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      user.profilePicture = req.file.filename;
      await user.save();

      res.status(200).json({ message: 'Profile picture uploaded successfully' });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
);

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
