import * as vscode from 'vscode';
import { CatboyTreeDataProvider } from './treeDataProvider';
import { registerCommands } from './commands';
import { ProjectDiscovery } from './projectDiscovery';
import { CatboyStatusBar } from './statusBar';
import { TerminalManager } from './terminalManager';
import { LanguageManager } from './languageManager';

export function activate(context: vscode.ExtensionContext) {
    try {
        console.log('Catboy extension is activating...');
        
        // Initialize language manager
        LanguageManager.getInstance(context.extensionPath);
        
        const projectDiscovery = new ProjectDiscovery();
        const treeDataProvider = new CatboyTreeDataProvider(projectDiscovery);
        const statusBar = new CatboyStatusBar();
        const terminalManager = new TerminalManager();
        
        console.log('Creating tree view...');
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

        console.log('Registering commands...');
        registerCommands(context, treeDataProvider, projectDiscovery, statusBar, terminalManager);

        console.log('Setting up file watcher...');
        const fileWatcher = vscode.workspace.createFileSystemWatcher('**/build.yaml', false, false, false);
        fileWatcher.onDidCreate(() => treeDataProvider.refresh());
        fileWatcher.onDidChange(() => treeDataProvider.refresh());
        fileWatcher.onDidDelete(() => treeDataProvider.refresh());
        context.subscriptions.push(fileWatcher);

        const workspaceFolderDisposable = vscode.workspace.onDidChangeWorkspaceFolders(() => {
            treeDataProvider.refresh();
        });
        context.subscriptions.push(workspaceFolderDisposable);

        console.log('Refreshing tree data...');
        treeDataProvider.refresh();
        
        console.log('Catboy extension activated successfully!');
    } catch (error) {
        console.error('Failed to activate Catboy extension:', error);
        vscode.window.showErrorMessage(`Failed to activate Catboy extension: ${error}`);
        throw error;
    }
}

export function deactivate() {
    console.log('Catboy extension is now deactivated');
}