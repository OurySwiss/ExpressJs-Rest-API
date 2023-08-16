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
      res.status(404).send('Book not found');
    }
  });
});

router.post('/', (req, res) => {
  const { Titel, Erscheinungsjahr, Autor } = req.body;

  if (!Titel || !Erscheinungsjahr || !Autor) {
    return res.status(400).send('Title, year of publication and author are required');
  }

  const newBook = { Titel, Erscheinungsjahr, Autor };

  connection.query('INSERT INTO Books SET ?', newBook, (err) => {
    if (err) throw err;
    res.status(201).send('Book successfully created');
  });
});

router.put('/:id', (req, res) => {
  const bookId = req.params.id;
  const { Titel, Erscheinungsjahr, Autor } = req.body;

  if (!Titel || !Erscheinungsjahr || !Autor) {
    return res.status(400).send("Title, year of publication and author are required");
  }

  connection.query('SELECT * FROM Books WHERE Id = ?', [bookId], (err, results) => {
    if (err) throw err;

    if (results.length > 0) {
      const query = `UPDATE Books SET Titel = ?, Erscheinungsjahr = ?, Autor = ? WHERE Id = ?`;

      connection.query(query, [Titel, Erscheinungsjahr, Autor, bookId], (err) => {
        if (err) throw err;
        res.send("Book successfully updated");
      });
    } else {
      res.status(404).send("Book not found");
    }
  });
});


router.delete('/:id', (req, res) => {
  const bookId = req.params.id;

  connection.query('SELECT * FROM Books WHERE Id = ?', [bookId], (err, results) => {
    if (err) throw err;

    if (results.length > 0) {
      const query = `DELETE FROM Books WHERE Id = ?`;

      connection.query(query, [bookId], (err) => {
        if (err) throw err;
        res.send("Book successfully deleted");
      });
    } else {
      res.status(404).send("Book not found"); 
    }
  });
});




export default router;