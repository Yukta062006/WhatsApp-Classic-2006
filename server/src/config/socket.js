const { Server } = require('socket.io');
const jwt = require('jsonwebtoken');
let io;

const onlineUsers = new Map();

function initSocket(server) {
  io = new Server(server, { cors: { origin: process.env.CLIENT_URL || '*', credentials: true } });

  io.use((socket, next) => {
    const token = socket.handshake.auth?.token;
    if (!token) return next(new Error('No token'));
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      socket.userId = decoded.id;
      next();
    } catch { next(new Error('Invalid token')); }
  });

  io.on('connection', (socket) => {
    onlineUsers.set(socket.userId, socket.id);
    io.emit('online_users', [...onlineUsers.keys()]);
    socket.join(socket.userId);

    socket.on('typing', ({ to }) => { if (to) io.to(to).emit('typing', { from: socket.userId }); });
    socket.on('stop_typing', ({ to }) => { if (to) io.to(to).emit('stop_typing', { from: socket.userId }); });
    socket.on('send_message', (msg) => {
      if (msg.receiver) io.to(msg.receiver).emit('new_message', msg);
    });

    socket.on('disconnect', () => {
      onlineUsers.delete(socket.userId);
      io.emit('online_users', [...onlineUsers.keys()]);
    });
  });
}

function getIO() { return io; }

module.exports = { initSocket, getIO };
