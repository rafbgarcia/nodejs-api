const mongoose = require("mongoose")

exports.Employee = mongoose.model(
  "Employee",
  new mongoose.Schema(
    {
      name: { type: String, default: null, unique: true },
      salary: { type: Number, default: null },
      currency: { type: String, default: null },
      department: { type: String, default: null },
      onContract: { type: Boolean, default: false },
      subDepartment: { type: String, default: null },
    },
    { collection: "Employee" }
  )
)
