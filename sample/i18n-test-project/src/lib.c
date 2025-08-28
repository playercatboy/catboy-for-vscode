// Test source file for quoted-multi target
#include <stdio.h>

int main() {
    printf("Hello from quoted-multi target (lib)!\n");
    #ifdef LIB_CORE
        printf("Core library configuration loaded\n");
    #endif
    #ifdef LIB_UTILS
        printf("Utils library configuration loaded\n");
    #endif
    return 0;
}