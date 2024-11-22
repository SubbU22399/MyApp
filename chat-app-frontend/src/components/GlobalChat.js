import React, { useEffect, useState } from "react";
import socket from "../services/socket";
import Header from "./Header";

const GlobalChat = () => {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("chatUser"));
    setUser(storedUser);

    if (storedUser) {
      socket.emit("user-login", storedUser);
    }

    socket.on("global-message", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    return () => {
      socket.off("global-message");
    };
  }, []);

  const sendMessage = () => {
    if (message.trim()) {
      const newMessage = { user, text: message };
      socket.emit("global-message", newMessage); // Send message to the server
      // setMessages((prev) => [...prev, newMessage]); // Update local state
      setMessage("");
    }
  };

  return (
    <div className="p-4 bg-gray-100 rounded shadow-md mt-0 col-span-2 grid grid-rows-8 grid-flow-col mr-2">
        <div className="profile text-xl font-bold mb-1 text-green-500">
          <Header user={user?.name} />
        </div>
        
        <div className="h-100 overflow-y-scroll mb-4 bg-white p-4 rounded shadow-inner row-span-6">
          {messages.map((msg, index) => (
            <p key={index} className="mb-2 text-black bottom-0">
              <strong>{msg.user.name}: </strong>
              {msg.text}
            </p>
          ))}
        </div>
      

      <div className="flex space-x-2 bottom-0">
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
