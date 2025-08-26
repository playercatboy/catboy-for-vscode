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
   - Build: `catboy build [-v] -f <yaml-file>` (verbose flag configurable via `catboy.verboseBuild` setting)
   - Clean: `catboy clean [-v] -f <yaml-file>` (verbose flag configurable via `catboy.verboseBuild` setting)
   - Rebuild: `catboy rebuild [-v] -f <yaml-file>` (verbose flag configurable via `catboy.verboseBuild` setting)

5. **Enhanced Features**:
   - **Internationalization**: Comprehensive Simplified Chinese (zh-hans) support with runtime language switching
   - **Error Handling**: Comprehensive YAML validation with user-friendly error messages
   - **Terminal Management**: Smart reuse of terminals per target
   - **Command Palette**: Quick target selection via "Catboy: Select Target"
   - **File Watching**: Auto-refresh on build.yaml changes
   - **Language Override**: Custom language selection independent of VS Code system settings

### Key Implementation Areas

- **src/extension.ts**: Extension entry point and activation logic
- **src/treeDataProvider.ts**: Tree view implementation for project/target display
- **src/projectDiscovery.ts**: Logic for finding and parsing build.yaml files with comprehensive error handling
- **src/commands.ts**: Command handlers for build/clean/rebuild operations with status integration and configurable verbose flag
- **src/statusBar.ts**: Status bar integration showing current target and build progress
- **src/terminalManager.ts**: Smart terminal management with reuse per target
- **src/yamlParser.ts**: Custom lightweight YAML parser for build.yaml files (zero dependencies)
- **src/languageManager.ts**: Custom internationalization system with runtime language switching and placeholder replacement

### Extension Configuration

The extension provides the following configuration settings:
- `catboy.executablePath`: Path to the Catboy executable (default: uses `catboy` from PATH)
- `catboy.showYamlFiles`: Show build.yaml file entries in project tree view (default: false)
- `catboy.verboseBuild`: Enable verbose build output with `-v` flag (default: true)
- `catboy.language`: Override extension language, supports "auto", "en", "zh-hans" (default: auto)

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
- **v0.1.10**: Added comprehensive Simplified Chinese (zh-hans) internationalization support and configurable verbose build setting
- **v0.1.9**: Enhanced target selection with friendly type names and current target indicators
- **v0.1.8**: Custom cat icon for activity bar with theme adaptation
- **v0.1.7**: Go-to-file navigation and current target system with status bar controls
- **v0.1.6**: YAML file visibility toggle and improved visual hierarchy
- **v0.1.5**: Target type-based icons and display enhancements
- **v0.1.4**: Build file tree level and path normalization improvements
- **v0.1.3**: Fixed duplicate targets bug and added alphabetical sorting
- **v0.1.2**: Fixed critical production activation issues, replaced external YAML dependency
- **v0.1.1**: Added status bar integration and enhanced user experience
- **v0.1.0**: Initial release with core functionality

### Technical Notes
- Zero external runtime dependencies (custom YAML parser included)
- Activates on `onStartupFinished` for immediate command availability
- Comprehensive error handling and logging for production troubleshooting
- Custom internationalization system bypassing vscode-nls limitations for runtime language switching
- Multiple package.nls locale files for VS Code UI button translations (zh-hans, zh-cn, zh)