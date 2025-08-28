import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';
import { parseSimpleYaml } from './yamlParser';
import { localize } from './languageManager';

export interface CatboyTarget {
    name: string;
    projectName: string;
    yamlPath: string;
    targetType?: string; // exe, dll, sll, obj, luna, etc.
    originalFilePath?: string; // Original file path from flattened.json
    originalLineNumber?: number; // Original line number from flattened.json
}

export interface CatboyBuildFile {
    yamlPath: string;
    projectName: string;
    targets: CatboyTarget[];
}

export interface CatboyProject {
    name: string;
    buildFiles: CatboyBuildFile[];
    targets: CatboyTarget[]; // Keep for backward compatibility
}

export interface ParseError {
    file: string;
    message: string;
}

export interface YppTarget {
    name: string;
    type: string;
    file_path: string;
    line_number: number;
}

export interface YppMetadata {
    version: string;
    targets: YppTarget[];
}

export class ProjectDiscovery {
    private projects: Map<string, CatboyProject> = new Map();
    private parseErrors: ParseError[] = [];
    private outputChannel: vscode.OutputChannel;
    private fileWatcher: vscode.FileSystemWatcher | undefined;
    private refreshCallback: (() => void) | undefined;

    constructor() {
        this.outputChannel = vscode.window.createOutputChannel(localize('catboy.output.channel.name', 'Catboy'));
        this.setupFileWatcher();
    }

    setRefreshCallback(callback: () => void) {
        this.refreshCallback = callback;
    }

    private setupFileWatcher() {
        // Watch for changes to build.yaml files
        this.fileWatcher = vscode.workspace.createFileSystemWatcher('**/build.yaml');
        
        this.fileWatcher.onDidChange(async (uri) => {
            this.outputChannel.appendLine(`Build file changed: ${vscode.workspace.asRelativePath(uri.fsPath)}`);
            await this.processYppForFile(uri.fsPath);
            if (this.refreshCallback) {
                this.refreshCallback();
            }
        });
        
        this.fileWatcher.onDidCreate(async (uri) => {
            this.outputChannel.appendLine(`New build file created: ${vscode.workspace.asRelativePath(uri.fsPath)}`);
            await this.processYppForFile(uri.fsPath);
            if (this.refreshCallback) {
                this.refreshCallback();
            }
        });
        
        this.fileWatcher.onDidDelete((uri) => {
            this.outputChannel.appendLine(`Build file deleted: ${vscode.workspace.asRelativePath(uri.fsPath)}`);
            if (this.refreshCallback) {
                this.refreshCallback();
            }
        });
    }

    private async processYppForFile(yamlPath: string): Promise<void> {
        try {
            const workspaceFolder = vscode.workspace.getWorkspaceFolder(vscode.Uri.file(yamlPath));
            if (!workspaceFolder) {
                return;
            }

            // Get catboy executable path from configuration
            const config = vscode.workspace.getConfiguration('catboy');
            const catboyPath = config.get<string>('executablePath') || 'catboy';

            // Change to the directory containing the build.yaml file
            const yamlDir = path.dirname(yamlPath);
            const yamlFileName = path.basename(yamlPath);

            this.outputChannel.appendLine(`Running YPP for ${vscode.workspace.asRelativePath(yamlPath)}...`);

            // Execute catboy ypp command
            const { exec } = require('child_process');
            const command = `cd "${yamlDir}" && ${catboyPath} ypp -f "${yamlFileName}"`;

            await new Promise<void>((resolve, reject) => {
                exec(command, (error: any, stdout: string, stderr: string) => {
                    if (error) {
                        this.outputChannel.appendLine(`YPP command failed: ${error.message}`);
                        if (stderr) {
                            this.outputChannel.appendLine(`stderr: ${stderr}`);
                        }
                        resolve(); // Don't reject, just continue with fallback parsing
                        return;
                    }
                    
                    if (stdout) {
                        this.outputChannel.appendLine(`YPP output: ${stdout}`);
                    }
                    resolve();
                });
            });
        } catch (error) {
            this.outputChannel.appendLine(`Error processing YPP for ${yamlPath}: ${error instanceof Error ? error.message : String(error)}`);
        }
    }

    async discoverProjects(): Promise<CatboyProject[]> {
        // Clear all existing projects and errors for a fresh scan
        this.projects.clear();
        this.parseErrors = [];
        
        if (!vscode.workspace.workspaceFolders) {
            this.outputChannel.appendLine('No workspace folders found');
            return [];
        }

        this.outputChannel.appendLine(`Scanning for Catboy projects in ${vscode.workspace.workspaceFolders.length} workspace folder(s)...`);

        for (const folder of vscode.workspace.workspaceFolders) {
            await this.scanFolder(folder.uri.fsPath);
        }

        if (this.parseErrors.length > 0) {
            this.reportErrors();
        }

        const projectCount = this.projects.size;
        const targetCount = Array.from(this.projects.values()).reduce((sum, p) => sum + p.targets.length, 0);
        this.outputChannel.appendLine(`Found ${projectCount} project(s) with ${targetCount} target(s)`);

        // Sort projects alphabetically and sort build files and targets within each project
        const sortedProjects = Array.from(this.projects.values())
            .sort((a, b) => a.name.localeCompare(b.name));
        
        // Sort build files and targets within each project
        sortedProjects.forEach(project => {
            // Sort build files by path
            project.buildFiles.sort((a, b) => a.yamlPath.localeCompare(b.yamlPath));
            
            // Sort targets within each build file
            project.buildFiles.forEach(buildFile => {
                buildFile.targets.sort((a, b) => a.name.localeCompare(b.name));
            });
            
            // Sort overall project targets for compatibility
            project.targets.sort((a, b) => a.name.localeCompare(b.name));
        });

        return sortedProjects;
    }

    private async scanFolder(folderPath: string): Promise<void> {
        const pattern = new vscode.RelativePattern(folderPath, '**/build.yaml');
        const files = await vscode.workspace.findFiles(pattern, '**/node_modules/**');

        this.outputChannel.appendLine(`  Scanning ${path.basename(folderPath)}: found ${files.length} build.yaml file(s)`);

        // First, process YPP for all build.yaml files
        for (const file of files) {
            await this.processYppForFile(file.fsPath);
        }

        // Then parse using the flattened data or fallback to direct parsing
        for (const file of files) {
            await this.parseBuildYaml(file.fsPath);
        }
    }

    private async parseBuildYaml(yamlPath: string): Promise<void> {
        const relativePath = vscode.workspace.asRelativePath(yamlPath);
        
        try {
            if (!fs.existsSync(yamlPath)) {
                this.parseErrors.push({
                    file: relativePath,
                    message: 'File does not exist'
                });
                return;
            }

            // First, try to use YPP flattened.json if it exists
            const yamlDir = path.dirname(yamlPath);
            const flattenedJsonPath = path.join(yamlDir, 'build', 'flattened.json');
            const flattenedYamlPath = path.join(yamlDir, 'build', 'flattened.yaml');

            if (fs.existsSync(flattenedJsonPath) && fs.existsSync(flattenedYamlPath)) {
                await this.parseUsingYppData(yamlPath, flattenedJsonPath, flattenedYamlPath);
            } else {
                await this.parseDirectly(yamlPath);
            }
            
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : String(error);
            this.parseErrors.push({
                file: relativePath,
                message: `Parse error: ${errorMessage}`
            });
        }
    }

    private async parseUsingYppData(yamlPath: string, flattenedJsonPath: string, flattenedYamlPath: string): Promise<void> {
        const relativePath = vscode.workspace.asRelativePath(yamlPath);
        
        try {
            // Read and parse the flattened JSON metadata
            const jsonContent = fs.readFileSync(flattenedJsonPath, 'utf8');
            const yppData: YppMetadata = JSON.parse(jsonContent);

            // Read and parse the flattened YAML to get the project name
            const yamlContent = fs.readFileSync(flattenedYamlPath, 'utf8');
            const parsed = parseSimpleYaml(yamlContent);

            if (!parsed || typeof parsed !== 'object') {
                this.parseErrors.push({
                    file: relativePath,
                    message: 'Invalid flattened YAML structure - expected an object'
                });
                return;
            }

            const projectName = parsed.name;
            if (!projectName || typeof projectName !== 'string') {
                this.parseErrors.push({
                    file: relativePath,
                    message: 'Missing or invalid "name" property in flattened YAML'
                });
                return;
            }

            if (!this.projects.has(projectName)) {
                this.projects.set(projectName, {
                    name: projectName,
                    buildFiles: [],
                    targets: []
                });
            }

            const project = this.projects.get(projectName)!;
            
            // Create or get build file entry for this YAML path
            let buildFile = project.buildFiles.find(bf => bf.yamlPath === yamlPath);
            if (!buildFile) {
                buildFile = {
                    yamlPath: yamlPath,
                    projectName: projectName,
                    targets: []
                };
                project.buildFiles.push(buildFile);
            }

            // Process targets from the flattened.json metadata
            for (const yppTarget of yppData.targets) {
                // Check if this project+target combination already exists
                const existingTarget = project.targets.find(t => t.name === yppTarget.name);
                
                if (existingTarget) {
                    // Skip duplicate target
                    continue;
                }
                
                // Create target with YPP metadata
                const target: CatboyTarget = {
                    name: yppTarget.name,
                    projectName: projectName,
                    yamlPath: yamlPath,
                    targetType: yppTarget.type,
                    originalFilePath: yppTarget.file_path,
                    originalLineNumber: yppTarget.line_number
                };
                
                // Add to both project targets (for compatibility) and build file targets
                project.targets.push(target);
                buildFile.targets.push(target);
            }

            this.outputChannel.appendLine(`    ✓ ${relativePath}: project "${projectName}" with ${yppData.targets.length} target(s) (using YPP)`);
            
        } catch (error) {
            this.outputChannel.appendLine(`Failed to parse YPP data for ${relativePath}, falling back to direct parsing: ${error}`);
            await this.parseDirectly(yamlPath);
        }
    }

    private async parseDirectly(yamlPath: string): Promise<void> {
        const relativePath = vscode.workspace.asRelativePath(yamlPath);
        
        const content = fs.readFileSync(yamlPath, 'utf8');
        
        if (!content.trim()) {
            this.parseErrors.push({
                file: relativePath,
                message: 'File is empty'
            });
            return;
        }

        const parsed = parseSimpleYaml(content);

        if (!parsed || typeof parsed !== 'object') {
            this.parseErrors.push({
                file: relativePath,
                message: 'Invalid YAML structure - expected an object'
            });
            return;
        }

        const projectName = parsed.name;
        if (!projectName || typeof projectName !== 'string') {
            this.parseErrors.push({
                file: relativePath,
                message: 'Missing or invalid "name" property - must be a string'
            });
            return;
        }

        if (!this.projects.has(projectName)) {
            this.projects.set(projectName, {
                name: projectName,
                buildFiles: [],
                targets: []
            });
        }

        const project = this.projects.get(projectName)!;
        
        // Create or get build file entry for this YAML path
        let buildFile = project.buildFiles.find(bf => bf.yamlPath === yamlPath);
        if (!buildFile) {
            buildFile = {
                yamlPath: yamlPath,
                projectName: projectName,
                targets: []
            };
            project.buildFiles.push(buildFile);
        }

        if (parsed.targets && typeof parsed.targets === 'object') {
            for (const targetName of Object.keys(parsed.targets)) {
                // Check if this project+target combination already exists
                const existingTarget = project.targets.find(t => t.name === targetName);
                
                if (existingTarget) {
                    // Only report error if it's from a different YAML file
                    if (existingTarget.yamlPath !== yamlPath) {
                        this.parseErrors.push({
                            file: relativePath,
                            message: `Duplicate target "${targetName}" in project "${projectName}" (also defined in ${vscode.workspace.asRelativePath(existingTarget.yamlPath)})`
                        });
                    }
                    // Skip adding duplicate (whether from same or different file)
                    continue;
                }

                // Extract target type from targets/<targetName>/build/type
                let targetType: string | undefined;
                const targetConfig = parsed.targets[targetName];
                if (targetConfig && typeof targetConfig === 'object') {
                    const buildConfig = targetConfig.build;
                    if (buildConfig && typeof buildConfig === 'object') {
                        targetType = buildConfig.type;
                    }
                }
                
                // Create target
                const target: CatboyTarget = {
                    name: targetName,
                    projectName: projectName,
                    yamlPath: yamlPath,
                    targetType: targetType
                };
                
                // Add to both project targets (for compatibility) and build file targets
                project.targets.push(target);
                buildFile.targets.push(target);
            }

            if (Object.keys(parsed.targets).length === 0) {
                this.parseErrors.push({
                    file: relativePath,
                    message: 'No targets defined in "targets" section'
                });
            }
        } else {
            this.parseErrors.push({
                file: relativePath,
                message: 'Missing or invalid "targets" section'
            });
        }

        this.outputChannel.appendLine(`    ✓ ${relativePath}: project "${projectName}" with ${parsed.targets ? Object.keys(parsed.targets).length : 0} target(s) (direct)`);
    }

    private reportErrors(): void {
        const errorCount = this.parseErrors.length;
        this.outputChannel.appendLine(`\n⚠️  Found ${errorCount} issue(s) while parsing build.yaml files:`);
        
        for (const error of this.parseErrors) {
            this.outputChannel.appendLine(`  • ${error.file}: ${error.message}`);
        }

        this.outputChannel.appendLine('');
        
        vscode.window.showWarningMessage(
            `Found ${errorCount} issue(s) in build.yaml files. Check the Output panel for details.`,
            'Show Output'
        ).then(selection => {
            if (selection === 'Show Output') {
                this.outputChannel.show();
            }
        });
    }

    getProjects(): CatboyProject[] {
        return Array.from(this.projects.values());
    }

    getParseErrors(): ParseError[] {
        return [...this.parseErrors];
    }

    showOutput(): void {
        this.outputChannel.show();
    }

    async refresh(): Promise<CatboyProject[]> {
        return this.discoverProjects();
    }

    dispose(): void {
        this.outputChannel.dispose();
        if (this.fileWatcher) {
            this.fileWatcher.dispose();
        }
    }
}