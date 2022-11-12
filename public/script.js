const info = document.getElementById('info')
const messages = document.getElementById('messages')
const form = document.getElementById('form')
const input = document.getElementById('input')

let userName = ''

function connectWithSocket() {
  const socket = io()
  const name = userName
  const room = 'TEST_ROOM'

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
    var item = document.createElement('li')
    item.textContent = `${user}: ${text}`
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
  text: 'Please enter your name',
  submitText: 'Submit',
  submitCallback: function (value) {
    userName = value
    connectWithSocket()
  },
  cancelText: 'Cancel',
  cancelCallback: console.log('cancelled'),
  position: 'top',
})
