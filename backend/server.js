import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import mysql from 'mysql2/promise';

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Database connection
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'banksajt',
  port: 8889,
});

// Function to perform database query
async function query(sql, params) {
  const [results] = await pool.execute(sql, params);
  return results;
}

// Function to generate OTP
function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// CREATE
app.post('/users', async (req, res) => {
  const { username, password } = req.body;

  try {
    // Insert user
    const userResult = await query('INSERT INTO users (username, password) VALUES (?, ?)', [
      username,
      password,
    ]);

    const userId = userResult.insertId;

    // Insert account
    const accountResult = await query('INSERT INTO account (user_Id, amount) VALUES (?, ?)', [
      userId,
      0,
    ]);

    const accountId = accountResult.insertId;

    // Respond with success
    res.status(201).json({
      message: 'User created',
      userId: userId,
      accountId: accountId,
    });
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ message: 'Error creating user', error: error.message });
  }
});

// Login
app.post('/sessions', async (req, res) => {
  const { username, password } = req.body;
  try {
    const userResult = await query('SELECT * FROM users WHERE username = ?', [username]);

    const user = userResult[0];

    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    if (user.password === password) {
      const token = generateOTP();

      const sessionsResult = await query('INSERT INTO sessions (user_id, token) VALUES (?, ?)', [
        user.id,
        token,
      ]);

      const sessionsId = sessionsResult.insertId;

      res.status(200).json({ message: 'Login successful', token: token, sessionsId: sessionsId });
    } else {
      return res.status(401).json({ message: 'Invalid password' });
    }
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ message: 'Error during login', error: error.message });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Bank backend running at http://localhost:${port}`);
});
