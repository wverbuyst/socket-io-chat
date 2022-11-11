const express = require('express')
const path = require('path')
const http = require('http')
const { Server } = require('socket.io')
const app = express()
const server = http.createServer(app)
const io = new Server(server)

app.use(express.static(path.join(__dirname, 'public')))

io.on('connection', (socket) => {
  console.log('a user connected')
  io.emit('user connected', 'user joined')

  socket.on('disconnect', () => {
    console.log('a user disconnected')
  })

  socket.on('chat message', (msg) => {
    console.log('message: ' + msg)
    io.emit('chat message', msg)
  })
})

server.listen(3000, () => {
  console.log('listening on *:3000')
})
