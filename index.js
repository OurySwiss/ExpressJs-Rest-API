import express from 'express';
import bodyParser from 'body-parser';
import booksRoutes from './routes/books.js';
import usersRoutes from './routes/users.js';
import mysql from 'mysql2';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';

dotenv.config();

const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE
});

connection.connect((err) => {
  if (err) throw err;
  console.log('Connected to the database!');
});

const app = express();
const PORT = 5000;

app.use(bodyParser.json());

const SECRET_KEY = "your-secret-key";

export const authenticate = (req, res, next) => {
  const token = req.header('Authorization');
  console.log("Token received:", token);
  if (!token) return res.status(401).send('Unauthorized');

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) {
      console.log("Token verification failed:", err);
      return res.status(401).send('Authorization failed');
    }
    req.user = user;
    next();
  });
};

app.post('/login', (req, res) => {
  const { username, password } = req.body;

  connection.query('SELECT * FROM User WHERE Username = ?', [username], (err, results) => {
    if (err) throw err;
    if (results.length > 0) {
      bcrypt.compare(password, results[0].Password, (err, isMatch) => {
        if (err) throw err;
        if (isMatch) {
          const token = jwt.sign({ id: results[0].Id }, SECRET_KEY);
          return res.send({ token });
        } else {
          res.status(401).send('Login failed');
        }
      });
    } else {
      res.status(404).send('User not found');
    }
  });
});

app.use('/books', authenticate, booksRoutes);
app.use('/users', usersRoutes);

app.listen(PORT, () => console.log(`Server running on port: http://localhost:${PORT}`));

export {connection};