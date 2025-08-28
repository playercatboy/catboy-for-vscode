// Test source file for multi-file-test target  
#include <stdio.h>

int main() {
    printf("Hello from multi-file-test!\n");
    #ifdef DEBUG
        printf("Debug mode enabled\n");
    #endif
    #ifdef RELEASE
        printf("Release mode enabled\n");
    #endif
    return 0;
}