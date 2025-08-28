# I18N Test Project

This project is specifically designed to test the internationalization (i18n) features of the Catboy VS Code extension's CodeLens functionality.

## Test Scenarios

This project contains comprehensive test cases for all CodeLens translation scenarios:

### 1. Single File Includes
- **Target**: `single-file-test`
- **Include**: `$include: configs/single-target.yaml` (single existing file)
- **Expected CodeLens**: "📄 Open YAML File" (English) / "📄 打开 YAML 文件" (Chinese)

### 2. Multiple File Includes (Glob Pattern)
- **Target**: `multi-file-test`
- **Include**: `$include: configs/multi-*.yaml` (matches 2 files)
- **Expected CodeLens**: "📁 2 files (click to choose)" (English) / "📁 2 个文件（点击选择）" (Chinese)

### 3. Missing File Includes
- **Target**: `missing-file-test`
- **Include**: `$include: configs/nonexistent-file.yaml` (file doesn't exist)
- **Expected CodeLens**: "⚠️ File not found" (English) / "⚠️ 文件未找到" (Chinese)

### 4. Multiple Specific Files
- **Target**: `specific-multi-test`
- **Include**: `$include: ["configs/debug.yaml", "configs/release.yaml", "configs/test.yaml"]` (3 files)
- **Expected CodeLens**: "📁 3 files (click to choose)" (English) / "📁 3 个文件（点击选择）" (Chinese)

### 5. Top-level Includes
- **Include**: `$include: targets/external-targets.yaml` (at YAML root level)
- **Expected CodeLens**: "📄 Open YAML File" (English) / "📄 打开 YAML 文件" (Chinese)

### 6. Quoted Path Formats
- **Target**: `quoted-single` - Quoted single file path
- **Target**: `quoted-multi` - Quoted glob pattern (matches lib-*.yaml files)
- **Target**: `spaces-missing` - Quoted path with spaces (file doesn't exist)

## How to Test

1. Open this project in VS Code with the Catboy extension installed
2. Open `build.yaml` in the editor
3. You should see CodeLens links above each `$include` directive line
4. Test in different languages:
   - Run "Catboy: Change Language" command
   - Select English or 中文(简体) to test translations
   - Observe that CodeLens text changes language accordingly

## Expected Behavior

### English Mode:
- Single files: "📄 Open YAML File"
- Multiple files: "📁 X files (click to choose)" 
- Missing files: "⚠️ File not found"

### Chinese Mode (中文简体):
- Single files: "📄 打开 YAML 文件"
- Multiple files: "📁 X 个文件（点击选择）"
- Missing files: "⚠️ 文件未找到"

### Interactive Features:
- **Single file links**: Click to open the file directly
- **Multiple file links**: Click to show quick pick menu with file selection
- **Hover tooltips**: Hover over include paths to see resolved file information
- **F12 Navigation**: Press F12 on include paths for "Go to Definition"
- **Underline decorations**: Include paths should have underlines and link styling

## File Structure

```
i18n-test-project/
├── build.yaml                 # Main build file with test cases
├── configs/                   # Configuration files
│   ├── single-target.yaml    # Single file for test case 1
│   ├── multi-debug.yaml      # First file for glob pattern
│   ├── multi-release.yaml    # Second file for glob pattern  
│   ├── debug.yaml            # Debug config for specific multi-test
│   ├── release.yaml          # Release config for specific multi-test
│   ├── test.yaml             # Test config for specific multi-test
│   ├── quoted-single.yaml    # File for quoted path test
│   ├── lib-core.yaml         # First lib-* file
│   └── lib-utils.yaml        # Second lib-* file
├── targets/
│   └── external-targets.yaml # External target definitions
├── src/                       # Source files
└── include/                   # Header files
```