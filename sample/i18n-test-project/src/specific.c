// Test source file for specific-multi-test target
#include <stdio.h>

int main() {
    printf("Hello from specific-multi-test!\n");
    #ifdef DEBUG
        printf("Debug configuration loaded\n");
    #endif
    #ifdef RELEASE  
        printf("Release configuration loaded\n");
    #endif
    #ifdef TEST_MODE
        printf("Test configuration loaded\n");
    #endif
    return 0;
}