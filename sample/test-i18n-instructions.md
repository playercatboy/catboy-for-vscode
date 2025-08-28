# CodeLens Internationalization Testing Instructions

This document provides step-by-step instructions to test the internationalization (i18n) features of the Catboy VS Code extension's CodeLens functionality.

## Prerequisites

1. VS Code with Catboy extension installed (v0.2.0+)
2. Test projects located in:
   - `sample/i18n-test-project/` (basic functionality tests)
   - `sample/edge-case-test-project/` (edge case and error handling tests)
   - `sample/ypp-test-project/` (existing YPP functionality tests)

## Test Procedure

### Phase 1: Basic Functionality Testing

1. **Open i18n-test-project**
   ```bash
   code sample/i18n-test-project/
   ```

2. **Open build.yaml in editor**
   - File should display with YAML syntax highlighting
   - Look for `$include` directives on lines 18, 21, 26, 31, 38, etc.

3. **Verify CodeLens Display (English Mode)**
   - Above line 18 (`$include: configs/single-target.yaml`):
     - Should show: "📄 Open YAML File"
   - Above line 21 (`$include: configs/multi-*.yaml`): 
     - Should show: "📁 2 files (click to choose)"
   - Above line 26 (`$include: configs/nonexistent-file.yaml`):
     - Should show: "⚠️ File not found"
   - Above line 31 (`$include: ["configs/debug.yaml", "configs/release.yaml", "configs/test.yaml"]`):
     - Should show: "📁 3 files (click to choose)"
   - Above line 38 (`$include: targets/external-targets.yaml`):
     - Should show: "📄 Open YAML File"

### Phase 2: Language Switching Testing

4. **Switch to Chinese Mode**
   - Press `Ctrl+Shift+P` (Windows/Linux) or `Cmd+Shift+P` (Mac)
   - Type "Catboy: Change Language"
   - Select "中文(简体)"
   - Reload VS Code window when prompted

5. **Verify CodeLens Display (Chinese Mode)**
   - Above line 18: Should show "📄 打开 YAML 文件"
   - Above line 21: Should show "📁 2 个文件（点击选择）"
   - Above line 26: Should show "⚠️ 文件未找到"
   - Above line 31: Should show "📁 3 个文件（点击选择）"
   - Above line 38: Should show "📄 打开 YAML 文件"

6. **Switch Back to English**
   - Run "Catboy: Change Language" again
   - Select "English"
   - Verify CodeLens reverts to English text

### Phase 3: Interactive Feature Testing

7. **Test Single File Links**
   - Click "📄 Open YAML File" CodeLens on line 18
   - Should open `configs/single-target.yaml` directly
   - Verify file opens in new tab

8. **Test Multi-File Links**
   - Click "📁 2 files (click to choose)" CodeLens on line 21
   - Should show quick pick menu with options:
     - `configs/multi-debug.yaml`
     - `configs/multi-release.yaml`
   - Select one option, verify it opens

9. **Test File Not Found Links**
   - Click "⚠️ File not found" CodeLens on line 26
   - Should show no action or display error message

10. **Test Hover Tooltips**
    - Hover over `configs/single-target.yaml` (the path, not `$include`)
    - Should show hover tooltip with file info
    - Test in both English and Chinese modes
    - English: Should contain "Resolved files:" and "Click to open file"
    - Chinese: Should contain "已解析的文件:" and "点击打开文件"

11. **Test F12 Navigation**
    - Position cursor on `configs/single-target.yaml` path
    - Press F12 (Go to Definition)
    - Should navigate to the included file

12. **Test Underline Decorations**
    - Include file paths should have underline decoration
    - Paths should have link-style coloring
    - Cursor should change to pointer when hovering

### Phase 4: Edge Case Testing

13. **Open edge-case-test-project**
    ```bash
    code sample/edge-case-test-project/
    ```

14. **Test Edge Cases**
    - Empty include (`$include: ""`): Should show "⚠️ File not found"
    - Whitespace include (`$include: "   "`): Should show "⚠️ File not found"
    - Deep nested path: Should show "📄 Open YAML File" and work correctly
    - No-match glob: Should show "⚠️ File not found"
    - Many matches (15 files): Should show "📁 15 files (click to choose)"
    - Special characters: Should work correctly
    - Unicode filename: Should display and work correctly

15. **Test Error Handling**
    - Verify no crashes or exceptions occur
    - Error states should display appropriate messages
    - Invalid paths should be handled gracefully

### Phase 5: Performance and Stability Testing

16. **Test File Watching**
    - Create a new `.yaml` file in configs directory
    - Add matching include pattern to build.yaml
    - Verify CodeLens updates automatically

17. **Test Large Files**
    - Add many more `$include` directives to build.yaml
    - Verify performance remains acceptable
    - CodeLens should update correctly for all entries

## Expected Results

### ✅ Pass Criteria

- [ ] All CodeLens display correct English text initially
- [ ] Language switching changes all CodeLens text to Chinese
- [ ] Language switching back to English works correctly
- [ ] Single file links open files directly
- [ ] Multi-file links show quick pick menu with correct count
- [ ] Missing file links show appropriate error state
- [ ] Hover tooltips display in correct language
- [ ] F12 navigation works on include paths
- [ ] Underline decorations appear on file paths
- [ ] Edge cases handled gracefully without crashes
- [ ] Large file counts display correctly
- [ ] Unicode filenames work properly

### ❌ Fail Criteria

- CodeLens text doesn't change when switching languages
- Crashes or exceptions when processing includes
- Links don't work or open wrong files
- Hover tooltips show wrong language or missing translations
- F12 navigation doesn't work
- Edge cases cause crashes or incorrect behavior

## Troubleshooting

### CodeLens Not Showing
1. Verify YAML file is detected as YAML language mode
2. Check VS Code settings for CodeLens enabled
3. Restart VS Code extension host (`Ctrl+Shift+P` → "Developer: Reload Window")

### Language Not Switching
1. Verify language change command completed successfully
2. Reload window after language change
3. Check language setting: `Ctrl+Shift+P` → "Preferences: Open Settings" → search "catboy.language"

### Files Not Opening
1. Verify file paths exist on disk
2. Check VS Code workspace folder is correct
3. Verify file permissions allow reading

## Reporting Issues

If any tests fail, please report with:
1. VS Code version
2. Catboy extension version  
3. Operating system
4. Specific test case that failed
5. Expected vs actual behavior
6. Console errors (if any): `Ctrl+Shift+I` → Console tab