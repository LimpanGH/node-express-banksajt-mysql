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

// ___________________________________________
// Route för att hämta användarens konton och visa saldo
app.post('/me/account', async (req, res) => {
  // Extrahera token från Authorization-headern. Exempel på header: "Bearer 12313"
  const token = req.headers.authorization.split(' ')[1];
  console.log('Received token:', token);

  // Hitta sessionen i sessions-arrayen som matchar token
  const session = sessions.find((session) => session.token === token);
  console.log('Found session:', session);

  //   // Om sessionen hittas, extrahera userId från sessionen
  //   if (session) {
  //     const userId = session.userId;

  //     // Hitta kontot i accounts-arrayen som matchar userId
  //     const account = accounts.find((acc) => acc.userId === userId);
  //     if (account) {
  //       // Om kontot hittas, skicka tillbaka saldo som JSON-svar
  //       res.json({ balance: account.balance });
  //     } else {
  //       // Om kontot inte hittas, skicka tillbaka status 404 och ett felmeddelande
  //       res.status(404).json({ error: 'Account not found' });
  //     }
  //   } else {
  //     // Om sessionen inte hittas, skicka tillbaka status 401 och ett felmeddelande
  //     res.status(401).json({ error: 'Invalid session token' });
  //   }
  // });

  try {
    // Fetch session from the database
    const sessionResult = await query('SELECT * FROM sessions WHERE token = ?', [token]);
    const session = sessionResult[0];

    if (!session) {
      return res.status(401).json({ error: 'Invalid session token' });
    }

    const userId = session.user_id;

    // Fetch account from the database
    const accountResult = await query('SELECT * FROM account WHERE user_Id = ?', [userId]);
    const account = accountResult[0];

    if (account) {
      res.json({ balance: account.amount });
    } else {
      res.status(404).json({ error: 'Account not found' });
    }
  } catch (error) {
    console.error('Error fetching account:', error);
    res.status(500).json({ error: 'Error fetching account', message: error.message });
  }
});

app.post('/me/account/transaction', async (req, res) => {
  // Extrahera token från Authorization-headern
  const token = req.headers.authorization.split(' ')[1]; // Extract token from Authorization header
  console.log('Received token:', token);

  //   // Hitta sessionen i sessions-arrayen som matchar token
  //   const session = sessions.find((session) => session.token === token);

  //   // Om sessionen hittas
  //   if (session) {
  //     // Hitta kontot i accounts-arrayen som matchar userId från sessionen
  //     const account = accounts.find((account) => account.userId === session.userId);
  //     // Om kontot hittas
  //     if (account) {
  //       // Extrahera beloppet från förfrågans body
  //       const { amount } = req.body;

  //       // Uppdatera kontots saldo med beloppet
  //       account.balance += amount;

  //       // Skicka tillbaka det uppdaterade kontot som JSON-svar
  //       res.json(account);

  //       // Skicka tillbaka en 201-status och ett meddelande med det nya saldot
  //       res.status(201).json({ message: account.balance });
  //     } else {
  //       // Om kontot inte hittas, skicka tillbaka en 404-status och ett felmeddelande
  //       res.status(404).json({ message: 'Account not found' });
  //     }
  //   } else {
  //     // Om sessionen inte hittas, skicka tillbaka en 401-status och ett felmeddelande
  //     res.status(401).json({ message: 'Invalid Token' });
  //   }
  // });

  try {
    // Fetch session from the database
    const sessionResult = await query('SELECT * FROM sessions WHERE token = ?', [token]);
    const session = sessionResult[0];

    if (!session) {
      return res.status(401).json({ error: 'Invalid session token' });
    }

    const userId = session.user_id;

    // Fetch account from the database
    const accountResult = await query('SELECT * FROM account WHERE user_Id = ?', [userId]);
    const account = accountResult[0];

    if (account) {
      const { amount } = req.body;
      const newBalance = account.amount + amount;

      // Update account balance in the database
      await query('UPDATE account SET amount = ? WHERE user_Id = ?', [newBalance, userId]);

      res.json({ balance: newBalance });
    } else {
      res.status(404).json({ error: 'Account not found' });
    }
  } catch (error) {
    console.error('Error performing transaction:', error);
    res.status(500).json({ error: 'Error performing transaction', message: error.message });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Bank backend running at http://localhost:${port}`);
});
