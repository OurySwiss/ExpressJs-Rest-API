import express from 'express';
import { connection } from '../index.js';

const router = express.Router();

//All routes automaticly start with "books"
router.get('/', (req, res) => {
  connection.query('SELECT * FROM Books', (err, results) => {
    if (err) throw err;
    res.json(results);
  });
});

router.get('/:id', (req, res) => {
  const id = req.params.id;
  connection.query('SELECT * FROM Books WHERE Id = ?', [id], (err, results) => {
    if (err) throw err;
    if (results.length > 0) {
      res.json(results[0]);
    } else {
      res.status(404).json({ message: 'Buch nicht gefunden' });
    }
  });
});

router.post('/', (req, res) => {
  const { Titel, Erscheinungsjahr, Autor } = req.body;

  if (!Titel || !Erscheinungsjahr || !Autor) {
    return res.status(400).json({ message: 'Titel, Erscheinungsjahr und Autor sind erforderlich' });
  }

  const newBook = { Titel, Erscheinungsjahr, Autor };

  connection.query('INSERT INTO Books SET ?', newBook, (err, result) => {
    if (err) throw err;
    res.status(201).json({ message: 'Buch erfolgreich erstellt', id: result.insertId });
  });
});



export default router;