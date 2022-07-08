const express = require("express")
const { checkSchema, validationResult } = require("express-validator")
const pick = require("lodash/pick")
const { Auth } = require("../lib/auth")

const router = express.Router()
const schema = {
  username: { in: ["body"], errorMessage: "is required", isString: true, notEmpty: true },
  password: { in: ["body"], errorMessage: "is required", isString: true, notEmpty: true },
}

router.post("/login", checkSchema(schema), async (req, res) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.mapped() })
    }

    const params = pick(req.body, Object.keys(schema))
    const user = Auth.login(params)
    if (!user) {
      res.status(401).json({ error: "Invalid credentials" })
    } else {
      res.status(200).json(user)
    }
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

exports.router = router
