# Catboy for Visual Studio Code

A Visual Studio Code extension that provides build system integration for the Catboy C build system.

## Features

- **Project Discovery**: Automatically discovers Catboy projects in your workspace by scanning for `build.yaml` files
- **Tree View Interface**: Displays all projects and their targets in a hierarchical tree view
- **Build Actions**: Quick access buttons for build, clean, and rebuild operations
- **Terminal Integration**: Executes Catboy commands directly in the VS Code integrated terminal

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

## Extension Settings

This extension contributes the following settings:

* `catboy.executablePath`: Path to the Catboy executable. If not specified, the extension will use `catboy` from PATH.

## Known Issues

- Initial release, please report issues on the GitHub repository

## Release Notes

### 0.1.0

Initial release of Catboy for Visual Studio Code:
- Project discovery from build.yaml files
- Tree view with projects and targets
- Build, clean, and rebuild actions
- Terminal integration for command execution

## Contributing

Contributions are welcome! Please feel free to submit issues and pull requests on the [GitHub repository](https://github.com/your-username/catboy-for-vscode).

## License

This extension is licensed under the MIT License. See the LICENSE file for details.