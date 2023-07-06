// app.js
// app.js
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { sequelize } from './database.js';
import { User, Post, Internship } from './models/index.js';

const app = express();

app.use(cors())
app.use(express.json()); // Middleware for parsing JSON bodies from HTTP requests
app.use(morgan())

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

// Route to get all posts, with associated users
app.get('/posts', async (req, res) => {
  try {
    const posts = await Post.findAll({
      include: [{ model: User, as: 'user' }],
      order: [['createdAt', 'DESC']]
    });
    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.get('/internships', async (req, res) => {
  try {
    const internships = await Internship.findAll();
    res.json(internships);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.get('/internships/:id', async (req, res) => {
  try {
    const internship = await Internship.findByPk(req.params.id);
    if (internship) {
      res.json(internship);
    } else {
      res.status(404).json({ message: 'Internship not found' });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// Route to create a new post
app.post('/posts', async (req, res) => {
  try {
    const post = await Post.create(req.body);

    const postWithUser = await Post.findOne({
      where: { id: post.id },
      include: [{ model: User, as: 'user' }]
    });

    res.status(201).json(postWithUser);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.post('/internships', async (req, res) => {
  try {
    const internship = await Internship.create(req.body);
    res.status(201).json(internship);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


sequelize.sync({ alter: true })
  .then(() => {
    const port = 3000;
    app.listen(port, () => {
      console.log(`App is listening on port ${port}`);
    });
  })
  .catch(error => {
    console.error('Unable to connect to the database:', error);
  });