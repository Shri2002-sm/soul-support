const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const hbs = require('hbs');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const mongoose = require('mongoose');
const User = require('../soulsupport/templates/scripts/user'); // Import User model
const Post = require('../soulsupport/templates/scripts/post'); // Import Post model
const Story = require('../soulsupport/templates/scripts/story'); // Import Story model
const Message = require('../soulsupport/templates/scripts/message'); // Import Message model

// Initialize Express app
const app = express();
const PORT = 5000;

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/pdf', express.static(path.join(__dirname, 'pdf')));

// Set view engine to hbs
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'templates'));

// Session middleware
app.use(session({
    secret: 'your_secret_key',
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({ mongoUrl: 'mongodb://localhost:27017/soul_support' })
}));

// Serve the home.hbs template
app.get('/', (req, res) => {
    res.render('home'); // This will render home.hbs from the templates folder
});

// Signup route
app.post('/signup', async (req, res) => {
    const { name, email, password } = req.body;
    try {
        const user = new User({ name, email, password });
        await user.save();
        res.status(200).json({ message: 'User registered successfully' });
    } catch (error) {
        res.status(400).json({ error: 'Error registering user' });
    }
});

// Login route
app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email, password });
        if (user) {
            req.session.userId = user._id;
            res.status(200).json({ message: 'Login successful' });
        } else {
            res.status(400).json({ error: 'Invalid credentials' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Error logging in' });
    }
});

// Create a new post
app.post('/post', async (req, res) => {
    const { image, caption } = req.body;
    const userId = req.session.userId;
    try {
        const post = new Post({ userId, image, caption });
        await post.save();
        res.status(200).json({ message: 'Post created successfully' });
    } catch (error) {
        res.status(400).json({ error: 'Error creating post' });
    }
});

// Get all posts
app.get('/posts', async (req, res) => {
    try {
        const posts = await Post.find().populate('userId');
        res.status(200).json(posts);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching posts' });
    }
});

// Create a new story
app.post('/story', async (req, res) => {
    const { image } = req.body;
    const userId = req.session.userId;
    try {
        const story = new Story({ userId, image });
        await story.save();
        res.status(200).json({ message: 'Story created successfully' });
    } catch (error) {
        res.status(400).json({ error: 'Error creating story' });
    }
});

// Get all stories
app.get('/stories', async (req, res) => {
    try {
        const stories = await Story.find().populate('userId');
        res.status(200).json(stories);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching stories' });
    }
});

// Send a message
app.post('/message', async (req, res) => {
    const { receiverId, text } = req.body;
    const senderId = req.session.userId;
    try {
        const message = new Message({ senderId, receiverId, text });
        await message.save();
        res.status(200).json({ message: 'Message sent successfully' });
    } catch (error) {
        res.status(400).json({ error: 'Error sending message' });
    }
});

// Get messages between two users
app.get('/messages/:userId', async (req, res) => {
    const userId = req.params.userId;
    const senderId = req.session.userId;
    try {
        const messages = await Message.find({
            $or: [
                { senderId, receiverId: userId },
                { senderId: userId, receiverId: senderId }
            ]
        }).populate('senderId').populate('receiverId');
        res.status(200).json(messages);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching messages' });
    }
});

// Serve the therapy.hbs template
app.get('/therapy.hbs', (req, res) => {
    res.render('therapy');
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
