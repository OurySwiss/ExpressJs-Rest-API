import express from 'express';
import { connection, authenticate } from '../index.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const router = express.Router();
const SECRET_KEY = "your-secret-key";

function verifyUser(req, res, next) {
  const token = req.header('Authorization');
  
  if (!token) {
    return res.status(401).send('Access Denied');
  }
  
  try {
    const verified = jwt.verify(token, SECRET_KEY);
    req.user = verified;
    next();
  } catch (err) {
    res.status(400).send('Invalid Token');
  }
}

router.get('/', (req, res) => {
  connection.query('SELECT Username, Name, Vorname, `Alter`, Geschlecht FROM User', (err, results) => {
    if (err) throw err;
    res.json(results);
  });
});

router.get('/:id', verifyUser, (req, res) => {
  const userId = req.params.id;

  if (userId != req.user.id) {
    return res.status(403).send('Access Denied');
  }

  connection.query('SELECT * FROM User WHERE Id = ?', [userId], (err, results) => {
    if (err) throw err;
    res.json(results);
  });
});


router.post('/', async (req, res) => {
  const { Username, Password, Name, Vorname, Alter, Geschlecht } = req.body;

  if (!Username || !Password || !Name || !Vorname || !Alter || !Geschlecht) {
    return res.status(400).send('All fields are required');
  }

  const hashedPassword = await bcrypt.hash(Password, 10);

  const newUser = { Username, Password: hashedPassword, Name, Vorname, Alter, Geschlecht };

  connection.query('INSERT INTO User SET ?', newUser, (err) => {
    if (err) throw err;
    res.status(201).send('User successfully created');
  });
});

router.put('/:id', verifyUser, async (req, res) => {
  const userId = req.params.id;
  const { Username, Password, Name, Vorname, Alter, Geschlecht } = req.body;

  if (userId !== req.user.id) {
    return res.status(403).send('Access Denied');
  }

  let hashedPassword;
  if (Password) {
    hashedPassword = await bcrypt.hash(Password, 10);
  }

      const query = `
        UPDATE User 
        SET 
          Username = ?, 
          Password = ?, 
          Name = ?, 
          Vorname = ?, 
          \`Alter\` = ?, 
          Geschlecht = ? 
        WHERE Id = ?`;

      connection.query(query, [
        Username || user.Username, 
        hashedPassword || user.Password, 
        Name || user.Name, 
        Vorname || user.Vorname, 
        Alter !== undefined ? Alter : user.Alter, 
        Geschlecht || user.Geschlecht, 
        userId
      ], (err) => {
        if (err) throw err;
        res.send("User successfully updated");
      });
  });

router.delete('/:id', verifyUser, (req, res) => {
  const userId = req.params.id;

  if (userId !== req.user.id) {
    return res.status(403).send('Access Denied');
  }

  const query = `DELETE FROM User WHERE Id = ?`;

  connection.query(query, [userId], (err) => {
    if (err) throw err;
    res.send('User successfully deleted');
  });
});


export default router;