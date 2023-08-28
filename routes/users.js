import express from 'express';
import { connection } from '../index.js';

const router = express.Router();

router.get('/', (req, res) => {
  connection.query('SELECT * FROM User', (err, results) => {
    if (err) throw err;
    res.json(results);
  });
});


router.get('/:id', (req, res) => {
  const userId = req.params.id;
  connection.query('SELECT * FROM User WHERE Id = ?', [userId], (err, results) => {
    if (err) throw err;
    if (results.length > 0) {
      res.json(results[0]);
    } else {
      res.status(404).send('User not found');
    }
  });
});


router.post('/', (req, res) => {
  const { Username, Password, Name, Vorname, Alter, Geschlecht } = req.body;

  if (!Username || !Password || !Name || !Vorname || !Alter || !Geschlecht) {
    return res.status(400).send('All fields are required');
  }

  const newUser = { Username, Password, Name, Vorname, Alter, Geschlecht };

  connection.query('INSERT INTO User SET ?', newUser, (err) => {
    if (err) throw err;
    res.status(201).send('User successfully created');
  });
});


router.put('/:id', (req, res) => {
  const userId = req.params.id;
  const { Username, Password, Name, Vorname, Alter, Geschlecht } = req.body;

  if (!Username || !Password || !Name || !Vorname || Alter == null || !Geschlecht) {
    return res.status(400).send("All fields are required");
  }

  connection.query('SELECT * FROM User WHERE Id = ?', [userId], (err, results) => {
    if (err) throw err;

    if (results.length > 0) {
      const query = `UPDATE User SET Username = ?, Password = ?, Name = ?, Vorname = ?, \`Alter\` = ?, Geschlecht = ? WHERE Id = ?`;

      connection.query(query, [Username, Password, Name, Vorname, Alter, Geschlecht, userId], (err) => {
        if (err) throw err;
        res.send("User successfully updated");
      });
    } else {
      res.status(404).send("User not found");
    }
  });
});



router.delete('/:id', (req, res) => {
  const userId = req.params.id;

  connection.query('SELECT * FROM User WHERE Id = ?', [userId], (err, results) => {
    if (err) throw err;

    if (results.length > 0) {
      const query = `DELETE FROM User WHERE Id = ?`;

      connection.query(query, [userId], (err) => {
        if (err) throw err;
        res.send('User successfully deleted');
      });
    } else {
      res.status(404).send('User not found');
    }
  });
});

export default router;