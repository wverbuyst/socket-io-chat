const express = require('express')
const path = require('path')
const http = require('http')
const { Server } = require('socket.io')
const app = express()
const server = http.createServer(app)
const io = new Server(server)
const { addUser, removeUser, getUser, getUsersInRoom } = require('./users')

app.use(express.static(path.join(__dirname, 'public')))

io.on('connection', (socket) => {
  socket.on('join', ({ name, room }, callback) => {
    const { error, user } = addUser({ id: socket.id, name, room })

    if (error) return callback(error)

    // Emit will send message to the user
    // who had joined
    socket.emit('message', {
      user: 'admin',
      text: `${user.name},
          welcome to ${user.room}.`,
    })

    // Broadcast will send message to everyone
    // in the room except the joined user
    socket.broadcast
      .to(user.room)
      .emit('message', {
        user: 'admin',
        text: `${user.name}, has joined ${user.room}`,
      })

    socket.join(user.room)

    io.to(user.room).emit('roomData', {
      room: user.room,
      users: getUsersInRoom(user.room),
    })
  })

  socket.on('sendMessage', (message) => {
    const user = getUser(socket.id)
    io.to(user.room).emit('returnMessage', { user: user.name, text: message })

    io.to(user.room).emit('roomData', {
      room: user.room,
      users: getUsersInRoom(user.room),
    })
  })

  socket.on('disconnect', () => {
    const user = removeUser(socket.id)

    if (user) {
      io.to(user.room).emit('message', {
        user: 'admin',
        text: `${user.name} has left`,
      })
    }
  })
})

server.listen(3000, () => {
  console.log('listening on *:3000')
})
