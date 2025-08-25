# Change Log

All notable changes to the "Catboy for Visual Studio Code" extension will be documented in this file.

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