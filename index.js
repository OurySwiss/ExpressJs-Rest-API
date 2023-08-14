import express from 'express';
import bodyParser from 'body-parser';
import booksRoutes from './routes/books.js';
import mysql from 'mysql2';

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
app.use('/books', booksRoutes);

app.listen(PORT, () => console.log(`Server running on port: http://localhost:${PORT}`));
