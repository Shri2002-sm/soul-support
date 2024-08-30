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

app.post('/chat', (req, res) => {
    const userMessage = req.body.message.toLowerCase();
    
    let reply;
    switch (userMessage) {
        case 'hello':
            reply = 'Hi there! How can I assist you today?';
            break;
        case 'what is soul support?':
            reply = 'Soul Support is a platform designed to provide mental health support through various resources, including articles, music therapy, and professional guidance.';
            break;
        case 'how can i book a therapy session?':
            reply = 'You can book a therapy session by visiting our Therapy page and selecting a therapist that suits your needs.';
            break;
        case 'where are you located?':
            reply = 'We offer services online, but if you’re looking for specific locations, please visit our Locations page.';
            break;
        case 'thank you':
            reply = 'You’re welcome! If you have any other questions, feel free to ask.';
            break;
        default:
            reply = 'Sorry, I didn’t understand that. Could you please rephrase your question?';
    }
    
    res.json({ reply });
  });
  

app.post('/signup', (req, res) => {
    const { name, email, password } = req.body;
    // Here you can add code to save the user to a database
    console.log(`New user: ${name}, ${email}`);
    res.status(200).json({ message: 'User registered successfully' });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
