import winston from 'winston';
import path from 'path';
import fs from 'fs';

// Ensure log directory exists
const logDir = 'logs';
if (!fs.existsSync(logDir)) 
    fs.mkdirSync(logDir);

const consoleTransport = new winston.transports.Console();
const fileTransport = new winston.transports.File({
    filename: path.join(logDir, 'app.log'),
    level: 'info',
    maxsize: 5242880, // 5MB
    maxFiles: 5,
});

const logger = winston.createLogger({
    level: process.env.LOG_LEVEL || 'info',
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.errors({ stack: true }),
        winston.format.splat(),
        winston.format.printf(({ timestamp, level, message, stack}) =>
            `[${timestamp}] ${level}: ${stack || message}`
        )
    ),
    transports: [
        consoleTransport,
        fileTransport
    ],
    exitOnError: false,
});

export default logger;
