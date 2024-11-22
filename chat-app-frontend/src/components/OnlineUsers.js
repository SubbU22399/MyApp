import React, { useEffect, useState } from 'react';
import socket from '../services/socket';

const OnlineUsers = () => {
  const [onlineUsers, setOnlineUsers] = useState([]);

  useEffect(() => {
    socket.on('online-users', (users) => {
      setOnlineUsers(users);
    });

    return () => {
      socket.off('online-users');
    };
  }, []);

  return (
    <div className="p-4 bg-gray-100 rounded shadow-md mr-1 col-span-1">
      <h2 className="text-xl font-bold mb-4 text-cyan-400">Online Users</h2>
      <ul className="list-disc pl-5">
        {onlineUsers.map((user, index) => (
          <li key={index} className="mb-1 text-indigo-600">{user.name}</li>
        ))}
      </ul>
    </div>
  );
};

export default OnlineUsers;
