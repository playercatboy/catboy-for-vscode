// Test source file for external-lib target
#include <stdio.h>

void external_lib_function() {
    printf("Function from external-lib (loaded from external-targets.yaml)!\n");
    #ifdef EXTERNAL_LIB
        printf("External lib configuration loaded\n");
    #endif
}