// src/utils/logger.ts

type LogLevel = 'info' | 'warn' | 'error' | 'debug';

let debugMode = false;

/**
 * Initializes the logger with a debug mode setting.
 * @param isDebugMode - If true, enables debug logging.
 */
export const initializeLogger = (isDebugMode: boolean): void => {
   debugMode = isDebugMode;
};

const styles: Record<LogLevel, string> = {
   info: 'color: cyan; font-weight: bold;',
   warn: 'color: orange; font-weight: bold;',
   error: 'color: red; font-weight: bold;',
   debug: 'color: purple; font-weight: bold;',
};

/**
 * Logs messages based on the provided log level and debug mode.
 * @param level - The log level ('info', 'warn', 'error', 'debug').
 * @param message - The message to log.
 */
export const log = (level: LogLevel, message: string): void => {
   if (level === 'debug' && !debugMode) return;

   const timestamp = new Date().toISOString();
   const prefix = `[${level.toUpperCase()}]`;

   switch (level) {
      case 'info':
         console.info(`%c${prefix} %c${timestamp} - ${message}`, styles.info, 'color: inherit;');
         break;
      case 'warn':
         console.warn(`%c${prefix} %c${timestamp} - ${message}`, styles.warn, 'color: inherit;');
         break;
      case 'error':
         console.error(`%c${prefix} %c${timestamp} - ${message}`, styles.error, 'color: inherit;');
         break;
      case 'debug':
         console.log(`%c${prefix} %c${timestamp} - ${message}`, styles.debug, 'color: inherit;');
         break;
   }
};