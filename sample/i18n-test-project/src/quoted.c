// Test source file for quoted-single target
#include <stdio.h>

int main() {
    printf("Hello from quoted-single target!\n");
    #ifdef QUOTED_PATH
        printf("Quoted path configuration loaded\n");
    #endif
    return 0;
}