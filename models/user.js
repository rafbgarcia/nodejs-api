const dummyUser = { username: "admin", password: "admin" }

exports.User = {
  findOne({ username }) {
    if (username === dummyUser.username) {
      return dummyUser
    }
    return null
  },
}
