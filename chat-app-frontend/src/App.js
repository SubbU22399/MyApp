import React, { useEffect } from "react";
import {
  Navigate,
  Route,
  BrowserRouter as Router,
  Routes,
} from "react-router-dom";
import GlobalChat from "./components/GlobalChat";
import OnlineUsers from "./components/OnlineUsers";
import Login from "./pages/Login";
import socket from "./services/socket";

function App() {
  const isLoggedIn = localStorage.getItem("chatUser");

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("chatUser") !== null;
    // if (!isLoggedIn) {
    //   const user = {
    //     id: `user-${Math.floor(Math.random() * 10000)}`,
    //     name: `User-${Math.floor(Math.random() * 10000)}`,
    //   };
    //   localStorage.setItem("chatUser", JSON.stringify(user));
    //   socket.emit("user-login", user);
    // } else {
      socket.emit("user-login", JSON.parse(isLoggedIn));
    // }
  }, []);

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={isLoggedIn ? <Navigate to="/chat" /> : <Login />}
        />
        <Route
          path="/chat"
          element={
            isLoggedIn ? (
              <div className="min-h-screen flex p-4 bg-gray-50 grid grid-cols-3">
                <GlobalChat />
                <OnlineUsers />
              </div>
            ) : (
              <Navigate to="/" />
            )
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
