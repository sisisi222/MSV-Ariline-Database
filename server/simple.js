const express = require('express');
const { Pool } = require('pg');
const app = express();
const cors = require('cors');

app.use(cors());


// Set up database connection pool
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'mydatabase',
  password: 'mypassword',
  port: 5432,
});

// Parse JSON request bodies
app.use(express.json());

// Route to handle signup POST requests
app.post('/signup', async (req, res) => {
  try {
    const { username, password } = req.body;

    // Insert new user into database
    await pool.query('INSERT INTO login (username, password) VALUES ($1, $2)', [username, password]);

    // Send success response
    res.send('Signup successful');
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal server error');
  }
});

// Start server
app.listen(3000, () => {
  console.log('Server started on port 3000');
});
