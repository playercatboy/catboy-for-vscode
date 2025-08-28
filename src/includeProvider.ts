import * as vscode from 'vscode';
import { localize } from './languageManager';

/**
 * Interface for $include directive information
 */
interface IncludeDirective {
    range: vscode.Range; // Range of the file path (for underline, hover, F12)
    path: string;
    resolvedPaths: string[];
    line: number;
    includeRange: vscode.Range; // Range of the $include keyword (for CodeLens)
}

/**
 * Provider that handles CodeLens, decorations, hover, and definition for $include directives
 */
export class IncludeProvider implements vscode.CodeLensProvider, vscode.HoverProvider, vscode.DefinitionProvider {
    private decorationType: vscode.TextEditorDecorationType;
    private _onDidChangeCodeLenses: vscode.EventEmitter<void> = new vscode.EventEmitter<void>();
    readonly onDidChangeCodeLenses: vscode.Event<void> = this._onDidChangeCodeLenses.event;

    constructor() {
        // Create decoration type for underline styling
        this.decorationType = vscode.window.createTextEditorDecorationType({
            textDecoration: 'underline',
            cursor: 'pointer',
            color: new vscode.ThemeColor('textLink.foreground')
        });

        // Listen for text document changes to update decorations
        vscode.workspace.onDidChangeTextDocument(() => {
            this.updateDecorations();
        });

        // Listen for active editor changes
        vscode.window.onDidChangeActiveTextEditor(() => {
            this.updateDecorations();
        });

        // Initial decoration update
        this.updateDecorations();
    }

    /**
     * Find all $include directives in a document
     */
    private async findIncludeDirectives(document: vscode.TextDocument): Promise<IncludeDirective[]> {
        const directives: IncludeDirective[] = [];
        const includeRegex = /\$include:\s*(.+)/g;
        
        for (let i = 0; i < document.lineCount; i++) {
            const line = document.lineAt(i);
            const text = line.text;
            
            let match;
            while ((match = includeRegex.exec(text)) !== null) {
                const includeStart = match.index + match[0].indexOf('$include');
                const includeEnd = includeStart + '$include'.length;
                const pathStart = match.index + match[0].indexOf(match[1]);
                const pathEnd = pathStart + match[1].length;
                
                // Create two ranges: one for CodeLens (on $include), one for decorations (on path)
                const includeRange = new vscode.Range(i, includeStart, i, includeEnd); // For CodeLens
                const pathRange = new vscode.Range(i, pathStart, i, pathEnd); // For decorations/hover/definition
                const pathValue = match[1].trim().replace(/['"]/g, ''); // Remove quotes
                
                // Resolve the include path(s)
                const resolvedPaths = await this.resolveIncludePath(document.uri.fsPath, pathValue);
                
                directives.push({
                    range: pathRange, // Use path range for interactions (underline, hover, F12)
                    path: pathValue,
                    resolvedPaths,
                    line: i,
                    includeRange: includeRange // Keep include range for CodeLens
                });
            }
            
            // Reset regex for next iteration
            includeRegex.lastIndex = 0;
        }
        
        return directives;
    }

    /**
     * Resolve include path, handling glob patterns using VS Code's workspace API
     */
    private async resolveIncludePath(documentPath: string, includePath: string): Promise<string[]> {
        try {
            const documentDir = vscode.Uri.file(documentPath).with({ path: vscode.Uri.file(documentPath).path.replace(/\/[^\/]+$/, '') });
            
            // Check if it's a glob pattern
            if (includePath.includes('*')) {
                // Use VS Code's workspace findFiles API which supports glob patterns
                const relativePattern = new vscode.RelativePattern(documentDir, includePath);
                const files = await vscode.workspace.findFiles(relativePattern);
                return files.map(uri => uri.fsPath);
            } else {
                // Single file
                const fullPath = vscode.Uri.joinPath(documentDir, includePath);
                try {
                    await vscode.workspace.fs.stat(fullPath);
                    return [fullPath.fsPath];
                } catch {
                    return [];
                }
            }
        } catch (error) {
            return [];
        }
    }

    /**
     * Update decorations for the active editor
     */
    private async updateDecorations() {
        const editor = vscode.window.activeTextEditor;
        if (!editor || !this.isYamlFile(editor.document)) {
            return;
        }

        const directives = await this.findIncludeDirectives(editor.document);
        const decorations: vscode.DecorationOptions[] = [];

        for (const directive of directives) {
            if (directive.resolvedPaths.length > 0) {
                decorations.push({
                    range: directive.range,
                    hoverMessage: localize('catboy.include.decoration.goToFiles', 'Go to included file(s): {0}', directive.resolvedPaths.map(p => vscode.workspace.asRelativePath(p)).join(', '))
                });
            }
        }

        editor.setDecorations(this.decorationType, decorations);
    }

    /**
     * Check if document is a YAML file
     */
    private isYamlFile(document: vscode.TextDocument): boolean {
        return document.languageId === 'yaml' || document.fileName.endsWith('.yaml') || document.fileName.endsWith('.yml');
    }

    /**
     * Provide CodeLens for $include directives
     */
    async provideCodeLenses(document: vscode.TextDocument): Promise<vscode.CodeLens[]> {
        if (!this.isYamlFile(document)) {
            return [];
        }

        const directives = await this.findIncludeDirectives(document);
        const codeLenses: vscode.CodeLens[] = [];

        for (const directive of directives) {
            if (directive.resolvedPaths.length === 0) {
                // Show "File not found" for unresolved includes
                codeLenses.push(new vscode.CodeLens(directive.includeRange, {
                    title: `⚠️ ${localize('catboy.include.fileNotFound', 'File not found')}`,
                    command: '',
                    arguments: []
                }));
            } else if (directive.resolvedPaths.length === 1) {
                // Single file - direct link with descriptive text
                const filePath = directive.resolvedPaths[0];
                
                codeLenses.push(new vscode.CodeLens(directive.includeRange, {
                    title: `📄 ${localize('catboy.include.openYamlFile', 'Open YAML File')}`,
                    command: 'vscode.open',
                    arguments: [vscode.Uri.file(filePath)]
                }));
            } else {
                // Multiple files - show count and provide quick pick
                const fileCount = directive.resolvedPaths.length;
                
                codeLenses.push(new vscode.CodeLens(directive.includeRange, {
                    title: `📁 ${localize('catboy.include.multipleFiles', '{0} files (click to choose)', fileCount.toString())}`,
                    command: 'catboy.openIncludeFile',
                    arguments: [directive.resolvedPaths]
                }));
            }
        }

        return codeLenses;
    }

    /**
     * Provide hover information for $include directives
     */
    async provideHover(document: vscode.TextDocument, position: vscode.Position): Promise<vscode.Hover | null> {
        if (!this.isYamlFile(document)) {
            return null;
        }

        const directives = await this.findIncludeDirectives(document);
        
        for (const directive of directives) {
            if (directive.range.contains(position)) {
                if (directive.resolvedPaths.length === 0) {
                    return new vscode.Hover(
                        localize('catboy.include.hover.fileNotFound', '**$include**: `{0}`\n\n⚠️ **File not found**', directive.path),
                        directive.range
                    );
                } else {
                    const fileList = directive.resolvedPaths
                        .map(p => `• \`${vscode.workspace.asRelativePath(p)}\``)
                        .join('\n');
                    
                    return new vscode.Hover(
                        localize('catboy.include.hover.resolvedFiles', '**$include**: `{0}`\n\n**Resolved files:**\n{1}\n\n*Click to open file*', directive.path, fileList),
                        directive.range
                    );
                }
            }
        }

        return null;
    }

    /**
     * Provide definition for Go to Definition (F12) on $include directives
     */
    async provideDefinition(document: vscode.TextDocument, position: vscode.Position): Promise<vscode.Definition | null> {
        if (!this.isYamlFile(document)) {
            return null;
        }

        const directives = await this.findIncludeDirectives(document);
        
        for (const directive of directives) {
            if (directive.range.contains(position)) {
                if (directive.resolvedPaths.length === 1) {
                    // Single file - go directly
                    return new vscode.Location(vscode.Uri.file(directive.resolvedPaths[0]), new vscode.Position(0, 0));
                } else if (directive.resolvedPaths.length > 1) {
                    // Multiple files - return all as definitions
                    return directive.resolvedPaths.map(filePath =>
                        new vscode.Location(vscode.Uri.file(filePath), new vscode.Position(0, 0))
                    );
                }
            }
        }

        return null;
    }

    /**
     * Refresh CodeLens
     */
    refresh() {
        this._onDidChangeCodeLenses.fire();
        this.updateDecorations();
    }

    /**
     * Dispose of resources
     */
    dispose() {
        this.decorationType.dispose();
        this._onDidChangeCodeLenses.dispose();
    }
}