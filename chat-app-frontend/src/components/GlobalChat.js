import React, { useState, useEffect } from 'react';
import socket from '../services/socket';

const GlobalChat = () => {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('chatUser'));
    setUser(storedUser);

    socket.on('global-message', (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    return () => {
      socket.off('global-message');
    };
  }, []);

  const sendMessage = () => {
    const newMessage = { user, text: message };
    socket.emit('global-message', newMessage);
    setMessages((prev) => [...prev, newMessage]);
    setMessage('');
  };

  return (
    <div className="p-4 bg-gray-100 rounded shadow-md">
      <h2 className="text-xl font-bold mb-4">Global Chat</h2>
      <div className="h-60 overflow-y-scroll mb-4 bg-white p-4 rounded shadow-inner">
        {messages.map((msg, index) => (
          <p key={index} className="mb-2">
            <strong>{msg.user.name}: </strong>{msg.text}
          </p>
        ))}
      </div>
      <div className="flex space-x-2">
        <input
          type="text"
          className="flex-grow p-2 border rounded"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message..."
        />
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded"
          onClick={sendMessage}
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default GlobalChat;
