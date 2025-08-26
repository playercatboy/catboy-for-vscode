# Catboy for Visual Studio Code

A Visual Studio Code extension that provides build system integration for the Catboy C build system.

## Features

- **Project Discovery**: Automatically discovers Catboy projects in your workspace by scanning for `build.yaml` files
- **Tree View Interface**: Displays all projects and their targets in a hierarchical tree view
- **Build Actions**: Quick access buttons for build, clean, and rebuild operations
- **Terminal Integration**: Executes Catboy commands directly in the VS Code integrated terminal
- **Status Bar Integration**: Shows current target and build progress in the status bar
- **Error Handling**: Comprehensive validation and error reporting for build.yaml files
- **Command Palette**: Quick target selection and output viewing via command palette
- **Smart Terminal Management**: Reuses terminals per target for better organization

## Requirements

- [Catboy build system](https://github.com/catboy-build/catboy) installed and available in your PATH
- Visual Studio Code 1.74.0 or higher

## Installation

1. Install the extension from the Visual Studio Code Marketplace
2. Ensure the `catboy` executable is available in your system PATH, or configure the executable path in settings

## Usage

### Opening the Catboy View

Click on the Catboy icon in the Activity Bar (left sidebar) to open the Catboy projects view.

### Project Structure

The extension recognizes projects defined in `build.yaml` files with the following structure:

```yaml
name: my-project

targets:
  my-target:
    build:
      type: executable
      sources:
        c:
          - src/main.c
          - src/*.c
      includes:
        - include
      defines:
        - DEBUG=1
      links:
        - pthread
      flags:
        c: -Wall -Wextra -g
```

### Available Actions

Each target in the tree view provides three action buttons:

- **Build** (⚙️): Executes `catboy build -v -f <yaml-file>`
- **Clean** (🗑️): Executes `catboy clean -v -f <yaml-file>`
- **Rebuild** (🔄): Executes `catboy rebuild -v -f <yaml-file>`

### Additional Features

- **Status Bar**: Shows the currently selected target and build progress
- **Command Palette**: Access `Catboy: Select Target` and `Catboy: Show Output` commands
- **Output Channel**: View detailed logs and error messages in the "Catboy" output channel
- **Auto-refresh**: Automatically detects changes to build.yaml files and refreshes the view

## Extension Settings

This extension contributes the following settings:

* `catboy.executablePath`: Path to the Catboy executable. If not specified, the extension will use `catboy` from PATH.
* `catboy.showYamlFiles`: Show build.yaml file entries in the project tree view (default: false). Can also be toggled via the button in the tree view header.

## Known Issues

None currently known. Please report any issues on the GitHub repository.

## Release Notes

### 0.1.9

Bug fixes and UX improvements:
- **Fixed Extension Test**: Corrected publisher ID in extension test suite
- **Enhanced Target Selection**: Target selection dialog now shows user-friendly target type names
- **Current Target Indication**: Selected target is now highlighted with checkmark and pre-selected in quick pick

### 0.1.8

Enhanced activity bar icon and attribution:
- **New Cat Icon**: Replaced generic gear icon with custom cat SVG for better brand identity
- **Theme-Adaptive Design**: Monotone cat icon optimized for VS Code's light and dark themes
- **Resource Cleanup**: Removed unused SVG files to reduce extension size
- **Proper Attribution**: Added CC Attribution License for cat icon sourced from SVG Repo

### 0.1.7

Comprehensive workflow enhancements and navigation improvements:
- **Go-to-File Navigation**: Jump directly to YAML files and target definitions from tree view
- **Current Target System**: Set and visually track the active build target with green highlighting
- **Status Bar Controls**: Quick Build/Clean/Rebuild buttons for the current target
- **Enhanced Context Menu**: Organized right-click menu with logical command grouping

### 0.1.6

Enhanced UI controls and visual improvements:
- **Toggle YAML files**: New button to show/hide build.yaml entries in tree view
- **Configurable display**: Persistent setting for YAML file visibility (default: hidden)
- **Better visual hierarchy**: Projects use blue folder icons with target counts
- **Improved icons**: Updated build button (tools) and static library (file-zip) icons

### 0.1.5

Target type visualization and improved UX:
- **Target type-based icons**: Different icons for executables, libraries, object files, and Luna BSP targets
- **Target type labels**: Dimmed type descriptions (e.g., "Executable", "Dynamic Link Library") shown after target names
- **Enhanced target selection**: Dropdown shows type-specific icons and information
- **Consistent icon colors**: All target icons use neutral/white coloring for visual consistency

### 0.1.4

Enhanced tree view and build management:
- **New build file tree level**: Shows build.yaml files between projects and targets for better organization
- **Build all targets**: Build file entries can build/clean/rebuild all targets at once
- **Improved path display**: Consistent forward slash separators across all platforms
- **Better visual hierarchy**: File icons and dimmed filenames for clearer navigation

### 0.1.3

Bug fixes and UI improvements:
- **Fixed duplicate targets bug**: Resolved issue where targets would appear duplicated when refreshing
- **Added alphabetical sorting**: Projects and targets now display in consistent alphabetical order
- **Improved state management**: Better handling of project discovery during refresh operations

### 0.1.2

Bug fixes and stability improvements:
- **Fixed extension activation issues**: Extension now activates properly in all environments
- **Resolved dependency problems**: Replaced external YAML dependency with lightweight custom parser
- **Improved reliability**: Commands are now always registered and available
- **Better error handling**: Enhanced logging for troubleshooting activation issues

### 0.1.1

Enhanced user experience improvements:
- Status bar integration with build progress indicators
- Smart terminal management with per-target reuse
- Comprehensive error handling and validation
- Command palette integration for quick target selection

### 0.1.0

Initial release of Catboy for Visual Studio Code:
- Project discovery from build.yaml files
- Tree view with projects and targets
- Build, clean, and rebuild actions
- Terminal integration for command execution

## Development

### Prerequisites

- Node.js 16.x or higher
- npm 7.x or higher
- Visual Studio Code

### Setup

1. Clone the repository:
```bash
git clone https://github.com/catboy-build/catboy-for-vscode.git
cd catboy-for-vscode
```

2. Install dependencies:
```bash
npm install
```

3. Compile the extension:
```bash
npm run compile
```

### Running the Extension

1. Open the project in Visual Studio Code
2. Press `F5` to launch a new VS Code window with the extension loaded
3. Open a folder containing a `build.yaml` file
4. Click on the Catboy icon in the Activity Bar to see your projects

### Testing

#### Development Testing

1. **Run the extension in development mode:**
   ```bash
   # Open the project in VSCode
   code .
   
   # Press F5 to launch Extension Development Host
   # This opens a new VSCode window with the extension loaded
   ```

2. **Test with sample project:**
   - In the Extension Development Host, open the `sample/` folder
   - Look for the Catboy icon in the Activity Bar
   - Verify projects and targets appear in the tree view

3. **Test mock Catboy (optional):**
   - Configure executable path in settings to point to `sample/mock-catboy.bat` (Windows) or `sample/mock-catboy.sh` (Unix/Mac)
   - Test build commands without installing actual Catboy

#### Automated Tests

Run the test suite:
```bash
npm test
```

#### Manual Testing Checklist

- [ ] Extension icon appears in Activity Bar
- [ ] Tree view shows projects and targets from build.yaml files
- [ ] Build/Clean/Rebuild buttons execute commands in terminal
- [ ] Status bar shows selected target
- [ ] Command palette commands work (Ctrl+Shift+P → "Catboy")
- [ ] Output channel shows project discovery logs
- [ ] File changes trigger automatic refresh
- [ ] Error handling displays warnings for invalid YAML files

### Building for Production

Create a VSIX package:
```bash
npm install -g vsce
vsce package
```

## Contributing

Contributions are welcome! Please feel free to submit issues and pull requests on the [GitHub repository](https://github.com/catboy-build/catboy-for-vscode).

## License

This extension is licensed under the MIT License. See the LICENSE file for details.

### Icon Attribution

The cat icon used in this extension is sourced from [SVG Repo](https://www.svgrepo.com/svg/524392/cat) and is licensed under CC Attribution License.