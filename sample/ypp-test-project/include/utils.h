#ifndef UTILS_H
#define UTILS_H

/**
 * Print a welcome message to stdout
 */
void print_welcome_message(void);

/**
 * Log a debug message (only in DEBUG builds)
 */
void debug_log(const char *message);

#endif // UTILS_H