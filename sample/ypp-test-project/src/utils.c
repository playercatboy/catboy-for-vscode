#include <stdio.h>
#include "utils.h"

void print_welcome_message(void) {
    printf("Welcome to the YPP demo project!\n");
    printf("This project demonstrates YAML preprocessing with $include directives.\n");
    
#ifdef LOG_LEVEL
    printf("Log level: %s\n", LOG_LEVEL);
#endif
}

void debug_log(const char *message) {
#ifdef DEBUG
    printf("[DEBUG] %s\n", message);
#endif
}