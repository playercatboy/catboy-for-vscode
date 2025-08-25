// Simple YAML parser for build.yaml files
// This is a basic implementation that handles the specific structure we need

export function parseSimpleYaml(content: string): any {
    const lines = content.split('\n');
    const result: any = {};
    let currentPath: string[] = [];
    
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        const trimmed = line.trim();
        
        // Skip empty lines and comments
        if (!trimmed || trimmed.startsWith('#')) {
            continue;
        }
        
        // Calculate indentation level
        const indent = line.length - line.trimStart().length;
        const level = Math.floor(indent / 2);
        
        // Adjust current path based on indentation
        currentPath = currentPath.slice(0, level);
        
        if (trimmed.includes(':')) {
            const [key, value] = trimmed.split(':', 2);
            const cleanKey = key.trim();
            const cleanValue = value?.trim() || '';
            
            // Navigate to the correct nested object
            let current = result;
            for (const pathPart of currentPath) {
                current = current[pathPart];
            }
            
            if (cleanValue === '' || cleanValue === '{}' || cleanValue === '[]') {
                // This is a parent key
                current[cleanKey] = {};
                currentPath.push(cleanKey);
            } else {
                // This is a value
                let parsedValue: any = cleanValue;
                
                // Handle quoted strings
                if (cleanValue.startsWith('"') && cleanValue.endsWith('"')) {
                    parsedValue = cleanValue.slice(1, -1);
                } else if (cleanValue.startsWith("'") && cleanValue.endsWith("'")) {
                    parsedValue = cleanValue.slice(1, -1);
                } else if (cleanValue === 'true') {
                    parsedValue = true;
                } else if (cleanValue === 'false') {
                    parsedValue = false;
                } else if (!isNaN(Number(cleanValue))) {
                    parsedValue = Number(cleanValue);
                }
                
                current[cleanKey] = parsedValue;
            }
        } else if (trimmed.startsWith('-')) {
            // Handle arrays (simple case)
            const arrayValue = trimmed.substring(1).trim();
            
            // Navigate to the correct nested object
            let current = result;
            for (let j = 0; j < currentPath.length - 1; j++) {
                current = current[currentPath[j]];
            }
            
            const arrayKey = currentPath[currentPath.length - 1];
            if (!Array.isArray(current[arrayKey])) {
                current[arrayKey] = [];
            }
            current[arrayKey].push(arrayValue);
        }
    }
    
    return result;
}