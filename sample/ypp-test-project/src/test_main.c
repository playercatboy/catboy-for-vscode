#include <stdio.h>
#include <assert.h>
#include <math.h>
#include "utils.h"
#include "math_utils.h"

void test_area_calculation(void) {
    double result = calculate_area(10.0, 5.0);
    assert(fabs(result - 50.0) < 0.001);
    printf("✓ Area calculation test passed\n");
}

void test_circle_area(void) {
    double result = calculate_circle_area(2.0);
    double expected = M_PI * 4.0;
    assert(fabs(result - expected) < 0.001);
    printf("✓ Circle area test passed\n");
}

void test_fibonacci(void) {
    assert(fibonacci(0) == 0);
    assert(fibonacci(1) == 1);
    assert(fibonacci(5) == 5);
    assert(fibonacci(10) == 55);
    printf("✓ Fibonacci test passed\n");
}

int main(void) {
    printf("YPP Demo - Unit Tests\n");
    printf("=====================\n");
    
#ifdef TESTING
    printf("Running in TESTING mode\n");
#endif
    
    test_area_calculation();
    test_circle_area();
    test_fibonacci();
    
    printf("All tests passed! ✅\n");
    return 0;
}