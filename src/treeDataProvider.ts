import * as vscode from 'vscode';
import * as path from 'path';
import { CatboyProject, CatboyTarget, CatboyBuildFile, ProjectDiscovery } from './projectDiscovery';

export class CatboyTreeDataProvider implements vscode.TreeDataProvider<CatboyItem> {
    private _onDidChangeTreeData: vscode.EventEmitter<CatboyItem | undefined | null | void> = new vscode.EventEmitter<CatboyItem | undefined | null | void>();
    readonly onDidChangeTreeData: vscode.Event<CatboyItem | undefined | null | void> = this._onDidChangeTreeData.event;

    private projects: CatboyProject[] = [];

    constructor(private projectDiscovery: ProjectDiscovery) {
        this.refresh();
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
            return Promise.resolve(
                element.project.buildFiles.map(buildFile => new BuildFileItem(buildFile))
            );
        } else if (element instanceof BuildFileItem) {
            return Promise.resolve(
                element.buildFile.targets.map(target => new TargetItem(target))
            );
        }
        return Promise.resolve([]);
    }

    getParent(element: CatboyItem): vscode.ProviderResult<CatboyItem> {
        if (element instanceof TargetItem) {
            const project = this.projects.find(p => p.name === element.target.projectName);
            if (project) {
                const buildFile = project.buildFiles.find(bf => bf.yamlPath === element.target.yamlPath);
                return buildFile ? new BuildFileItem(buildFile) : undefined;
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
        this.tooltip = `Project: ${project.name}`;
        this.contextValue = 'project';
        this.iconPath = new vscode.ThemeIcon('folder');
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

export class TargetItem extends CatboyItem {
    constructor(
        public readonly target: CatboyTarget
    ) {
        super(target.name, vscode.TreeItemCollapsibleState.None);
        this.tooltip = `Target: ${target.name}\nProject: ${target.projectName}\nConfig: ${target.yamlPath}`;
        this.contextValue = 'target';
        this.iconPath = new vscode.ThemeIcon('symbol-method');
    }
}