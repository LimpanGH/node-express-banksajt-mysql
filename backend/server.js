import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Generera engångslösenord
function generateOTP() {
  // Generera en sexsiffrig numerisk OTP
  const otp = Math.floor(100000 + Math.random() * 900000);
  return otp.toString();
}

// Arrayer för att lagra användare, konton och sessioner
const users = [];
const account = [];
const sessions = [];

// Funktion för att logga aktuella data
function logCurrentData() {
  console.log('Users', users);
  console.log('Accounts', account);
  console.log('Sessions', sessions);
}

// Skriv dina routes
app.post('/users', (req, res) => {
  const { username, password } = req.body;

  // Check if the username already exists
  const existingUser = users.find((user) => user.username === username);
  if (existingUser) {
    return res.status(400).send('Username already exists');
  }

  // Create a new account for the user with initial balance 0
  const newAccount = { username, balance: 0 };

  // Push the new account into the account array
  account.push(newAccount);

  // Push the new user into the users array
  users.push({ username, password });
  sessions.push({password})

  res.status(201).send('User created');
  // Anropa logCurrentData() efter att användaren har lagts till
  logCurrentData();
});

app.post('/sessions', (req, res) => {
  const { username, password } = req.body;
  // Kontrollera om användaren finns i users-arrayen
  const user = users.find((user) => user.username === username && user.password === password);
  if (user) {
    // Generera en session-id och lägg till den i sessions-arrayen
    const sessionId = generateOTP();
    sessions.push({ sessionId, username });
    res.status(200).json({ sessionId });
  } else {
    res.status(401).send('Invalid username or password');
  }
  logCurrentData();
});


app.post('/me/account', (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).send('Invalid authorization header');
  }

  const sessionToken = authHeader.split(' ')[1];

  const session = sessions.find((session) => session.sessionId === sessionToken);

  if (session) {
    const username = session.username;
    const userAccount = account.find((acc) => acc.username === username);
    console.log('Found account', userAccount);
    if (userAccount) {
      res.json({ balance: userAccount.balance });
    } else {
      res.status(404).send('Account not found');
    }
  } else {
    res.status(401).send('Invalid session token');
  }
  logCurrentData();
});


app.post('/me/account/transactions', (req, res) => {

  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).send('Invalid authorization header');
  }
  const sessionToken = req.headers.authorization.split(' ')[1];

  const session = sessions.find((session) => session.sessionId === sessionToken);

  if (!session) {
    return res.status(401).send('Invalid session token');
  }

  const username = session.username;
  const userAccount = account.find((acc) => acc.username === username);

  if (!userAccount) {
    return res.status(404).send('Account not found');
  }

  const { type, amount } = req.body;

  if (type !== 'deposit' && type !== 'withdraw') {
    return res.status(400).send('Invalid transaction type');
  }

  if (typeof amount !== 'number' || amount <= 0) {
    return res.status(400).send('Invalid transaction amount');
  }

  if (type === 'deposit') {
    userAccount.balance += amount;
  } else {
    if (userAccount.balance < amount) {
      return res.status(400).send('Insufficient funds');
    }
    userAccount.balance -= amount;
  }

  // res.status(200).send('Transaction successful');
  res.status(200).send({ message: 'Transaction successful', balance: userAccount.balance });
});


// PORT
const port = process.env.PORT || 3000;

// Starta servern
app.listen(port, () => {
  console.log(`Bankens backend körs på http://localhost:${port}`);
});
