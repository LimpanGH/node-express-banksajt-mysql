import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import mysql from 'mysql2/promise';

const app = express();
const port = process.env.PORT || 3000; // Här deklareras port en gång

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Databas-uppkoppling
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'banksajt',
  port: 8889, // Obs! 3306 för Windows-användare
});

// Funktion för att göra förfrågan till databas
async function query(sql, params) {
  const [results] = await pool.execute(sql, params);
  return results;
}

// --------------------
// CRUD-operationer för användare

// CREATE
app.post('/users', async (req, res) => {
  const { username, password } = req.body;

  try {
    const existingUser = await query("SELECT * FROM users WHERE username = ?", [username]);
    if (existingUser.length > 0) {
      return res.status(400).send('Username already exists');
    }

    await query("INSERT INTO users (username, password) VALUES (?, ?)", [username, password]);
    res.status(201).send('User created');
  } catch (error) {
    res.status(500).send('Server error');
  }
});

// READ ALL
app.get('/users', async (req, res) => {
  try {
    const users = await query("SELECT * FROM users");
    res.json(users);
  } catch (error) {
    res.status(500).send('Server error');
  }
});

// READ SPECIFIC
app.get('/users/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const user = await query("SELECT * FROM users WHERE userId = ?", [id]);
    if (user.length === 0) {
      return res.status(404).send('User not found');
    }
    res.json(user[0]);
  } catch (error) {
    res.status(500).send('Server error');
  }
});

// UPDATE
app.put('/users/:id', async (req, res) => {
  const { id } = req.params;
  const { username, password } = req.body;

  try {
    const result = await query("UPDATE users SET username = ?, password = ? WHERE userId = ?", [username, password, id]);
    if (result.affectedRows === 0) {
      return res.status(404).send('User not found');
    }
    res.send('User updated');
  } catch (error) {
    res.status(500).send('Server error');
  }
});

// DELETE
app.delete('/users/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const result = await query("DELETE FROM users WHERE userId = ?", [id]);
    if (result.affectedRows === 0) {
      return res.status(404).send('User not found');
    }
    res.send('User deleted');
  } catch (error) {
    res.status(500).send('Server error');
  }
});

// --------------------

// Starta servern
app.listen(port, () => {
  console.log(`Bankens backend körs på http://localhost:${port}`);
});
