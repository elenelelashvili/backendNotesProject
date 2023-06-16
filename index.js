const express = require('express')
const mongoose = require('mongoose')
const Note = require('./models/Note')
const User = require('./models/User')
const app = express()
app.use(express.json())
app.use(express.urlencoded())
const port = 3000


mongoose.connect('mongodb+srv://elenelelashvili6:45ob3T6NWxiIZhIb@notesappcluster.cyo8tqp.mongodb.net/?retryWrites=true&w=majority')

app.get('/', (req, res) => {
  res.sendFile("pages/index.html", {root:__dirname})
})

app.get('/signup', (req, res) => {
    res.sendFile("pages/signup.html", {root:__dirname})
  })

app.get('/signin', (req, res) => {
    res.sendFile("pages/signin.html", {root:__dirname})
  })

  app.get('/main', (req, res) => {
    res.sendFile("pages/main.html", {root:__dirname})
  })

//rom vipovo romel users romeli notebi aqvs

app.post('/getnotes', async (req, res) => {
  try {
    const { email } = req.body;

    // Find notes based on the user's email
    const notes = await Note.find({ email });

    res.status(200).json({ success: true, notes });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Failed to get notes' });
  }
});

app.post('/signup', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(200).json({ success: false, message: "User already exists" });
    }

    // Create a new user
    const user = await User.create({ email, password });

    res.status(200).json({ success: true, user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Failed to sign up' });
  }
});

app.post('/signin', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find the user based on the provided email and password
    const user = await User.findOne({ email, password });

    if (!user) {
      // User not found
      res.status(200).json({ success: false, message: "Invalid email or password" });
    } else {
      // User found, send success response with user email
      res.status(200).json({ success: true, user: { email: user.email }, message: "Login success" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Failed to sign in' });
  }
});

app.post('/addnote', async (req, res) => {
  try {
    const { userToken, title, desc, email } = req.body;

    // Create a new note document
    const note = await Note.create({ title, desc, email });

    res.status(200).json({ success: true, note });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Failed to add note' });
  }
});
app.post('/deletenote', async (req, res) => {
  try {
    const { noteId } = req.body;

    await Note.findByIdAndDelete(noteId);

    res.status(200).json({ success: true, message: 'Note deleted' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Failed to delete note' });
  }
});



app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

