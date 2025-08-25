# Development TODOs for Catboy VSCode Extension

## Overview
This extension serves as a build system integration for Catboy, providing a GUI interface for build operations.
It does NOT provide syntax highlighting or IntelliSense - those are handled by VSCode's built-in YAML support and C/C++ extensions.

## 1. Project Setup and Infrastructure

### 1.1 Initialize VSCode Extension Project
- [ ] Run `yo code` to scaffold basic VSCode extension structure
- [ ] Configure package.json with extension metadata
- [ ] Set up TypeScript configuration (tsconfig.json)
- [ ] Configure ESLint and prettier for code quality
- [ ] Set up basic npm scripts (compile, watch, test, lint)

### 1.2 Development Environment
- [ ] Install required dependencies (@types/vscode, vscode-test, etc.)
- [ ] Configure launch.json for extension debugging
- [ ] Set up .vscodeignore for packaging
- [ ] Create .gitignore for node_modules and build artifacts

## 2. Core Extension Architecture

### 2.1 Extension Activation
- [ ] Create extension.ts with activate/deactivate functions
- [ ] Register activation events for workspace containing build.yaml
- [ ] Set up extension context and subscriptions management

### 2.2 Project Discovery System
- [ ] Implement YAML parser for build.yaml files
- [ ] Create ProjectDiscovery class to scan workspace
- [ ] Parse project name from `name` property
- [ ] Extract targets from `targets` section
- [ ] Handle multiple build.yaml files across workspace
- [ ] Group targets by project name (namespace handling)

## 3. User Interface Components

### 3.1 Activity Bar Integration
- [ ] Create custom "Catboy" icon for Activity Bar
- [ ] Register viewContainer in package.json
- [ ] Configure view contribution points

### 3.2 Tree View Implementation
- [ ] Create CatboyTreeDataProvider class
- [ ] Implement getChildren() for project/target hierarchy
- [ ] Implement getTreeItem() with proper icons and labels
- [ ] Add expand/collapse state management
- [ ] Create custom icons for projects and targets

### 3.3 Action Buttons
- [ ] Design icons for build (gears), clean (trash), rebuild (refresh)
- [ ] Implement inline action buttons for each target
- [ ] Register commands in package.json
- [ ] Wire buttons to command handlers

## 4. Command Implementation

### 4.1 Build System Integration
- [ ] Create command handler for build action
- [ ] Create command handler for clean action
- [ ] Create command handler for rebuild action
- [ ] Implement terminal integration for command execution
- [ ] Handle command output and error reporting

### 4.2 Command Execution
- [ ] Construct proper CLI commands with yaml file paths
- [ ] Handle catboy executable path from settings
- [ ] Implement fallback to PATH if executable not configured
- [ ] Add verbose flag (-v) to all commands
- [ ] Ensure proper working directory for command execution

## 5. Configuration and Settings

### 5.1 Extension Settings
- [ ] Define configuration schema in package.json
- [ ] Create "catboy.executablePath" setting
- [ ] Implement configuration provider
- [ ] Add setting validation and error handling
- [ ] Create UI contribution for settings page

## 6. Event Handling and Refresh

### 6.1 File System Watching
- [ ] Watch for build.yaml file changes
- [ ] Implement auto-refresh of tree view on changes
- [ ] Handle file creation/deletion events
- [ ] Debounce refresh operations for performance

### 6.2 Workspace Events
- [ ] Handle workspace folder additions/removals
- [ ] Update project list on workspace changes
- [ ] Maintain state across workspace sessions

## 7. Error Handling and Validation

### 7.1 YAML Validation
- [ ] Validate build.yaml structure
- [ ] Handle malformed YAML gracefully
- [ ] Provide helpful error messages for invalid configurations
- [ ] Check for required properties (name, targets)

### 7.2 Command Execution Errors
- [ ] Handle missing catboy executable
- [ ] Report build/clean/rebuild failures
- [ ] Display error output in Output channel
- [ ] Add retry mechanisms for transient failures

## 8. Testing

### 8.1 Unit Tests
- [ ] Test project discovery logic
- [ ] Test YAML parsing
- [ ] Test command construction
- [ ] Test tree data provider logic

### 8.2 Integration Tests
- [ ] Test extension activation
- [ ] Test UI component rendering
- [ ] Test command execution
- [ ] Test settings integration

## 9. Documentation and Publishing

### 9.1 Documentation
- [ ] Write README.md with usage instructions
- [ ] Document extension settings
- [ ] Create CHANGELOG.md
- [ ] Add screenshots for marketplace

### 9.2 Publishing Preparation
- [ ] Create extension icon (128x128)
- [ ] Write marketplace description
- [ ] Set up publisher account
- [ ] Configure repository URL in package.json
- [ ] Test VSIX package locally

## 10. Future Enhancements (Post-MVP)

### 10.1 Advanced Features
- [ ] Implement build task integration
- [ ] Create status bar item for active target
- [ ] Add build progress indicators
- [ ] Support for multiple build configurations

### 10.2 Catboy CLI Integration
- [ ] Implement JSON output parsing when available
- [ ] Add project/target caching for performance
- [ ] Add build.yaml file templates and snippets
- [ ] Support batch operations (build all targets)

## Priority Order

1. **High Priority** (MVP Requirements)
   - Project setup (1.1, 1.2)
   - Extension activation (2.1)
   - Project discovery (2.2)
   - Tree view basic implementation (3.2)
   - Command execution (4.1, 4.2)
   - Basic settings (5.1)

2. **Medium Priority** (Polish)
   - Activity bar icon (3.1)
   - Action buttons with icons (3.3)
   - File watching (6.1)
   - Error handling (7.1, 7.2)

3. **Low Priority** (Nice to have)
   - Advanced testing (8.2)
   - Documentation (9.1)
   - Future enhancements (10.1, 10.2)