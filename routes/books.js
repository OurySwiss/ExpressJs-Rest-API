import express from 'express';
import { connection } from '../index.js';

const router = express.Router();

//All routes automaticly start with "books"
router.get('/', (req, res) => {
  const query = `
    SELECT Books.Id, Books.Titel, Books.Erscheinungsjahr, Autor.FullName as Autor 
    FROM Books 
    JOIN Autor ON Books.AutorID = Autor.ID
  `;
  connection.query(query, (err, results) => {
    if (err) throw err;
    res.json(results);
  });
});


router.get('/:id', (req, res) => {
  const id = req.params.id;
  const query = `
    SELECT Books.Id, Books.Titel, Books.Erscheinungsjahr, Autor.FullName as Autor 
    FROM Books 
    JOIN Autor ON Books.AutorID = Autor.ID
    WHERE Books.Id = ?
  `;
  connection.query(query, [id], (err, results) => {
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
    return res.status(400).send('Title, year of publication, and author are required');
  }
  connection.query('SELECT ID FROM Autor WHERE FullName = ?', [Autor], (err, results) => {
    if (err) throw err;

    let AutorID;
    if (results.length > 0) {
      AutorID = results[0].ID;
    } else {
      connection.query('INSERT INTO Autor (FullName) VALUES (?)', [Autor], (err, results) => {
        if (err) throw err;
        AutorID = results.insertId;
      });
    }

    const newBook = { Titel, Erscheinungsjahr, AutorID };

    connection.query('INSERT INTO Books SET ?', newBook, (err) => {
      if (err) throw err;
      res.status(201).send('Book successfully created');
    });
  });
});


router.put('/:id', (req, res) => {
  const bookId = req.params.id;
  const { Titel, Erscheinungsjahr, Autor } = req.body;

  if (!Titel || !Erscheinungsjahr || !Autor) {
    return res.status(400).send("Title, year of publication, and author are required");
  }
  connection.query('SELECT ID FROM Autor WHERE FullName = ?', [Autor], (err, results) => {
    if (err) throw err;

    let AutorID;
    if (results.length > 0) {
      AutorID = results[0].ID;
    } else {
      connection.query('INSERT INTO Autor (FullName) VALUES (?)', [Autor], (err, results) => {
        if (err) throw err;
        AutorID = results.insertId;
      });
    }

    const query = `
      UPDATE Books 
      SET Titel = ?, Erscheinungsjahr = ?, AutorID = ? 
      WHERE Id = ?
    `;

    connection.query(query, [Titel, Erscheinungsjahr, AutorID, bookId], (err) => {
      if (err) throw err;
      res.send("Book successfully updated");
    });
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