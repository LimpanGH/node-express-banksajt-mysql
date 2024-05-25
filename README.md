Denna är min,det finns även en solution på https://github.com/LimpanGH/node-express-banksajt-mysql-solution

# Skapa backend i Node.js och Express för Banksajt - med MySQL-databas

### Köra applikationen:

1. Starta MAMP och gå in i myPHPadmin
2. CDa till mappen Frontend och kör:
   ```
   npm run dev
   ```
3. CDa till mappen Backend och kör:
   ```
   npm start
   ```
4. Gå till browsern och skapa en user, logga in usern, gör en deposit.
5. Testa även med Thunder Client genom att putta in olika object i body, tex dessa

```
POST localhost:3000/users
```

med detta i body

```
{
"username": "binggo",
"password": "bonggo"
}
```

eller denna:

```
POST localhost:3000/sessions
```

med detta i body

```
{
"username": "binggo",
"password": "bonggo"
}
```

Testa även i browsern.

## Utgå från föregående uppgift, [https://github.com/chasacademy-sandra-larsson/node-express-banksajt]()

men istället för att spara data i arrayer så spara datan i en databas istället.

Du behöver inte deploya databasen utan det räcker med att det funkar lokalt på er dator.

## Installation av MySQL & setup av DB

[https://www.mamp.info/en/downloads/](https://www.mamp.info/en/downloads/) (både för Mac och Windows)

Starta MAMP som är gratis (inte MAMP PRO), gå till mappen Backend och kör:

```
npm install mysql2
```

I server.js:

```
import express from "express";
import bodyParser from "body-parser";
import mysql from "mysql2/promise";

const app = express();
const port = 3001;

// middleware
app.use(bodyParser.json());

// Databas uppkoppling
const pool = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "root",
    database: "banksajt",
    port: 8889, // Obs! 3306 för windowsanvändare
  });

 // Funktion för att göra förfrågan till databas
async function query(sql, params) {
    const [results] = await pool.execute(sql, params);
    return results;
  }

app.listen(port, () => {
  console.log("Listening on port: " + port);
});
```

## SQL-förfrågningar enligt CRUD

```
  // CREATE
  const result = await query(
            "INSERT INTO users (username, password) VALUES (?, ?)",
            [username, password]
   );

   // READ ALL
     const users = await query("SELECT * FROM users");


   // READ SPECIFIC
     const user = await query("SELECT * FROM users WHERE userId = ?", [id]);


    // UPDATE
     const result = await query("UPDATE users SET username = ?, password = ? WHERE userId = ?",    [
            username,
            password,
            id,
      ]);

    // DELETE
	  const result = await query("DELETE FROM users WHERE userId = ?", [id]);



```
