import express from 'express';
import { connection } from '../index.js';

const router = express.Router();

router.get('/', (req, res) => {
  connection.query('SELECT * FROM User', (err, results) => {
    if (err) throw err;
    res.json(results);
  });
});


router.get('/user/:id', (req, res) => {
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