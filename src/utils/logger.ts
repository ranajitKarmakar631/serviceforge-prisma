import winston from "winston";

/*

logger.error("Something broke");
logger.warn("This looks suspicious");
logger.info("Normal app flow");
logger.debug("Debugging details");

*/
const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      ),
    }),
  ],
});

export default logger;