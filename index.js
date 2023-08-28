import express from 'express';
import bodyParser from 'body-parser';
import booksRoutes from './routes/books.js';
import usersRoutes from './routes/users.js';
import mysql from 'mysql2';
import jwt from 'jsonwebtoken';

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

const app = express();
const PORT = 5000;

app.use(bodyParser.json());

export const authenticate = (req, res, next) => {
  const token = req.header('Authorization');
  console.log("Token received:", token);
  if (!token) return res.status(401).send('Unauthorized');

  jwt.verify(token, 'your-secret-key', (err, user) => {
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
    if (results.length > 0 && password === results[0].Password) {
      const token = jwt.sign({ id: results[0].Id }, 'your-secret-key');
      return res.send({ token });
    }

    res.status(401).send('Login failed');
  });
});

app.use('/books', authenticate, booksRoutes);
app.use('/users', usersRoutes);

app.listen(PORT, () => console.log(`Server running on port: http://localhost:${PORT}`));
