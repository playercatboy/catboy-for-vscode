#ifndef MATH_UTILS_H
#define MATH_UTILS_H

#ifdef MATH_LIB_VERSION
#define MATH_UTILS_VERSION MATH_LIB_VERSION
#else
#define MATH_UTILS_VERSION "unknown"
#endif

/**
 * Calculate the area of a rectangle
 */
double calculate_area(double width, double height);

/**
 * Calculate the area of a circle
 */
double calculate_circle_area(double radius);

/**
 * Calculate the nth Fibonacci number
 */
int fibonacci(int n);

#endif // MATH_UTILS_H