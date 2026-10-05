let ioInstance = null;
let activeUsersCount = 0;

export function initSocket(io) {
  ioInstance = io;

  io.on('connection', (socket) => {
    activeUsersCount++;
    console.log(`🔌 Real-time client connected: ${socket.id} (Total active: ${activeUsersCount})`);

    // Broadcast updated active user count to all connected clients
    io.emit('users:count', { count: activeUsersCount });

    // Client can broadcast custom typing or presence indicators
    socket.on('user:join', (userData) => {
      socket.broadcast.emit('user:active', {
        user: userData,
        action: 'joined'
      });
    });

    socket.on('disconnect', () => {
      activeUsersCount = Math.max(0, activeUsersCount - 1);
      console.log(`❌ Real-time client disconnected: ${socket.id} (Total active: ${activeUsersCount})`);
      io.emit('users:count', { count: activeUsersCount });
    });
  });

  return io;
}

export function getIO() {
  return ioInstance;
}

export function emitTaskCreated(task, actor) {
  if (!ioInstance) return;
  ioInstance.emit('task:created', {
    task,
    actor: actor?.name || 'Someone',
    timestamp: new Date().toISOString()
  });
}

export function emitTaskUpdated(task, actor) {
  if (!ioInstance) return;
  ioInstance.emit('task:updated', {
    task,
    actor: actor?.name || 'Someone',
    timestamp: new Date().toISOString()
  });
}

export function emitTaskDeleted(taskId, actor) {
  if (!ioInstance) return;
  ioInstance.emit('task:deleted', {
    id: taskId,
    actor: actor?.name || 'Someone',
    timestamp: new Date().toISOString()
  });
}
