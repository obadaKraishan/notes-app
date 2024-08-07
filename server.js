const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

let notes = [];

app.get('/notes', (req, res) => {
  res.json(notes);
});

app.post('/notes', (req, res) => {
  const note = { text: req.body.note, important: false };
  notes.push(note);
  res.json({ message: 'Note added', notes });
});

app.put('/notes/:index', (req, res) => {
  const index = req.params.index;
  const noteText = req.body.note;
  const important = req.body.important;
  if (index >= 0 && index < notes.length) {
    if (noteText !== undefined) notes[index].text = noteText;
    if (important !== undefined) notes[index].important = important;
    res.json({ message: 'Note updated', notes });
  } else {
    res.status(400).json({ message: 'Invalid index' });
  }
});

app.delete('/notes/:index', (req, res) => {
  const index = req.params.index;
  if (index >= 0 && index < notes.length) {
    notes.splice(index, 1);
    res.json({ message: 'Note removed', notes });
  } else {
    res.status(400).json({ message: 'Invalid index' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
