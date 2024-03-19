const express = require('express');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');


const app = express();
const PORT = 3001;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, './index.html'));
});

app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, './public/notes.html'));
});

app.get('/api/notes', (req, res) => {
    let notesData = fs.readFileSync(path.join(__dirname, './db/db.json'))
    notesData = JSON.parse(notesData);
    res.json(notesData);
});


app.post('/api/notes', (req, res) => {
    console.info(`${req.method} request received to add a note`);
    const { title, text } = req.body;
    if (title && text) {
        const newNote = {
            title,
            text,
            id: uuidv4()
        };
        fs.readFile(path.join(__dirname, './db/db.json'), 'utf8', (err, data) => {
            if (err) throw err;
            const notes = JSON.parse(data);
            notes.push(newNote);
            
            fs.writeFile(path.join('./db/db.json'), JSON.stringify(notes), err => {
                if (err) throw err;
            });
        });
        let allNotes = JSON.parse(fs.readFileSync(path.join('./db/db.json')))
        res.json(allNotes);
    } else {
        res.json('Error in posting note');
    }
})
   


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


app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Server listening on PORT ${PORT}`);
});