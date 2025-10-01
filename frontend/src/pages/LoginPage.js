import React from "react";

function LoginPage() {
  return (
    <div>
      <h2>🔐 Login Page</h2>
      <form>
        <input type="text" placeholder="Username" /><br /><br />
        <input type="password" placeholder="Password" /><br /><br />
        <button type="submit">Login</button>
      </form>
    </div>
  );
}

export default LoginPage;
