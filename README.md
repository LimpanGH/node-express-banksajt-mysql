# Skapa backend i Node.js och Express för Banksajt - med MySQL-databas

Utgå från föregående uppgift, [https://github.com/chasacademy-sandra-larsson/node-express-banksajt]()
men istället för att spara data i arrayer så spara datan i en databas istället.

Du behöver inte deploya databasen utan det räcker med att det funkar lokalt på er dator.

## Installation av MySQL & setup av DB

[https://www.mamp.info/en/downloads/](https://www.mamp.info/en/downloads/) (både för Mac och Windows)

Starta MAMP som är gratis (inte MAMP PRO)

```
npm install mysql2
```

I server.js: 

```
import express from "express";
import bodyParser from "body-parser";
import mysql from "mysql2/promise";
import bcrypt from "bcrypt";

const app = express();
const port = 3001;

// middleware
app.use(bodyParser.json());

// connect to DB
const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "root",
  database: "bank",
  port: 8889,
});

// Databas uppkoppling
const pool = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "root",
    database: "banksajt",
    port: 8889, //windows användare port 8888
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

