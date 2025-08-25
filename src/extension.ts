import * as vscode from 'vscode';
import { CatboyTreeDataProvider } from './treeDataProvider';
import { registerCommands } from './commands';
import { ProjectDiscovery } from './projectDiscovery';
import { CatboyStatusBar } from './statusBar';
import { TerminalManager } from './terminalManager';

export function activate(context: vscode.ExtensionContext) {
    console.log('Catboy extension is now active');

    const projectDiscovery = new ProjectDiscovery();
    const treeDataProvider = new CatboyTreeDataProvider(projectDiscovery);
    const statusBar = new CatboyStatusBar();
    const terminalManager = new TerminalManager();
    
    const treeView = vscode.window.createTreeView('catboyProjects', {
        treeDataProvider: treeDataProvider,
        showCollapseAll: true
    });

    context.subscriptions.push(treeView);
    context.subscriptions.push({
        dispose: () => {
            projectDiscovery.dispose();
            statusBar.dispose();
            terminalManager.dispose();
        }
    });

    registerCommands(context, treeDataProvider, projectDiscovery, statusBar, terminalManager);

    const fileWatcher = vscode.workspace.createFileSystemWatcher('**/build.yaml', false, false, false);
    fileWatcher.onDidCreate(() => treeDataProvider.refresh());
    fileWatcher.onDidChange(() => treeDataProvider.refresh());
    fileWatcher.onDidDelete(() => treeDataProvider.refresh());
    context.subscriptions.push(fileWatcher);

    const workspaceFolderDisposable = vscode.workspace.onDidChangeWorkspaceFolders(() => {
        treeDataProvider.refresh();
    });
    context.subscriptions.push(workspaceFolderDisposable);

    treeDataProvider.refresh();
}

export function deactivate() {
    console.log('Catboy extension is now deactivated');
}