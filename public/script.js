const info = document.getElementById('info')
const messages = document.getElementById('messages')
const form = document.getElementById('form')
const input = document.getElementById('input')
const chatRoom = document.getElementById('chat-room')

let userName = ''
let roomName = ''

function connectWithSocket() {
  const socket = io()
  const name = userName
  const room = roomName
  chatRoom.textContent = room

  socket.emit('join', { name, room }, (error) => {
    if (error) {
      alert(error)
    }
  })

  form.addEventListener('submit', function (e) {
    e.preventDefault()
    if (input.value) {
      socket.emit('sendMessage', input.value)
      input.value = ''
    }
  })

  socket.on('returnMessage', function ({ user, text }) {
    var item = document.createElement('div')
    const nameItem = document.createElement('div')
    nameItem.classList.add('name')
    nameItem.textContent = user
    const messageItem = document.createElement('div')
    messageItem.textContent = text
    item.appendChild(nameItem)
    item.appendChild(messageItem)

    messages.appendChild(item)
    window.scrollTo(0, document.body.scrollHeight)
  })

  socket.on('roomData', (data) => {
    console.log('data', data)
  })

  socket.on('message', function (msg) {
    notie.alert({
      type: 'info',
      text: msg.text,
      stay: false,
      time: 2,
      position: 'top',
    })
  })
}

notie.input({
  text: 'Enter your user name',
  submitText: 'Submit',
  submitCallback: (value) => {
    userName = value
    notie.input({
      text: 'Which room do you want to join?',
      submitText: 'Submit',
      submitCallback: (value) => {
        roomName = value
        connectWithSocket()
      },
      cancelText: 'Cancel',
      cancelCallback: console.log('cancelled'),
      position: 'top',
    })
  },
  cancelText: 'Cancel',
  cancelCallback: console.log('cancelled'),
  position: 'top',
})
