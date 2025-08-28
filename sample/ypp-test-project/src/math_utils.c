#include <math.h>
#include "math_utils.h"

double calculate_area(double width, double height) {
    return width * height;
}

double calculate_circle_area(double radius) {
    return M_PI * radius * radius;
}

int fibonacci(int n) {
    if (n <= 1) {
        return n;
    }
    return fibonacci(n - 1) + fibonacci(n - 2);
}