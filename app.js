// Imports
const express = require('express');
const mongoose = require('mongoose');
const Note = require('./models/note');

// Creating Express App
const app = express();

// Connect to MongoDB Atlas and listen for requests
const dbURI = "mongodb+srv://Imran310:XUg9l5qYDfp0lF96@cluster1.6nrpckq.mongodb.net/?retryWrites=true&w=majority";

mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(result => app.listen(process.env.PORT || 5000))
    .catch(err => console.log(err));

// Register View Engine
app.set('view engine', 'ejs');

// Folder for static files
app.use(express.static('styles'));
app.use(express.urlencoded({ extended: true }));

// Routes
app.get('/', (req, res) => {
    res.redirect('/notes');
});

app.get('/about', (req, res) => {
    res.render('about', { title: 'About' });
});

// Note Routes
app.get('/notes/create', (req, res) => {
    res.render('create', { title: 'Create' });
});

// Displaying the notes which are stored on the database
app.get('/notes', (req, res) => {
    Note.find().sort({ createdAt: -1 })
        .then(result => {
            res.render('index', { notes: result, title: 'All Notes' });
        })
        .catch(err => console.log(err));
});

// Storing the notes in database
app.post('/notes', (req, res) => {
    const note = new Note(req.body);
    note.save()
        .then(result => res.redirect('/notes'))
        .catch(err => console.log(err))
});

// Finding a particular note from the database using its ID
app.get('/notes/:id', (req, res) => {
    const id = req.params.id;
    Note.findById(id)
        .then(result => {
            res.render('details', { note: result, title: 'Note Details' });
        })
        .catch(err => {
            console.log(err);
        });
});

// Deleting a note from the database
app.delete('/notes/:id', (req, res) => {
    const id = req.params.id;

    Note.findByIdAndDelete(id)
        .then(result => {
            res.json({ redirect: '/notes' });
        })
        .catch(err => {
            console.log(err);
        });
});

// Error Page
app.use((req, res) => {
    res.status(404).render('error', { title: 'Not Found' });
});


