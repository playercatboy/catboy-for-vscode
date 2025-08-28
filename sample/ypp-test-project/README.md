# YPP Demo Project

This is a demonstration project showcasing the YAML Pre-Processor (YPP) functionality in the Catboy build system and VSCode extension.

## Project Structure

```
ypp-test-project/
├── build.yaml              # Main build configuration with $include directives
├── targets/                 # Target definition files
│   ├── complex-app-build.yaml  # Build content for complex-app target
│   └── library-targets.yaml    # Complete target definitions
├── platforms/
│   └── native.yaml          # Platform-specific configurations
├── include/                 # Header files
│   ├── utils.h
│   └── math_utils.h
├── src/                     # Source files
│   ├── main.c               # Main application
│   ├── utils.c              # Utility functions
│   ├── math_utils.c         # Math library functions
│   └── test_main.c          # Unit tests
└── README.md                # This file
```

## YPP Include Patterns Demonstrated

This project demonstrates the three key YPP include patterns:

### Pattern 1: Full Target with NO $include directive
**Target:** `simple-app` (lines 10-19 in build.yaml)
- Complete target definition in the main build.yaml
- No includes, everything defined inline
- Good for simple targets or when you want everything visible in one place

### Pattern 2: Target with BUILD CONTENT included from another file  
**Target:** `complex-app` (lines 22-27 in build.yaml)
- Target name and type defined in main build.yaml
- The build configuration content comes from `targets/complex-app-build.yaml`
- Useful when you want to share build configurations across multiple targets

### Pattern 3: WHOLE TARGET included from another file
**Targets:** `math-lib`, `unit-tests`, `math-shared` (line 30 in build.yaml)
- Complete target definitions are in `targets/library-targets.yaml`
- The main build.yaml just includes the entire targets section
- Ideal for organizing related targets in separate files

## All Targets

The project defines 5 different targets across these patterns:

1. **simple-app** (executable) - Pattern 1: Fully defined inline
2. **complex-app** (executable) - Pattern 2: Build content included  
3. **math-lib** (static_library) - Pattern 3: Whole target included
4. **unit-tests** (executable) - Pattern 3: Whole target included
5. **math-shared** (shared_library) - Pattern 3: Whole target included

## Testing YPP Functionality

1. Open this directory in VSCode with the Catboy extension installed
2. The extension should automatically detect the build.yaml file and run YPP
3. In the VSCode Catboy tree view, you should see all 5 targets with proper icons
4. Test the "Go to File" functionality:
   - **simple-app**: Should go to line 10 in build.yaml (Pattern 1)
   - **complex-app**: Should go to line 22 in build.yaml (Pattern 2)  
   - **math-lib**: Should go to line 6 in targets/library-targets.yaml (Pattern 3)
   - **unit-tests**: Should go to line 15 in targets/library-targets.yaml (Pattern 3)
   - **math-shared**: Should go to line 24 in targets/library-targets.yaml (Pattern 3)

## Manual YPP Testing

You can also run YPP manually to see the flattened output:

```bash
catboy ypp -f build.yaml
# Check generated files:
cat build/flattened.yaml     # Flattened YAML with all includes resolved
cat build/flattened.json     # Metadata about target locations
```

## Key YPP Features Demonstrated

- **No includes** - Simple inline target definitions
- **Content includes** - Including build configurations from separate files  
- **Whole target includes** - Including complete target definitions
- **Glob patterns** in includes (`platforms/*.yaml`)
- **Original source location tracking** for precise IDE navigation

## Expected Extension Behavior

When you modify any YAML file and save:
- The extension automatically re-runs YPP 
- The project tree refreshes with updated targets
- Go-to-file navigation remains accurate to the original source locations