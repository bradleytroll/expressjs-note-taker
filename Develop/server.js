const express = require('express');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

const notesData = require('./db/db.json')

const app = express();
const PORT = 3001;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// app.get('/', (req, res) => {
//     fs.readFile(path.join(__dirname, 'index.html'), 'utf8', (err, data) => {
//         if (err) throw err;
//         res.json(JSON.parse(data))
//     });
// });


app.get('/api', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/api/notes', (req, res) => res.json(notesData));


app.post('/api/notes', (req, res) => {
    console.info(`${req.method} request received to add a review`);
    const { title, text } = req.body;
    if (title && text) {
        const newNote = {
            title,
            text,
            reviewid: uuidv4()
        };

        const response = {
            status: 'success',
            body: networkInterfaces,
        };
        console.log(response);
        res.status(201).json(response);
    } else {
        res.status(500).json('Error in posting note');
    }
})



    // const newNote = { ...req.body, id: uuidv4() };

    // fs.readFile(path.join(__dirname, '/db/db.json'), 'utf8', (err, data) => {
    //     if (err) throw err;
    //     const notes = JSON.parse(data);
    //     notes.push(newNote);
        
    //     fs.writeFile(path.join('./db/db.json'), JSON.stringify(notes), err => {
    //         if (err) throw err;
    //         res.json(newNote);
    //     });
    // });
// });

app.delete('/api/notes/:id', (req, res) => {
    const noteId = req.params.id;

    fs.readFile(path.join(__dirname, '/db/db.json'), 'utf8', (err, data) => {
        if (err) throw err;
        let notes = JSON.parse(data);
        notes = notes.filter(note => note.id !== noteId);

        fs.writeFile(path.join(__dirname, '/db/db.json'), JSON.stringify(notes), err => {
            if (err) throw err;
            res.json({ message: 'Deleted note' });
        });
    });
});

// Catch-all route to serve the main page
// app.get('*', (req, res) => {
//     res.sendFile(path.join(__dirname, 'index.html'));
// });

app.listen(PORT, () => {
    console.log(`Server listening on PORT ${PORT}`);
});