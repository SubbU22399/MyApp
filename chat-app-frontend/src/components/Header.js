import React from 'react';
import { useNavigate } from 'react-router-dom';
import socket from '../services/socket';

const Header = (props) => {
  const navigate = useNavigate();

  const handleLogout = () => {

    if (window.confirm('Are you sure you want to logout?')) {
        // Remove user from localStorage
    localStorage.removeItem('chatUser');

    // Disconnect from Socket.IO
    socket.disconnect();

    // Redirect to login page
    navigate('/');
   
  };

}

  return (
    <div className="flex justify-between items-center p-4 bg-blue-500 text-white">
      <h1 className="text-xl font-bold">{props.user}</h1>
      <button
        onClick={handleLogout}
        className="bg-red-500 px-4 py-2 rounded shadow hover:bg-red-600"
      >
        Logout
      </button>
    </div>
  );
};

export default Header;
