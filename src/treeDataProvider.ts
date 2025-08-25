import * as vscode from 'vscode';
import * as path from 'path';
import { CatboyProject, CatboyTarget, ProjectDiscovery } from './projectDiscovery';

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
                element.project.targets.map(target => new TargetItem(target))
            );
        }
        return Promise.resolve([]);
    }

    getParent(element: CatboyItem): vscode.ProviderResult<CatboyItem> {
        if (element instanceof TargetItem) {
            const project = this.projects.find(p => p.name === element.target.projectName);
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