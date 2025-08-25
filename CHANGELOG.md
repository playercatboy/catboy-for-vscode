# Change Log

All notable changes to the "Catboy for Visual Studio Code" extension will be documented in this file.

## [0.1.5] - 2025-08-26

### Added
- **Target Type-Based Icons**: Different icons for each target type (executable, libraries, object files, Luna BSP)
- **Target Type Display**: Dimmed target type text shown after target names in tree view for easy identification
- **Enhanced Target Selection**: Target selection dropdown now shows type-specific icons and type information
- **Test Projects**: Added comprehensive test projects with different target types for development

### Changed
- **Icon Consistency**: All target icons now use consistent white/neutral coloring (executable uses gear icon)
- **User-Friendly Type Names**: Raw YAML types converted to readable names (e.g., "exe" → "Executable")
- **Target Tooltips**: Enhanced tooltips with target type information

### Technical
- **Icon Mapping**: exe/executable → gear, dll/shared_library → library, sll/static_library → archive, obj/object_files → file-binary, luna/luna_bsp → star-full
- **Type Parsing**: Extract target type from `targets/<name>/build/type` in YAML configuration

## [0.1.4] - 2025-08-26

### Added
- **Build File Tree Level**: New intermediate tree level showing build.yaml files between projects and targets
- **Build All Targets**: Build file entries have action buttons to build/clean/rebuild all targets in a single YAML file
- **File Icons**: Build files display with file icons for better visual distinction

### Changed
- **Tree Structure**: Reorganized to Project → Build Files → Targets hierarchy for better organization
- **Path Display**: Build file paths shown with directory in normal text and filename dimmed for clarity
- **Path Separators**: Normalized to always use forward slashes (/) across all platforms for consistency

### Fixed
- **Path Separator Consistency**: Fixed inconsistent backslash/forward slash mixing on Windows

## [0.1.3] - 2025-08-26

### Fixed
- **Duplicate Targets Bug**: Fixed issue where targets would appear duplicated in the tree view when rapidly clicking refresh
- **Project Discovery**: Improved project discovery logic to properly clear state before rescanning
- **Tree View Consistency**: Added alphabetical sorting for projects and targets to maintain consistent ordering

### Changed
- **Sorting**: Projects and targets now display in alphabetical order for better organization
- **Duplicate Detection**: Simplified and improved duplicate target detection logic
- **State Management**: Better state management during project refresh operations

## [0.1.2] - 2025-08-25

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

## [0.1.1] - 2025-08-25

### Added
- **Status Bar Integration**: Shows current selected target and build progress indicators
- **Smart Terminal Management**: Reuses terminals per target for better organization
- **Command Palette Integration**: Quick target selection via "Catboy: Select Target" command
- **Enhanced Error Handling**: Comprehensive YAML validation with detailed error messages

### Improved
- Better user experience with status indicators
- More robust error reporting and validation
- Enhanced terminal management for build operations

## [0.1.0] - 2025-08-25

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