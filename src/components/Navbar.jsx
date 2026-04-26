import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  return (
    <nav className="nav">
      <div className="nav-left">
        <button onClick={toggleTheme} title="Сменить тему">
          {theme === 'light' ? '🌙' : '☀️'}
        </button>
      </div>
      <div className="nav-center">
        <Link to="/">🏠 Home</Link>
        <Link to="/courses">📚 Courses</Link>
        {user && <Link to="/dashboard">📊 Dashboard</Link>}
        {user?.role === "admin" && <Link to="/admin">⚙️ Admin</Link>}
      </div>
      <div className="nav-right">
        {!user ? (
          <>
            <Link to="/login">🔑 Login</Link>
            <Link to="/register">📝 Register</Link>
          </>
        ) : (
          <>
            <Link to="/profile">👤 {user.name}</Link>
            <button onClick={logout} className="btn-logout">🚪 Logout</button>
          </>
        )}
      </div>
    </nav>
  );
}   