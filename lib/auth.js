const jwt = require("jsonwebtoken")
const omit = require("lodash/omit")
const { User } = require("../models/user")

const passwordsMatch = (realPassword, givenPassword) => {
  return realPassword === givenPassword
}

exports.Auth = {
  login({ username, password }) {
    const user = User.findOne({ username })
    if (!user || !passwordsMatch(user.password, password)) return false

    const userData = omit(user, "password")
    const token = jwt.sign(userData, process.env.TOKEN_KEY, {
      expiresIn: "2h",
    })

    return { ...userData, token }
  },
}
