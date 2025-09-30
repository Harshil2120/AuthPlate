/**
 * Secure logging system for authentication and security events
 */

export enum LogLevel {
  ERROR = 'error',
  WARN = 'warn',
  INFO = 'info',
  DEBUG = 'debug'
}

export interface LogEntry {
  timestamp: string
  level: LogLevel
  message: string
  userId?: string
  sessionId?: string
  ip?: string
  userAgent?: string
  metadata?: Record<string, any>
}

class Logger {
  private isDevelopment = process.env.NODE_ENV === 'development'

  private formatLogEntry(entry: Omit<LogEntry, 'timestamp'>): LogEntry {
    return {
      ...entry,
      timestamp: new Date().toISOString()
    }
  }

  private shouldLog(level: LogLevel): boolean {
    if (this.isDevelopment) return true
    
    // In production, only log warnings and errors by default
    return level === LogLevel.WARN || level === LogLevel.ERROR
  }

  private log(level: LogLevel, message: string, metadata?: Partial<LogEntry>) {
    if (!this.shouldLog(level)) return

    const entry = this.formatLogEntry({
      level,
      message,
      ...metadata
    })

    // In development, use console
    if (this.isDevelopment) {
      const consoleMethod = level === LogLevel.ERROR ? 'error' : 
                           level === LogLevel.WARN ? 'warn' : 'info'
      console[consoleMethod](`[${entry.timestamp}] ${level.toUpperCase()}: ${message}`, metadata)
    } else {
      // In production, you would send to a logging service
      // For now, we'll use console but with structured logging
      console.log(JSON.stringify(entry))
    }
  }

  error(message: string, metadata?: Partial<LogEntry>) {
    this.log(LogLevel.ERROR, message, metadata)
  }

  warn(message: string, metadata?: Partial<LogEntry>) {
    this.log(LogLevel.WARN, message, metadata)
  }

  info(message: string, metadata?: Partial<LogEntry>) {
    this.log(LogLevel.INFO, message, metadata)
  }

  debug(message: string, metadata?: Partial<LogEntry>) {
    this.log(LogLevel.DEBUG, message, metadata)
  }

  // Security-specific logging methods
  securityEvent(event: string, metadata?: Partial<LogEntry>) {
    this.warn(`SECURITY: ${event}`, { ...metadata, level: LogLevel.WARN })
  }

  authEvent(event: string, userId?: string, metadata?: Partial<LogEntry>) {
    this.info(`AUTH: ${event}`, { ...metadata, userId })
  }

  rateLimitEvent(ip: string, endpoint: string) {
    this.warn(`RATE_LIMIT: Too many requests from ${ip} to ${endpoint}`, { ip, endpoint })
  }
}

export const logger = new Logger()

// Security event types for better categorization
export const SecurityEvents = {
  LOGIN_SUCCESS: 'User login successful',
  LOGIN_FAILED: 'User login failed',
  LOGOUT: 'User logout',
  SESSION_EXPIRED: 'Session expired',
  RATE_LIMIT_EXCEEDED: 'Rate limit exceeded',
  INVALID_TOKEN: 'Invalid authentication token',
  SUSPICIOUS_ACTIVITY: 'Suspicious activity detected',
  ACCOUNT_LOCKED: 'Account locked due to suspicious activity',
  PASSWORD_RESET: 'Password reset requested',
  EMAIL_VERIFICATION: 'Email verification',
  OAUTH_ERROR: 'OAuth authentication error'
} as const
