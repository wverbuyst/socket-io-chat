const info = document.getElementById('info')
const messages = document.getElementById('messages')
const form = document.getElementById('form')
const input = document.getElementById('input')
const chatRoom = document.getElementById('chat-room')

let userName = ''
let roomName = ''

function padTo2Digits(num) {
  return num.toString().padStart(2, '0')
}

function getDateAndTime() {
  const now = new Date()
  const date = [
    padTo2Digits(now.getDate()),
    padTo2Digits(now.getMonth() + 1),
    now.getFullYear(),
  ].join('/')
  const time = [
    padTo2Digits(now.getHours()),
    padTo2Digits(now.getMinutes()),
  ].join(':')
  return `${date} ${time}`
}

function connectWithSocket() {
  const socket = io()
  const name = userName
  const room = roomName
  chatRoom.textContent = `${name.toLocaleLowerCase()}@${room.toLocaleLowerCase()}`

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
    const nameItem = document.createElement('div')
    nameItem.classList.add('name')
    nameItem.textContent = user

    const dateTime = document.createElement('div')
    dateTime.classList.add('date-time')
    dateTime.textContent = getDateAndTime()

    const messageItem = document.createElement('div')
    messageItem.textContent = text

    const userWithDateTime = document.createElement('div')
    userWithDateTime.classList.add('user-date-time')
    userWithDateTime.appendChild(nameItem)
    userWithDateTime.appendChild(dateTime)

    const item = document.createElement('div')
    item.appendChild(userWithDateTime)
    item.appendChild(messageItem)

    if (user === userName) {
      item.classList.add('messages--left')
    } else {
      item.classList.add('messages--right')
    }

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
