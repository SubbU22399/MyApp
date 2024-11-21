const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

let games = {}; // Object to store game states

// Serve static files (e.g., front-end)
app.use(express.static('public'));

// Create a new game room
io.on('connection', (socket) => {
    console.log(`User connected: ${socket.id}`);
  
    // Listen for creating a new game
    socket.on('create-game', (playerName) => {
        const gameId = socket.id; // Use socket id as unique game room ID
        games[gameId] = {
            player1: { id: socket.id, name: playerName, symbol: 'X' },
            player2: null,
            board: Array(9).fill(null),
            turn: 'X',
        };
        socket.join(gameId);
        console.log(`Game created with ID: ${gameId}`);
        socket.emit('game-created', gameId);
    });

    // Listen for joining an existing game
    socket.on('join-game', (gameId, playerName) => {
        if (games[gameId] && games[gameId].player2 === null) {
            games[gameId].player2 = { id: socket.id, name: playerName, symbol: 'O' };
            io.to(gameId).emit('game-started', games[gameId]);
        } else {
            socket.emit('game-error', 'Game is already full or doesn’t exist.');
        }
    });

    // Listen for player moves
    socket.on('make-move', (gameId, index) => {
        const game = games[gameId];
        if (!game || game.board[index] || game.turn !== (socket.id === game.player1.id ? 'X' : 'O')) {
            return;
        }
        game.board[index] = socket.id === game.player1.id ? 'X' : 'O';
        game.turn = game.turn === 'X' ? 'O' : 'X'; // Switch turn
        io.to(gameId).emit('move-made', game.board, game.turn);

        // Check for win or draw
        const winner = checkWinner(game.board);
        if (winner) {
            io.to(gameId).emit('game-over', winner);
            delete games[gameId];
        } else if (game.board.every(cell => cell !== null)) {
            io.to(gameId).emit('game-over', 'draw');
            delete games[gameId];
        }
    });

    // Listen for disconnect
    socket.on('disconnect', () => {
        console.log(`User disconnected: ${socket.id}`);
        // Handle game cleanup if a player disconnects
    });
});

// Function to check if there is a winner
const checkWinner = (board) => {
    const winningCombinations = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ];
    for (const [a, b, c] of winningCombinations) {
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            return board[a];
        }
    }
    return null;
};

server.listen(4000, () => {
    console.log('Server is running on port 4000');
});