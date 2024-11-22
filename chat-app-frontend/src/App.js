import React, { useEffect } from 'react';
import GlobalChat from './components/GlobalChat';
import OnlineUsers from './components/OnlineUsers';
import socket from './services/socket';

function App() {
  useEffect(() => {
    const storedUser = localStorage.getItem('chatUser');
    if (!storedUser) {
      const user = {
        id: `user-${Math.floor(Math.random() * 10000)}`,
        name: `User-${Math.floor(Math.random() * 10000)}`,
      };
      localStorage.setItem('chatUser', JSON.stringify(user));
      socket.emit('user-login', user);
    } else {
      socket.emit('user-login', JSON.parse(storedUser));
    }
  }, []);

  return (
    <div className="min-h-screen flex flex-col space-y-4 p-4 bg-gray-50">
      <OnlineUsers />
      <GlobalChat />
    </div>
  );
}

export default App;
