const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = 5000;

// Middleware
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/pdf', express.static(path.join(__dirname, 'pdf')));

// Serve HTML files
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

a
  

app.post('/signup', (req, res) => {
    const { name, email, password } = req.body;
    // Here you can add code to save the user to a database
    console.log(`New user: ${name}, ${email}`);
    res.status(200).json({ message: 'User registered successfully' });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
