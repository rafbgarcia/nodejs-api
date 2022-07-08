const express = require("express")
const { checkSchema, query, validationResult } = require("express-validator")
const has = require("lodash/has")
const pick = require("lodash/pick")
const pickBy = require("lodash/pickBy")
const filter = require("lodash/filter")
const { Employee } = require("../models/employee")
const { Statistics } = require("../lib/statistics")
const { authMiddleware } = require("../middlewares/auth_middleware")

const router = express.Router()
router.use(authMiddleware)

const schema = {
  name: { in: ["body"], errorMessage: "is required", isString: true, notEmpty: true },
  salary: { in: ["body"], errorMessage: "is required", notEmpty: true },
  currency: { in: ["body"], errorMessage: "is required", isString: true, notEmpty: true },
  onContract: { in: ["body"], optional: true },
  department: { in: ["body"], errorMessage: "is required", isString: true, notEmpty: true },
  subDepartment: { in: ["body"], errorMessage: "is required", isString: true, notEmpty: true },
}

router.post("/", checkSchema(schema), async (req, res) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.mapped() })
    }

    const params = pick(req.body, Object.keys(schema))
    const employee = await Employee.create(params)

    res.status(201).json(employee)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

router.delete("/:id", async (req, res) => {
  try {
    await Employee.findOneAndRemove({ _id: req.params.id })

    res.status(204).json()
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

router.get(
  "/statistics",
  // Parse "true" and "false" strings to Boolean
  query("filters.onContract").customSanitizer((val) => val && JSON.parse(val)),
  async (req, res) => {
    try {
      const columns = filter(req.query.columns, (field) => has(schema, field))
      const filters = pickBy(req.query.filters, (_, field) => has(schema, field))
      const groups = filter(req.query.groups, (field) => has(schema, field))
      const stats = await Statistics.summary(Employee, columns, { filters, groups })

      res.status(200).json(stats)
    } catch (err) {
      res.status(500).json({ error: err.message })
    }
  }
)

exports.router = router
