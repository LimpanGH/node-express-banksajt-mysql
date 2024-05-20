import { Link } from 'react-router-dom'
// Landningssidan

function HomePage() {


    return (
        <div>
            <h1>Home</h1>
            <Link to="/users">Skapa användare</Link>
            <Link to="/signup">Registrera dig</Link>
            <Link to="/login">Logga in</Link>
            <Link to="/account">Mitt konto</Link>
        </div>
    )
}

export default HomePage