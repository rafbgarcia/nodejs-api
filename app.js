require("dotenv").config()
require("./config/database").connect()
const express = require("express")
const { router: employees } = require("./api/employees")
const { router: users } = require("./api/users")

const app = express()
app.use(express.json())

app.use("/users", users)
app.use("/employees", employees)

module.exports = app
