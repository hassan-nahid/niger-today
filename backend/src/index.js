const mongoose = require("mongoose");
const app = require("./app");
const config = require("./config/config");
const logger = require("./config/logger");

let server;

// Connect to MongoDB
mongoose
  .connect(config.mongoose.url, config.mongoose.options)
  .then(() => {
    logger.info("Connected to MongoDB");

    // Only start standalone HTTP server when NOT running inside Vercel serverless
    if (!process.env.VERCEL) {
      const host = process.env.BACKEND_IP || "0.0.0.0";
      server = app.listen(config.port, host, () => {
        logger.info(`Listening to http://${host}:${config.port}`);
      });

      // Initializing socket.io
      try {
        const socketIo = require("socket.io");
        const socketIO = require("./utils/socketIO");
        const io = socketIo(server, {
          cors: {
            origin: "*",
          },
        });

        socketIO(io);
        global.io = io;
      } catch (err) {
        logger.warn("Socket.io initialization skipped:", err.message);
      }
    }
  })
  .catch((err) => {
    logger.error("MongoDB connection failed:", err.message);
  });

const exitHandler = () => {
  if (server) {
    server.close(() => {
      logger.info("Server closed");
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
};

const unexpectedErrorHandler = (error) => {
  logger.error(error);
  exitHandler();
};

process.on("uncaughtException", unexpectedErrorHandler);
process.on("unhandledRejection", unexpectedErrorHandler);

process.on("SIGTERM", () => {
  logger.info("SIGTERM received");
  if (server) {
    server.close();
  }
});

// Export app for Vercel (@vercel/node)
module.exports = app;
