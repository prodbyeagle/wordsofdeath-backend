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

const ansiCodes: Record<LogLevel, string> = {
   info: '\x1b[36m',
   warn: '\x1b[33m',
   error: '\x1b[31m',
   debug: '\x1b[35m',
};

/**
 * Formats the current date and time as HH:mm:ss.
 * @returns The formatted timestamp.
 */
const formatTimestamp = (): string => {
   const now = new Date();
   const hours = String(now.getHours()).padStart(2, '0');
   const minutes = String(now.getMinutes()).padStart(2, '0');
   const seconds = String(now.getSeconds()).padStart(2, '0');
   return `${hours}:${minutes}:${seconds}`;
};

/**
 * Logs messages based on the provided log level and debug mode.
 * @param level - The log level ('info', 'warn', 'error', 'debug').
 * @param message - The message to log.
 */
export const log = (level: LogLevel, message: string): void => {
   if (level === 'debug' && !debugMode) return;

   const timestamp = formatTimestamp();
   const prefix = `[${level.toUpperCase()}]`;

   const isBrowser = typeof window !== 'undefined' && window.console;
   const formattedMessage = `${prefix} ${timestamp} - ${message}`;

   if (isBrowser) {
      switch (level) {
         case 'info':
            console.info(`%c${formattedMessage}`, styles.info);
            break;
         case 'warn':
            console.warn(`%c${formattedMessage}`, styles.warn);
            break;
         case 'error':
            console.error(`%c${formattedMessage}`, styles.error);
            break;
         case 'debug':
            console.log(`%c${formattedMessage}`, styles.debug);
            break;
      }
   } else {
      const reset = '\x1b[0m';
      const color = ansiCodes[level] || '\x1b[37m';
      switch (level) {
         case 'info':
         case 'warn':
         case 'error':
         case 'debug':
            console.log(`${color}${formattedMessage}${reset}`);
            break;
      }
   }
};
