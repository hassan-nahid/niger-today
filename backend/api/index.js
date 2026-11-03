const app = require("../src/app");
const mongoose = require("mongoose");
const config = require("../src/config/config");

module.exports = async (req, res) => {
  // Reuse existing connection across serverless invocations
  if (mongoose.connection.readyState < 1) {
    try {
      await mongoose.connect(config.mongoose.url, config.mongoose.options);
    } catch (err) {
      console.error("MongoDB connection error on Vercel:", err);
    }
  }
  return app(req, res);
};
