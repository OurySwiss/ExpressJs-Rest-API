import express from 'express';
import bodyParser from 'body-parser';
import booksRoutes from './routes/books.js';
import mysql from 'mysql2';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

export const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '1234',
  database: 'Library'
});

connection.connect((err) => {
  if (err) throw err;
  console.log('Connected to the database!');
});


export const authenticate = (req, res, next) => {
  const token = req.header('Authorization');
  if (!token) return res.status(401).send('Unauthorized');

  jwt.verify(token, 'your-secret-key', (err, user) => {
    if (err) return res.status(401).send('Authorization failed');
    req.user = user;
    next();
  });
};


const app = express();
const PORT = 5000;

app.use(bodyParser.json());
app.use('/books', booksRoutes);

app.listen(PORT, () => console.log(`Server running on port: http://localhost:${PORT}`));
