// Luna BSP kernel entry point
void kernel_main(void) {
    // Initialize hardware
    init_uart();
    init_timer();
    
    // Kernel main loop
    while(1) {
        handle_interrupts();
    }
}