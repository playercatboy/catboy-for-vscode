import * as vscode from 'vscode';
import * as path from 'path';
import { CatboyProject, CatboyTarget, CatboyBuildFile, ProjectDiscovery } from './projectDiscovery';

export class CatboyTreeDataProvider implements vscode.TreeDataProvider<CatboyItem> {
    private _onDidChangeTreeData: vscode.EventEmitter<CatboyItem | undefined | null | void> = new vscode.EventEmitter<CatboyItem | undefined | null | void>();
    readonly onDidChangeTreeData: vscode.Event<CatboyItem | undefined | null | void> = this._onDidChangeTreeData.event;

    private projects: CatboyProject[] = [];
    private showYamlFiles: boolean = false;

    constructor(private projectDiscovery: ProjectDiscovery) {
        this.showYamlFiles = vscode.workspace.getConfiguration('catboy').get('showYamlFiles', false);
        this.refresh();
        
        // Listen for configuration changes
        vscode.workspace.onDidChangeConfiguration(e => {
            if (e.affectsConfiguration('catboy.showYamlFiles')) {
                this.showYamlFiles = vscode.workspace.getConfiguration('catboy').get('showYamlFiles', false);
                this.refresh();
            }
        });
    }

    async refresh(): Promise<void> {
        this.projects = await this.projectDiscovery.refresh();
        this._onDidChangeTreeData.fire();
    }

    getTreeItem(element: CatboyItem): vscode.TreeItem {
        return element;
    }

    getChildren(element?: CatboyItem): Thenable<CatboyItem[]> {
        if (!element) {
            return Promise.resolve(
                this.projects.map(project => new ProjectItem(project))
            );
        } else if (element instanceof ProjectItem) {
            if (this.showYamlFiles) {
                // Show build files level when enabled
                return Promise.resolve(
                    element.project.buildFiles.map(buildFile => new BuildFileItem(buildFile))
                );
            } else {
                // Skip build files level and show targets directly when disabled
                return Promise.resolve(
                    element.project.targets.map(target => new TargetItem(target))
                );
            }
        } else if (element instanceof BuildFileItem) {
            return Promise.resolve(
                element.buildFile.targets.map(target => new TargetItem(target))
            );
        }
        return Promise.resolve([]);
    }
    
    toggleYamlFiles(): void {
        this.showYamlFiles = !this.showYamlFiles;
        const config = vscode.workspace.getConfiguration('catboy');
        config.update('showYamlFiles', this.showYamlFiles, vscode.ConfigurationTarget.Global);
    }
    
    isShowingYamlFiles(): boolean {
        return this.showYamlFiles;
    }

    getParent(element: CatboyItem): vscode.ProviderResult<CatboyItem> {
        if (element instanceof TargetItem) {
            const project = this.projects.find(p => p.name === element.target.projectName);
            if (project) {
                if (this.showYamlFiles) {
                    // When showing YAML files, parent is the build file
                    const buildFile = project.buildFiles.find(bf => bf.yamlPath === element.target.yamlPath);
                    return buildFile ? new BuildFileItem(buildFile) : undefined;
                } else {
                    // When not showing YAML files, parent is the project
                    return new ProjectItem(project);
                }
            }
        } else if (element instanceof BuildFileItem) {
            const project = this.projects.find(p => p.name === element.buildFile.projectName);
            return project ? new ProjectItem(project) : undefined;
        }
        return undefined;
    }
}

export abstract class CatboyItem extends vscode.TreeItem {
    constructor(
        public readonly label: string,
        public readonly collapsibleState: vscode.TreeItemCollapsibleState
    ) {
        super(label, collapsibleState);
    }
}

export class ProjectItem extends CatboyItem {
    constructor(
        public readonly project: CatboyProject
    ) {
        super(project.name, vscode.TreeItemCollapsibleState.Expanded);
        
        // Add target count to description for additional context
        const targetCount = project.targets.length;
        this.description = `${targetCount} target${targetCount !== 1 ? 's' : ''}`;
        
        this.tooltip = `Project: ${project.name}\nTargets: ${targetCount}`;
        this.contextValue = 'project';
        
        // Use a more prominent icon with color for projects
        this.iconPath = new vscode.ThemeIcon('folder-library', new vscode.ThemeColor('charts.blue'));
    }
}

export class BuildFileItem extends CatboyItem {
    constructor(
        public readonly buildFile: CatboyBuildFile
    ) {
        // Get relative path for display
        const relativePath = vscode.workspace.asRelativePath(buildFile.yamlPath);
        // Normalize path to always use forward slashes
        const normalizedPath = relativePath.replace(/\\/g, '/');
        const dir = path.dirname(normalizedPath).replace(/\\/g, '/');
        const filename = path.basename(normalizedPath);
        
        // Create label string - full path with directory and forward slash
        const labelString = dir === '.' ? filename : `${dir}/`;
        
        // Create tree item with label
        super(labelString, vscode.TreeItemCollapsibleState.Expanded);
        
        // Use description to show the filename in a dimmed style
        if (dir !== '.') {
            this.description = filename;
        }
        
        this.tooltip = `Build file: ${normalizedPath}\nProject: ${buildFile.projectName}\nTargets: ${buildFile.targets.length}`;
        this.contextValue = 'buildFile';
        this.iconPath = new vscode.ThemeIcon('file');
        
        // Store the path for command execution
        this.resourceUri = vscode.Uri.file(buildFile.yamlPath);
    }
}

export function getTargetTypeDisplayName(targetType?: string): string {
    if (!targetType) {
        return '';
    }
    
    switch (targetType.toLowerCase()) {
        case 'exe':
        case 'executable':
            return 'Executable';
        case 'dll':
        case 'shared_library':
            return 'Dynamic Link Library';
        case 'sll':
        case 'static_library':
        case 'static_linked_library':
            return 'Static Link Library';
        case 'obj':
        case 'object_files':
            return 'Object Files';
        case 'luna':
        case 'luna_bsp':
            return 'Luna BSP';
        default:
            return targetType; // Return original type if unknown
    }
}

export function getIconForTargetType(targetType?: string): vscode.ThemeIcon {
    if (!targetType) {
        return new vscode.ThemeIcon('symbol-method');
    }
    
    switch (targetType.toLowerCase()) {
        case 'exe':
        case 'executable':
            return new vscode.ThemeIcon('gear'); // Gear icon for executables
        
        case 'dll':
        case 'shared_library':
            return new vscode.ThemeIcon('library'); // Library/book icon for shared libraries
        
        case 'sll':
        case 'static_library':
        case 'static_linked_library':
            return new vscode.ThemeIcon('file-zip'); // Archive icon for static libraries
        
        case 'obj':
        case 'object_files':
            return new vscode.ThemeIcon('file-binary'); // Binary file icon for object files
        
        case 'luna':
        case 'luna_bsp':
            return new vscode.ThemeIcon('star-full'); // Star icon (closest to moon in default icons)
        
        default:
            return new vscode.ThemeIcon('symbol-method'); // Default icon for unknown types
    }
}

export class TargetItem extends CatboyItem {
    constructor(
        public readonly target: CatboyTarget
    ) {
        super(target.name, vscode.TreeItemCollapsibleState.None);
        
        // Add dimmed target type text (similar to build.yaml filename)
        const displayTypeName = getTargetTypeDisplayName(target.targetType);
        if (displayTypeName) {
            this.description = displayTypeName;
        }
        
        // Set tooltip with target type info
        const typeInfo = target.targetType ? `\nType: ${target.targetType}` : '';
        this.tooltip = `Target: ${target.name}\nProject: ${target.projectName}${typeInfo}\nConfig: ${target.yamlPath}`;
        this.contextValue = 'target';
        
        // Select icon based on target type
        this.iconPath = getIconForTargetType(target.targetType);
    }
    
}