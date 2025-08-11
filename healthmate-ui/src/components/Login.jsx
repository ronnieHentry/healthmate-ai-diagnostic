import React from "react";
import usersData from "../users.json";
import "./Login.css";

function Login({ onLogin }) {
  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [error, setError] = React.useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    // Vite/CRA may import JSON as { default: { ... } }
    const users = usersData.default ? usersData.default : usersData;
    const user = users[username];
    if (user && user.password === password) {
      localStorage.setItem("user", username);
      onLogin(username);
    } else {
      setError("Invalid username or password");
    }
  };

  return (
    <div className="login-root">
      <form className="login-form" onSubmit={handleSubmit}>
        <h2 className="login-title">Login</h2>
        <div style={{ marginBottom: 16 }}>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={e => setUsername(e.target.value)}
            className="login-input"
            autoFocus
          />
        </div>
        <div style={{ marginBottom: 16 }}>
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="login-input"
          />
        </div>
        {error && <div className="login-error">{error}</div>}
        <div className="login-button-container">
          <button type="submit" className="login-button">Login</button>
        </div>
      </form>
    </div>
  );
}

export default Login;
