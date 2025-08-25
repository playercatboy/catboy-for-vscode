# Catboy for Visual Studio Code
This is the Visual Studio Code extension for Catboy build system.

## 0. About the Catboy build system
The Catboy build system is a C build system which utilizes YAML files as build configuration file.
The YAML file defines the toolchain options, source file list, include path, macro definitions, 
link libraries, library search paths and many other information.

A Catboy build configuration YAML file looks like this:
```yaml
name: project-1

targets:
  target-1:
    build:
      type: executable
      includes:
        - include
      defines:
        - TARGET_LEVEL_MACRO=1
        - BUILD_VERSION="1.0.0"
      links:
        - pthread
      flags:
        c: -Wall -Wextra -g
      sources:
        c:
          - src/main.c
          - src/test_macros.c
          - src/core/*.c
          - src/utils/*.c
```

## 1. Appearance requirements

### 1.1. Activity bar icon
The extension registers an icon to the Activity Bar (left icon menu).
Once clicked on the icon, it shows a custom view of the primary Side Bar.

### 1.2. Primary Side Bar view
A custom view will show up in the primary Side Bar once "Catboy" icon is clicked on the Activity Bar.
The view should be a tree view, showing all valid Catboy projects and targets in the VS Code currently opened directories.

The tree root should be the project name, and under it, shows all the targets. the view should just like
the file explorer view, with some additional buttons:
```
v project-1
  target-1		  b c r
  target-2		  b c r
> project-2
> project-3
```
legends:
```
v: the triangle icon which points down to indicate an expanded tree view.
>: the triangle icon which points right to indicate an collapsed tree view.
b: the build button, with "gears" icon
c: the clean button, with "trash can" icon
r: the rebuild button, with "refresh" icon
```

## 2. Behavior requirements

### 2.1. Searching and identification of project and targets
If a directory contains file `build.yaml`, then:
	check the `name` property specified in the yaml file. the value of it should be a string. use its value as the project name.
	check all sub sections under `targets` section. include all section names into the project.

The project acts like a namespace of the targets. different targets can be grouped into the same project, if they all specify
the same project name.

On the later version of Catboy build system, it will provide a command line interface to search and identify projects and return
a json string of structured projects and targets. So this function should be implemented as a dedicated function, for future expansion.

### 2.2. Build, clean and rebuild of a target
Build, clean and rebuild of a target is done by invoking Catboy build system's command line interface:
* Build: `catboy build -v -f build-dot-yaml-file-which-defines-the-target.yaml`
* Clean: `catboy clean -v -f build-dot-yaml-file-which-defines-the-target.yaml`
* Rebuild: `catboy rebuild -v -f build-dot-yaml-file-which-defines-the-target.yaml`

Once these buttons are clicked, open up terminal and run the command.

## 3. Settings requirements

### 3.1. Configuration of the extension
Currently the extension should provide 1 setting.

The setting name is "Catboy executable path", which sets the path to "catboy" executable.
This setting is optional, if leaves empty, the extension will execute "catboy" directly (assume executable in PATH).
