let users = []

const addUser = ({ id, name, room }) => {
  nameInLowerCase = name.trim().toLowerCase()
  roomInLowerCase = room.trim().toLowerCase()

  const existingUser = users.find((user) => {
    user.room.trim().toLowerCase() === roomInLowerCase &&
      user.name.trim().toLowerCase() === nameInLowerCase
  })

  if (existingUser) {
    return { error: 'Username is taken' }
  }
  const user = { id, name, room }

  users.push(user)
  return { user }
}

const removeUser = (id) => {
  const user = users.find((user) => user.id === id)

  if (user) {
    users = users.filter((user) => user.id !== id)
    users.unshift()

    return user
  }
}

const getUser = (id) => users.find((user) => user.id === id)

const getUsersInRoom = (room) => users.filter((user) => user.room === room)

module.exports = { addUser, removeUser, getUser, getUsersInRoom }
