import * as vscode from 'vscode';
import { CatboyTreeDataProvider } from './treeDataProvider';
import { registerCommands } from './commands';
import { ProjectDiscovery } from './projectDiscovery';
import { CatboyStatusBar } from './statusBar';
import { TerminalManager } from './terminalManager';
import { LanguageManager, localize } from './languageManager';
import { IncludeProvider } from './includeProvider';

export function activate(context: vscode.ExtensionContext) {
    try {
        console.log('Catboy extension is activating...');
        
        // Initialize language manager
        LanguageManager.getInstance(context.extensionPath);
        
        const projectDiscovery = new ProjectDiscovery();
        const treeDataProvider = new CatboyTreeDataProvider(projectDiscovery);
        const statusBar = new CatboyStatusBar();
        const terminalManager = new TerminalManager();
        const includeProvider = new IncludeProvider();
        
        // Set up the refresh callback for the project discovery file watcher
        projectDiscovery.setRefreshCallback(() => treeDataProvider.refresh());
        
        console.log('Creating tree view...');
        const treeView = vscode.window.createTreeView('catboyProjects', {
            treeDataProvider: treeDataProvider,
            showCollapseAll: true
        });

        context.subscriptions.push(treeView);
        
        // Register include provider for YAML files
        console.log('Registering include providers...');
        const yamlSelector: vscode.DocumentSelector = { scheme: 'file', language: 'yaml' };
        context.subscriptions.push(
            vscode.languages.registerCodeLensProvider(yamlSelector, includeProvider),
            vscode.languages.registerHoverProvider(yamlSelector, includeProvider),
            vscode.languages.registerDefinitionProvider(yamlSelector, includeProvider)
        );
        
        // Register command for opening include files when multiple matches
        context.subscriptions.push(
            vscode.commands.registerCommand('catboy.openIncludeFile', async (filePaths: string[]) => {
                if (filePaths.length === 1) {
                    await vscode.commands.executeCommand('vscode.open', vscode.Uri.file(filePaths[0]));
                } else {
                    const items = filePaths.map(filePath => ({
                        label: vscode.workspace.asRelativePath(filePath),
                        description: filePath,
                        filePath: filePath
                    }));
                    
                    const selected = await vscode.window.showQuickPick(items, {
                        placeHolder: localize('catboy.include.quickPick.selectFile', 'Select file to open')
                    });
                    
                    if (selected) {
                        await vscode.commands.executeCommand('vscode.open', vscode.Uri.file(selected.filePath));
                    }
                }
            })
        );
        
        context.subscriptions.push({
            dispose: () => {
                projectDiscovery.dispose();
                statusBar.dispose();
                terminalManager.dispose();
                includeProvider.dispose();
            }
        });

        console.log('Registering commands...');
        registerCommands(context, treeDataProvider, projectDiscovery, statusBar, terminalManager);

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