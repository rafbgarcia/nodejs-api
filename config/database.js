const mongoose = require("mongoose")
const NODE_ENV = process.env.NODE_ENV || "dev"
const MONGO_URI = process.env.MONGO_URI

exports.connect = async () => {
  try {
    await mongoose.connect(MONGO_URI + `?dbName=nodejs_api_${NODE_ENV}`)
  } catch (error) {
    console.log("database connection failed. exiting now...")
    console.error(error)
    process.exit(1)
  }
}
