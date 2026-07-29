import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="logo">
          🌦️ Skyora
        </Link>

        <div className="nav-links">
          <Link to="/">Home</Link>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;