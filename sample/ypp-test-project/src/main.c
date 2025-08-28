#include <stdio.h>
#include <stdlib.h>
#include "utils.h"
#include "math_utils.h"

int main(int argc, char *argv[]) {
    printf("YPP Demo Application\n");
    printf("====================\n");
    
#ifdef DEBUG
    printf("Running in DEBUG mode\n");
#elif defined(RELEASE)
    printf("Running in RELEASE mode\n");
#endif

    // Test utility functions
    print_welcome_message();
    
    // Test math utilities
    double result = calculate_area(5.0, 3.0);
    printf("Area calculation result: %.2f\n", result);
    
    return EXIT_SUCCESS;
}