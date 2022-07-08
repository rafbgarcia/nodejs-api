const mongoose = require("mongoose")
const { Auth } = require("../lib/auth")

const clearDatabase = async () => {
  const collections = mongoose.connection.collections

  for (const key in collections) {
    const collection = collections[key]
    await collection.deleteMany()
  }
}

exports.Helpers = {
  databaseLifecycle() {
    beforeAll(async () => {
      await require("../config/database").connect()
    })

    beforeEach(async () => {
      await clearDatabase()
    })
  },

  authenticated(request) {
    const userData = Auth.login({ username: "admin", password: "admin" })
    return request.set("x-access-token", userData.token)
  },
}
