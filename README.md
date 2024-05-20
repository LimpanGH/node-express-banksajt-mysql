<<<<<<< HEAD
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

=======
# Skapa backend i Node.js och Express för Banksajt

## Köra applikationen:

1. CDa till mappen Frontend och kör:
   ```
   npm run dev
   ```
2. CDa till mappen Backend och kör:
   ```
   npm start
   ```
3. Gå till browsern och skapa en user, logga in usern, gör en deposit.
4. Testa även med Thunder Client genom att putta in olika object i body, tex denna, till localhost:3000/users:
   ```{
   "username": "Linus",
   "password": "tjosan"
   }
   ```

## I dagens uppgift ska vi öva på att skapa en banksajt med backend i nodejs och express

### Data i backend

I bankens backend finns tre arrayer: En array `users` för användare, en array `accounts` för bankkonton och en array `sessions` för engångslösenord`.

**Users**
Varje användare har ett id, ett användarnamn och ett lösenord.

```

[{id: 101, username: "Joe", password: "hemligt" }, ...]

```

**Accounts**
Varje bankkonto har ett id, ett användarid och ett saldo.

```

[{id: 1, userId: 101, amount: 200 }, ...]

```

**Sessions**
När en användare loggar in skapas ett engångslösenord. Engångslösenordet och användarid läggs i sessions arrayen.

```

[{userId: 101, token: "nwuefweufh" }, ...]

```

### Sidor på sajten

Banken har följande sidor på sin sajt:

**Landningssida**
Ska innehålla navigering med länkar till Hem, logga in och skapa användare och en knapp till skapa användare

**Skapa användare**
Ett fält för användarnamn och ett för lösenord. Datat ska sparas i arrayen users i backend och ett bankkonto skapas i backend med 0 kr som saldo.

**Logga in**
Ett fält för användarnamn och ett för lösenord och en logga in knapp. När man klickat på knappen ska man få tillbaka sitt engångslösenord i response och skickas till kontosidan med useRouter.

**Kontosida**
Här kan man se sitt saldo och sätta in pengar på kontot. För att göra detta behöver man skicka med sitt engångslösenord till backend.

## Hur du klarar uppgiften

1. Klona detta repo
2. Kolla in frontend-mappen som innehåller komplett kod till uppgiften gjord i React och React Router. Du är fri att ändra om du vill ha annan layout / struktur.

### Skapa backend

1. Skapa en folder i roten: backend och gå med `cd` in i foldern.
1. Skriv `npm init` och tryck Enter på alla frågor.
1. Lägg till `"type": "module"`i package.json
1. I scripts i package.json lägg till: `"start": "nodemon server.js"`
1. Installera dependencies: `npm i express cors body-parser`
1. Börja skriva kod i `server.js`

### Endpoints och arrayer

1. I backend skapa tre tomma arrayer: `users`, `accounts` och `sessions`.
2. Skapa endpoints för:

- Skapa användare (POST): "/users"
- Logga in (POST): "/sessions"
- Visa salodo (POST): "/me/accounts"
- Sätt in pengar (POST): "/me/accounts/transactions"

3. När man loggar in ska ett engångslösenord skapas och skickas tillbaka i response.
4. När man hämtar saldot ska samma engångslösenord skickas med i Post.

### Mer detaljerad skiss om hur det ska fungera

[Se anteckning på Excalidraw](https://link.excalidraw.com/l/9THk15pMa6N/8g7rTYViPgB)

### Startkod för server.js i backend

```

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
const otp = Math.floor(100000 + Math.random() \* 900000);
return otp.toString();
}

// Din kod här. Skriv dina arrayer

// Din kod här. Skriv dina routes:

// Starta servern
app.listen(port, () => {
console.log(`Bankens backend körs på http://localhost:${port}`);
});

```

### Exempel på fetch för POST i frontend

```

    try {
            const response = await fetch('http://localhost:3000/users', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username: username,
                    password: password,
                }),
            });
            if(response.ok) {
                const data = await response.json();
                alert(`User ${data.user.username} created and account with balance ${data.account.balance} created`);
            } else {
                throw new Error('Fel användarnamn eller lösenord');
            }
        } catch (error) {
            console.error('Error:', error)
        }

```

```

```
>>>>>>> upstreamBanksajtArrayer/main
