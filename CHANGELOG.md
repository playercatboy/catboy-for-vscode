# Change Log

All notable changes to the "Catboy for Visual Studio Code" extension will be documented in this file.

## [0.2.0] - 2025-08-28

### Added
- **YAML Pre-processor (YPP) Support**: Complete integration with Catboy's YPP module for split YAML configurations
  - Automatic detection and processing of `$include` directives in build.yaml files
  - Intelligent target discovery using flattened.json metadata with original source location tracking
  - Support for all three YPP include patterns: inline targets, build content includes, and whole target includes
- **Enhanced Go-to-File Navigation**: Navigate directly to original YAML files where targets were defined
  - Uses original file paths and line numbers from YPP metadata when available
  - Falls back to main build.yaml for projects not using YPP
  - Precise line highlighting for target definitions across split files
- **Automatic YPP Processing**: Extension automatically runs `catboy ypp -f build.yaml` when needed
  - Processes YPP on extension startup for all detected build.yaml files
  - Intelligent file watching automatically re-processes YPP when YAML files change
  - Graceful fallback to direct YAML parsing if YPP is unavailable or fails
- **YPP Test Project**: Comprehensive sample project demonstrating all YPP include patterns
  - Pattern 1: Full targets with no includes
  - Pattern 2: Targets with build content included from separate files
  - Pattern 3: Whole targets included from separate files

### Changed
- **Project Discovery Architecture**: Completely redesigned to support YPP integration
  - Extended `CatboyTarget` interface with `originalFilePath` and `originalLineNumber` properties
  - Added `YppTarget` and `YppMetadata` interfaces for flattened.json structure
  - Modified parsing logic to prefer YPP data over direct YAML parsing
- **File Watching System**: Replaced simple file watcher with YPP-aware watching
  - Automatically triggers YPP processing on build.yaml file changes
  - Smarter refresh logic that handles split YAML configurations
- **Target Selection Icons**: Fixed icon consistency between project tree view and target selection popup
  - Static library targets now use consistent `file-zip` icon across all interfaces

### Fixed
- **Icon Consistency**: Target selection popup now uses identical icons as project tree view
- **Original Source Navigation**: Go-to-file functionality now correctly navigates to original YAML files in split configurations

### Technical
- **Zero External Dependencies**: YPP integration implemented without additional runtime dependencies
- **Backward Compatibility**: Maintains full compatibility with projects not using YPP
- **Comprehensive Error Handling**: Robust fallback mechanisms ensure extension works even if YPP fails
- **Performance Optimized**: YPP processing runs asynchronously without blocking extension activation

### Packaging
- **Reduced Extension Size**: Sample directory now excluded from VSIX packaging
- **Build Directory Management**: Sample build directories added to gitignore to prevent artifact tracking

## [0.1.10] - 2025-08-26

### Added
- **Simplified Chinese Support**: Comprehensive zh-hans translations for all extension interface elements
- **Language Override System**: Custom "Catboy: Change Language" command allows language selection independent of VS Code's system language
- **Verbose Build Configuration**: New `catboy.verboseBuild` setting to control the `-v` flag in catboy commands (defaults to true)
- **Internationalized Configuration**: All configuration settings now support both English and Chinese descriptions

### Changed  
- **Multilingual Interface**: All buttons, tooltips, status messages, error dialogs, and tree view elements now support Chinese localization
- **Enhanced Language Management**: Custom LanguageManager class provides runtime language switching with placeholder replacement
- **Configuration UI**: Extension settings panel now displays in the selected language with proper translations

### Fixed
- **Placeholder Resolution**: Fixed issues with untranslated placeholder strings showing literal "{0}" values
- **Button Localization**: Resolved VS Code UI button translation issues by implementing multiple package.nls locale files
- **Language Mismatch Detection**: Added detection and guidance for VS Code display language conflicts

### Technical
- Implemented custom `LanguageManager` class bypassing vscode-nls limitations for runtime language control
- Added comprehensive translation files: `package.nls.zh-hans.json`, `package.nls.zh-cn.json`, `package.nls.zh.json`
- Enhanced localize function with proper signature: `localize(key, defaultValue, ...args)`
- Added language change callbacks and dynamic UI refresh system

## [0.1.9] - 2025-08-26

### Fixed
- **Extension Test**: Fixed publisher ID in extension test from incorrect 'catboy.catboy-for-vscode' to correct 'playercatboy.catboy-for-vscode'
- **Target Selection Enhancement**: Target selection dialog now properly shows friendly display names for target types (e.g., "Executable" instead of "exe")
- **Current Target Indicator**: Target selection dialog now shows checkmark for the currently selected target and pre-selects it in the list

### Changed
- **Improved Target Selection UX**: Current target is now visually highlighted and pre-selected in the target selection quick pick

## [0.1.8] - 2025-08-26

### Added
- **New Cat Icon**: Replaced generic gear icon with custom cat SVG for better brand identity
- **Theme-Adaptive Design**: Monotone cat icon optimized for VS Code's light and dark themes
- **Proper Attribution**: Added CC Attribution License for cat icon sourced from SVG Repo

### Changed
- **Activity Bar Icon**: Updated from gear icon to themed cat icon for improved visual identity
- **Resource Cleanup**: Removed unused SVG files to reduce extension size

### Technical
- Implemented monotone SVG versions for light (#424242) and dark (#C5C5C5) VS Code themes
- Added proper icon attribution documentation in README.md

## [0.1.7] - 2025-08-26

### Added
- **Go-to-File Navigation**: New button and command to open YAML files directly from tree view
  - Opens YAML file at target definition line when clicking on target entries
  - Opens YAML file directly when clicking on build file entries
  - Accurate target line highlighting for multi-target YAML files
- **Set Current Target**: Right-click context menu option to designate a target as current
  - Visual distinction with green icon color for current target
  - "(Current)" prefix in target description
  - "[CURRENT TARGET]" indicator in tooltip
- **Status Bar Build Controls**: Build/Clean/Rebuild buttons in status bar for current target
  - Buttons appear only when a target is selected
  - Quick access to build operations without navigating to tree view
- **Enhanced Context Menu**: Organized right-click menu with proper grouping and separators

### Changed
- **Target Selection Behavior**: Setting current target now requires explicit right-click action (more intentional than single-click)
- **Context Menu Organization**: Restructured with logical groups: Set Current Target | Go to YAML | Build/Clean/Rebuild
- **Synchronized State Management**: Current target state now syncs between tree view and status bar

### Fixed
- **Multi-target Navigation**: Fixed issue where only first target in YAML file could be highlighted
- **Target Line Detection**: Improved YAML parsing for accurate target line identification

## [0.1.6] - 2025-08-26

### Added
- **Toggle YAML Files**: New toggle button to show/hide build.yaml file entries in tree view
- **Persistent Settings**: New `catboy.showYamlFiles` configuration option (defaults to false)
- **Project Target Count**: Shows number of targets in project description
- **Visual Hierarchy**: Blue colored folder icon for projects to distinguish from targets

### Changed
- **Build Button Icon**: Changed from gear to tools icon to avoid confusion with executable icon
- **Static Library Icon**: Updated to file-zip icon for better representation
- **Project Appearance**: Projects now use folder-library icon with blue color for prominence
- **Dynamic Tree Structure**: Tree view adapts based on YAML files visibility setting

### Fixed
- **Icon Consistency**: All target type icons now use consistent neutral coloring

### Technical
- Added context-based menu visibility for toggle button icons
- Improved tree view parent-child relationship handling for both display modes

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