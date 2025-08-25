#!/bin/bash

echo "Mock Catboy Build System v1.0.0"
echo ""
echo "Command: $1"
shift
echo "Options: $@"
echo ""

case "$1" in
    build)
        echo "[INFO] Starting build..."
        echo "[INFO] Compiling sources..."
        sleep 2
        echo "[INFO] Linking..."
        sleep 1
        echo "[SUCCESS] Build completed successfully!"
        ;;
    clean)
        echo "[INFO] Cleaning build artifacts..."
        sleep 1
        echo "[SUCCESS] Clean completed!"
        ;;
    rebuild)
        echo "[INFO] Starting rebuild..."
        echo "[INFO] Cleaning..."
        sleep 1
        echo "[INFO] Building..."
        sleep 2
        echo "[SUCCESS] Rebuild completed successfully!"
        ;;
    *)
        echo "[ERROR] Unknown command: $1"
        exit 1
        ;;
esac