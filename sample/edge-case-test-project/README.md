# Edge Case Test Project

This project tests edge cases and error conditions for the Catboy VS Code extension's CodeLens i18n functionality.

## Test Cases

### 1. Empty Include Path
- **Target**: `empty-include`
- **Include**: `$include: ""`
- **Expected**: "⚠️ File not found" (should handle empty paths gracefully)

### 2. Whitespace-Only Include
- **Target**: `whitespace-include` 
- **Include**: `$include: "   "`
- **Expected**: "⚠️ File not found" (should handle whitespace-only paths)

### 3. Deep Nested Path
- **Target**: `deep-nested`
- **Include**: `configs/nested/deep/single-config.yaml`
- **Expected**: "📄 Open YAML File" (should handle deep directory structures)

### 4. Glob with No Matches
- **Target**: `no-match-glob`
- **Include**: `configs/nomatch-*.yaml`
- **Expected**: "⚠️ File not found" (should handle globs that match nothing)

### 5. Many File Matches
- **Target**: `many-matches`
- **Include**: `configs/generated-*.yaml` (matches 15 files)
- **Expected**: "📁 15 files (click to choose)" (should handle large file counts)

### 6. Special Characters in Filename
- **Target**: `special-chars`
- **Include**: `configs/file-with-special-chars_@#$.yaml`
- **Expected**: "📄 Open YAML File" (should handle special characters)

### 7. Relative Path Traversal
- **Target**: `relative-paths`
- **Include**: `../edge-case-test-project/configs/relative.yaml`
- **Expected**: "📄 Open YAML File" (should handle .. path traversal)

### 8. Mixed Valid/Invalid Array
- **Target**: `mixed-includes`
- **Include**: Array with 2 valid + 1 invalid file
- **Expected**: "📁 2 files (click to choose)" (should only count existing files)

### 9. Compact Formatting
- **Target**: `compact-target`
- **Include**: Single line YAML with `$include`
- **Expected**: "📄 Open YAML File" (should handle compact YAML syntax)

### 10. Unicode Filename
- **Target**: `unicode-test`
- **Include**: `configs/测试文件.yaml` (Chinese characters)
- **Expected**: "📄 Open YAML File" (should handle Unicode filenames)

## How to Test Edge Cases

1. Open `build.yaml` in VS Code with Catboy extension
2. Observe CodeLens behavior for each test case
3. Verify error handling for missing/malformed includes
4. Test hover tooltips and F12 navigation on various scenarios
5. Test in both English and Chinese modes using "Catboy: Change Language"

## Expected Error Handling

The extension should gracefully handle all edge cases without crashing:
- Empty/whitespace paths → File not found
- Non-existent globs → File not found  
- Invalid characters → Proper path resolution or file not found
- Large file counts → Show count correctly
- Unicode paths → Proper display and navigation

## File Structure

```
edge-case-test-project/
├── build.yaml                           # Main test file with edge cases
├── configs/
│   ├── nested/deep/single-config.yaml  # Deep nested path test
│   ├── file-with-special-chars_@#$.yaml # Special characters test
│   ├── relative.yaml                    # Relative path test  
│   ├── valid1.yaml                      # Mixed array test (valid)
│   ├── valid2.yaml                      # Mixed array test (valid)
│   ├── compact.yaml                     # Compact format test
│   ├── 测试文件.yaml                      # Unicode filename test
│   └── generated-*.yaml                 # 15 files for large count test
└── src/                                 # Test source files
```

## Testing Instructions

1. Language Testing:
   - Change language via "Catboy: Change Language"
   - Verify all CodeLens text changes appropriately
   - Test hover tooltips in both languages

2. Interaction Testing:
   - Click single file links (should open directly)
   - Click multi-file links (should show quick pick)
   - Hover over include paths (should show file info)
   - Use F12 on include paths (should navigate)

3. Error Handling Testing:
   - Verify graceful handling of missing files
   - Test malformed paths and edge cases
   - Ensure no crashes or unhandled exceptions