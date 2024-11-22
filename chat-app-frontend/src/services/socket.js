import { io } from 'socket.io-client';

const socket = io('https://xox-74vw.onrender.com' || 'http://localhost:5000');
export default socket;
