import Cookies from "js-cookie";
import { Link, useNavigate } from "react-router-dom";
import "./index.css";

const Header = () => {
  const navigate = useNavigate();

  const onLogout = () => {
    Cookies.remove("jwt_token");
    navigate("/login", { replace: true });
  };

  return (
    <nav className="header-nav">
      <Link to="/">
        <img
          src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
          alt="website logo"
          className="header-logo"
        />
      </Link>
      <ul className="header-links">
        <li>
          <Link to="/" className="header-link">
            Home
          </Link>
        </li>
        <li>
          <Link to="/jobs" className="header-link">
            Jobs
          </Link>
        </li>
      </ul>
      <button type="button" className="logout-btn" onClick={onLogout}>
        Logout
      </button>
    </nav>
  );
};

export default Header;