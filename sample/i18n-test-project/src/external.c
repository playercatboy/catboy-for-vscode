// Test source file for external-app target
#include <stdio.h>

int main() {
    printf("Hello from external-app (loaded from external-targets.yaml)!\n");
    #ifdef EXTERNAL_APP
        printf("External app configuration loaded\n");
    #endif
    return 0;
}