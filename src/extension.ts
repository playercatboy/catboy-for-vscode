import * as vscode from 'vscode';
import { CatboyTreeDataProvider } from './treeDataProvider';
import { registerCommands } from './commands';
import { ProjectDiscovery } from './projectDiscovery';

export function activate(context: vscode.ExtensionContext) {
    console.log('Catboy extension is now active');

    const projectDiscovery = new ProjectDiscovery();
    const treeDataProvider = new CatboyTreeDataProvider(projectDiscovery);
    
    const treeView = vscode.window.createTreeView('catboyProjects', {
        treeDataProvider: treeDataProvider,
        showCollapseAll: true
    });

    context.subscriptions.push(treeView);

    registerCommands(context, treeDataProvider, projectDiscovery);

    const fileWatcher = vscode.workspace.createFileSystemWatcher('**/build.yaml');
    fileWatcher.onDidCreate(() => treeDataProvider.refresh());
    fileWatcher.onDidChange(() => treeDataProvider.refresh());
    fileWatcher.onDidDelete(() => treeDataProvider.refresh());
    context.subscriptions.push(fileWatcher);

    vscode.workspace.onDidChangeWorkspaceFolders(() => {
        treeDataProvider.refresh();
    });
}

export function deactivate() {
    console.log('Catboy extension is now deactivated');
}