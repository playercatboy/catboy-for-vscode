# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Visual Studio Code extension for the Catboy build system. The Catboy build system is a C build system that uses YAML files for build configuration.

**Important**: This extension provides build system integration only. It does NOT implement:
- Syntax highlighting (handled by VSCode's built-in YAML support and C/C++ extensions)
- IntelliSense or code completion (handled by Microsoft C/C++ or clangd extensions)
- It simply provides a GUI interface for build, clean, and rebuild operations

## Development Commands

### VSCode Extension Development
```bash
# Install dependencies
npm install

# Compile TypeScript
npm run compile

# Watch mode for development
npm run watch

# Run tests
npm test

# Package extension
vsce package

# Lint code
npm run lint
```

## Architecture

### Core Components

1. **Extension Activation**: The extension activates when a workspace contains `build.yaml` files that define Catboy projects.

2. **Project Discovery**: Scans workspace for `build.yaml` files and extracts:
   - Project name from the `name` property
   - Targets from the `targets` section

3. **UI Components**:
   - **Activity Bar Icon**: Custom "Catboy" icon in the VSCode activity bar
   - **Tree View Provider**: Displays hierarchical view of projects and targets
   - **Action Buttons**: Build, Clean, and Rebuild buttons for each target

4. **Command Execution**: Integrates with VSCode terminal to execute Catboy CLI commands:
   - Build: `catboy build -v -f <yaml-file>`
   - Clean: `catboy clean -v -f <yaml-file>`
   - Rebuild: `catboy rebuild -v -f <yaml-file>`

### Key Implementation Areas

- **src/extension.ts**: Extension entry point and activation logic
- **src/treeDataProvider.ts**: Tree view implementation for project/target display
- **src/projectDiscovery.ts**: Logic for finding and parsing build.yaml files
- **src/commands.ts**: Command handlers for build/clean/rebuild operations
- **src/configuration.ts**: Extension settings management

### Extension Configuration

The extension provides a setting for the Catboy executable path:
- Setting ID: `catboy.executablePath`
- Default: Uses `catboy` from PATH if not specified

## Build Configuration Format

Catboy uses YAML files with the following structure:
```yaml
name: project-name
targets:
  target-name:
    build:
      type: executable
      sources:
        c: [source files]
      includes: [include paths]
      defines: [macro definitions]
      links: [libraries]
      flags:
        c: compiler flags
```