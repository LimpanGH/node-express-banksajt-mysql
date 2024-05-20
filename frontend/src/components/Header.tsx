
import Navigation from "./Navigation";
import {Link} from "react-router-dom";

function Header() {
  return (
    <header className="flex justify-between px-5 py-5 text-center text-white bg-gray-700">
      <h1 className="text-3xl font-bold"><Link to="/">Banksajt</Link></h1>
      <Navigation />
    </header>
  );
}

export default Header;

// import Navigation from "./Navigation";
// import { useState, useEffect } from 'react';
// import { Link } from 'react-router-dom';

// function Header() {
//   const [username, setUsername] = useState('');

//   useEffect(() => {
//     const storedUsername = localStorage.getItem('username');
//     if (storedUsername) {
//       setUsername(storedUsername);
//     }
//   }, []);

//   return (
//     <header className="flex justify-between px-5 py-5 text-center text-white bg-gray-700">
//       <h1 className="text-3xl font-bold"><Link to="/">Banksajt</Link></h1>
//       <div>
//         <p>{username ? `Inloggad som: ${username}` : 'Inte inloggad'}</p>
//         <Navigation />
//       </div>
//     </header>
//   );
// }

// export default Header;
