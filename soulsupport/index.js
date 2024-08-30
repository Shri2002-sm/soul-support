const express = require("express");
const path = require("path");
const hbs = require("hbs");
const collection = require("./mongodb");

const app = express();
const templatePath = path.join(__dirname, "../templates");
const publicPath = path.join(__dirname, "../public");

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Serve static files
app.use('/templates/styles', express.static(path.join(publicPath, './templates/styles')));
app.use(express.static(publicPath));
app.use('/pdf', express.static(path.join(__dirname, 'pdf')));

// View engine setup
app.set("view engine", "hbs");
app.set("views", templatePath);

// Routes
app.get("/", (req, res) => {
  res.render("home");
});

app.get("/signup", (req, res) => {
  res.render("signup");
});

app.get("/home", (req, res) => {
  res.render("home");
});

app.get("/demo", (req, res) => {
  res.render("demo");
});

app.get("/knowmore", (req, res) => {
  res.render("knowmore");
});

app.get("/splashscreen", (req, res) => {
  res.render("splashscreen");
});

app.get("/login", (req, res) => {
  res.render("login");
});

app.get("/quotes", (req, res) => {
  res.render("quotes");
});

app.get("/therapy", (req, res) => {
  res.render("therapy");
});

app.get("/landingPage", (req, res) => {
  res.render("landingPage");
});

app.post("/signup", async (req, res) => {
  const data = {
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
  };
  await collection.insertMany([data]);
  res.render("login");
});

app.post("/login", async (req, res) => {
  try {
    const check = await collection.findOne({ email: req.body.email });
    if (check && check.password === req.body.password) {
      res.render("landingPage");
    } else {
      res.send("Wrong password");
    }
  } catch (error) {
    res.send("Wrong details");
  }
});

// Start server
app.listen(3001, () => {
  console.log('Server listening on port 3001');
});
