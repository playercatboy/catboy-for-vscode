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
   - **Status Bar**: Shows current selected target and build progress
   - **Output Channel**: Detailed logging and error reporting

4. **Command Execution**: Integrates with VSCode terminal to execute Catboy CLI commands:
   - Build: `catboy build -v -f <yaml-file>`
   - Clean: `catboy clean -v -f <yaml-file>`
   - Rebuild: `catboy rebuild -v -f <yaml-file>`

5. **Enhanced Features**:
   - **Error Handling**: Comprehensive YAML validation with user-friendly error messages
   - **Terminal Management**: Smart reuse of terminals per target
   - **Command Palette**: Quick target selection via "Catboy: Select Target"
   - **File Watching**: Auto-refresh on build.yaml changes

### Key Implementation Areas

- **src/extension.ts**: Extension entry point and activation logic
- **src/treeDataProvider.ts**: Tree view implementation for project/target display
- **src/projectDiscovery.ts**: Logic for finding and parsing build.yaml files with comprehensive error handling
- **src/commands.ts**: Command handlers for build/clean/rebuild operations with status integration
- **src/statusBar.ts**: Status bar integration showing current target and build progress
- **src/terminalManager.ts**: Smart terminal management with reuse per target
- **src/yamlParser.ts**: Custom lightweight YAML parser for build.yaml files (zero dependencies)

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

## Testing

### Development Testing
Press **F5** to launch Extension Development Host and test with the sample project in `sample/` folder.

### Mock Testing
Use `sample/mock-catboy.bat` (Windows) or `sample/mock-catboy.sh` (Unix) as executable path for testing without installing Catboy.

### Automated Testing
Run `npm test` for the complete test suite.

## Extension Status

✅ **Complete Implementation** - All core features and enhancements have been implemented and tested.

### Version History
- **v0.1.2**: Fixed critical production activation issues, replaced external YAML dependency
- **v0.1.1**: Added status bar integration and enhanced user experience
- **v0.1.0**: Initial release with core functionality

### Technical Notes
- Zero external runtime dependencies (custom YAML parser included)
- Activates on `onStartupFinished` for immediate command availability
- Comprehensive error handling and logging for production troubleshooting