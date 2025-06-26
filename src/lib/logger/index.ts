type LogLevel = 'error' | 'warn' | 'info' | 'http' | 'debug' | 'verbose' | 'silly';

const logLevel = 'debug';

const formatTimestamp = () => {
    return new Intl.DateTimeFormat('de-DE', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
    }).format(new Date());
};

// ANSI color codes for terminal output
const colors = {
    reset: '\x1b[0m',
    bold: '\x1b[1m',
    red: '\x1b[31m',
    yellow: '\x1b[33m',
    green: '\x1b[32m',
    cyan: '\x1b[36m',
    blue: '\x1b[34m',
    magenta: '\x1b[35m',
    gray: '\x1b[90m',
    white: '\x1b[37m'
};

const levelColors: Record<LogLevel, string> = {
    error: colors.red + colors.bold,
    warn: colors.yellow,
    info: colors.green,
    http: colors.cyan,
    debug: colors.blue,
    verbose: colors.magenta,
    silly: colors.gray
};

class Logger {
    private level: LogLevel = logLevel as LogLevel;

    private formatMessage(level: LogLevel, message: string, metadata?: Record<string, unknown>) {
        const timestamp = formatTimestamp();
        const color = levelColors[level] || colors.white;
        let metaStr = '';

        if (metadata && Object.keys(metadata).length > 0) {
            metaStr = '\n' + JSON.stringify(metadata, null, 2);
        }

        return `${timestamp} - [${color}${level.toUpperCase()}${colors.reset}] ${message}${metaStr}`;
    }

    error(message: string, metadata?: Record<string, unknown>) {
        console.error(this.formatMessage('error', message, metadata));
    }

    warn(message: string, metadata?: Record<string, unknown>) {
        console.warn(this.formatMessage('warn', message, metadata));
    }

    info(message: string, metadata?: Record<string, unknown>) {
        console.info(this.formatMessage('info', message, metadata));
    }

    http(message: string, metadata?: Record<string, unknown>) {
        console.log(this.formatMessage('http', message, metadata));
    }

    debug(message: string, metadata?: Record<string, unknown>) {
        console.debug(this.formatMessage('debug', message, metadata));
    }

    verbose(message: string, metadata?: Record<string, unknown>) {
        console.log(this.formatMessage('verbose', message, metadata));
    }

    silly(message: string, metadata?: Record<string, unknown>) {
        console.log(this.formatMessage('silly', message, metadata));
    }
}

const logger = new Logger();

export default logger;
