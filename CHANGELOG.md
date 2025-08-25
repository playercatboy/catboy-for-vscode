# Change Log

All notable changes to the "Catboy for Visual Studio Code" extension will be documented in this file.

## [0.1.2] - 2024-12-25

### Fixed
- **Extension Activation**: Fixed critical bug preventing extension from activating in production environments
- **Dependency Issues**: Replaced external `yaml` npm dependency with lightweight custom YAML parser
- **Command Registration**: Commands are now properly registered and available immediately on startup
- **Module Loading**: Resolved "Cannot find module 'yaml'" error in packaged extension

### Changed
- **Activation Events**: Changed from `workspaceContains:**/build.yaml` to `onStartupFinished` for immediate availability
- **YAML Parsing**: Implemented custom YAML parser specifically for Catboy build.yaml format
- **Error Handling**: Enhanced activation error handling with detailed logging

### Technical
- Removed runtime dependency on external YAML library
- Added custom `yamlParser.ts` with purpose-built YAML parsing
- Improved extension reliability across different VS Code environments
- Zero external runtime dependencies for better portability

## [0.1.1] - 2024-12-25

### Added
- **Status Bar Integration**: Shows current selected target and build progress indicators
- **Smart Terminal Management**: Reuses terminals per target for better organization
- **Command Palette Integration**: Quick target selection via "Catboy: Select Target" command
- **Enhanced Error Handling**: Comprehensive YAML validation with detailed error messages

### Improved
- Better user experience with status indicators
- More robust error reporting and validation
- Enhanced terminal management for build operations

## [0.1.0] - 2024-12-25

### Added

#### Core Features
- Initial release of Catboy VSCode extension
- Project discovery from `build.yaml` files with comprehensive validation
- Tree view display of projects and targets with expandable hierarchy
- Build, clean, and rebuild command integration
- Terminal execution of Catboy commands with smart terminal management
- Activity bar icon for easy access
- Inline action buttons for each target (Build, Clean, Rebuild)

#### Enhanced User Experience
- **Status Bar Integration**: Shows current selected target and build progress indicators
- **Command Palette Integration**: Quick target selection via "Catboy: Select Target" command
- **Output Channel**: Comprehensive logging and error reporting in dedicated "Catboy" output channel
- **File Watching**: Automatic refresh when build.yaml files are created, modified, or deleted
- **Smart Terminal Management**: Reuses terminals per target for better organization

#### Error Handling & Validation
- Comprehensive YAML validation with detailed error messages
- Detection and reporting of duplicate targets across projects
- User-friendly warnings for invalid build configurations
- Graceful handling of missing or malformed build.yaml files
- Empty file detection and reporting

#### Configuration & Testing
- Configuration setting for custom Catboy executable path
- Sample project with mock Catboy scripts for testing
- Comprehensive test suite for all major components
- Development tools and debugging support

#### Developer Experience
- Full TypeScript implementation with strict typing
- ESLint configuration for code quality
- Comprehensive documentation with testing instructions
- MIT license and contribution guidelines