const winston = require('winston');
const config = require('./config');

const enumerateErrorFormat = winston.format((info) => {
  if (info instanceof Error) {
    Object.assign(info, { message: info.stack });
  }
  return info;
});

const transports = [
  new winston.transports.Console({
    stderrLevels: ['error'],
  }),
];

// File logging is only for local dev. On Vercel/Serverless, the filesystem is read-only (EROFS).
if (!process.env.VERCEL && config.env !== 'production') {
  transports.push(new winston.transports.File({ filename: 'app.log' }));
}

const logger = winston.createLogger({
  level: config.env === 'development' ? 'debug' : 'info',
  format: winston.format.combine(
    enumerateErrorFormat(),
    config.env === 'development' ? winston.format.colorize() : winston.format.uncolorize(),
    winston.format.splat(),
    winston.format.timestamp({ format: 'YYYY-MM-DDTHH:mm:ss.SSSZ' }), // Add timestamp format
    winston.format.printf(({ timestamp, level, message }) => `[${level}] ${message}`) // Modify printf format
  ),
  transports,
});

module.exports = logger;
