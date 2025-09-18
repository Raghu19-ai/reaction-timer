// src/App.jsx
import { useState } from "react";
import Login from "./Login";
import ReactionTimer from "./ReactionTimer";

function App() {
  const [userEmail, setUserEmail] = useState(null);

  const handleLogout = () => {
    setUserEmail(null);
  };

  return (
    <div className="App">
      {userEmail ? (
        <ReactionTimer userEmail={userEmail} onLogout={handleLogout} />
      ) : (
        <Login onLogin={(email) => setUserEmail(email)} />
      )}
    </div>
  );
}

export default App;
