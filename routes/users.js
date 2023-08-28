import express from 'express';
import { connection } from '../index.js';

const router = express.Router();

router.get('/', (req, res) => {
  connection.query('SELECT * FROM User', (err, results) => {
    if (err) throw err;
    res.json(results);
  });
});


