import * as vscode from 'vscode';
import * as path from 'path';
import { CatboyTreeDataProvider, TargetItem, BuildFileItem } from './treeDataProvider';
import { ProjectDiscovery, CatboyTarget, CatboyProject, CatboyBuildFile } from './projectDiscovery';
import { CatboyStatusBar } from './statusBar';
import { TerminalManager } from './terminalManager';

export function registerCommands(
    context: vscode.ExtensionContext,
    treeDataProvider: CatboyTreeDataProvider,
    projectDiscovery: ProjectDiscovery,
    statusBar: CatboyStatusBar,
    terminalManager: TerminalManager
) {
    context.subscriptions.push(
        vscode.commands.registerCommand('catboy.refresh', () => {
            treeDataProvider.refresh();
        })
    );

    context.subscriptions.push(
        vscode.commands.registerCommand('catboy.build', (item: TargetItem | BuildFileItem) => {
            if (item instanceof TargetItem && item.target) {
                statusBar.setCurrentTarget(item.target);
                executeCatboyCommand('build', item.target, statusBar, terminalManager);
            } else if (item instanceof BuildFileItem && item.buildFile) {
                executeCatboyCommandForBuildFile('build', item.buildFile, statusBar, terminalManager);
            }
        })
    );

    context.subscriptions.push(
        vscode.commands.registerCommand('catboy.clean', (item: TargetItem | BuildFileItem) => {
            if (item instanceof TargetItem && item.target) {
                statusBar.setCurrentTarget(item.target);
                executeCatboyCommand('clean', item.target, statusBar, terminalManager);
            } else if (item instanceof BuildFileItem && item.buildFile) {
                executeCatboyCommandForBuildFile('clean', item.buildFile, statusBar, terminalManager);
            }
        })
    );

    context.subscriptions.push(
        vscode.commands.registerCommand('catboy.rebuild', (item: TargetItem | BuildFileItem) => {
            if (item instanceof TargetItem && item.target) {
                statusBar.setCurrentTarget(item.target);
                executeCatboyCommand('rebuild', item.target, statusBar, terminalManager);
            } else if (item instanceof BuildFileItem && item.buildFile) {
                executeCatboyCommandForBuildFile('rebuild', item.buildFile, statusBar, terminalManager);
            }
        })
    );

    context.subscriptions.push(
        vscode.commands.registerCommand('catboy.selectTarget', async () => {
            const projects = await projectDiscovery.discoverProjects();
            const items: vscode.QuickPickItem[] = [];

            for (const project of projects) {
                for (const target of project.targets) {
                    items.push({
                        label: `$(symbol-method) ${target.name}`,
                        description: project.name,
                        detail: vscode.workspace.asRelativePath(target.yamlPath)
                    });
                }
            }

            if (items.length === 0) {
                vscode.window.showInformationMessage('No Catboy targets found in the workspace');
                return;
            }

            const selected = await vscode.window.showQuickPick(items, {
                placeHolder: 'Select a Catboy target',
                title: 'Catboy Target Selection'
            });

            if (selected) {
                const targetName = selected.label.replace('$(symbol-method) ', '');
                const projectName = selected.description!;
                
                for (const project of projects) {
                    if (project.name === projectName) {
                        const target = project.targets.find(t => t.name === targetName);
                        if (target) {
                            statusBar.setCurrentTarget(target);
                            vscode.window.showInformationMessage(`Selected target: ${projectName}/${targetName}`);
                            break;
                        }
                    }
                }
            }
        })
    );

    context.subscriptions.push(
        vscode.commands.registerCommand('catboy.showOutput', () => {
            projectDiscovery.showOutput();
        })
    );
}

function executeCatboyCommandForBuildFile(
    command: string,
    buildFile: CatboyBuildFile,
    statusBar: CatboyStatusBar,
    terminalManager: TerminalManager
) {
    const config = vscode.workspace.getConfiguration('catboy');
    const catboyPath = config.get<string>('executablePath') || 'catboy';
    
    const workspaceFolder = vscode.workspace.getWorkspaceFolder(vscode.Uri.file(buildFile.yamlPath));
    if (!workspaceFolder) {
        vscode.window.showErrorMessage(`Cannot find workspace folder for ${buildFile.yamlPath}`);
        return;
    }

    statusBar.setBuildStatus(true, command);

    const relativeYamlPath = path.relative(workspaceFolder.uri.fsPath, buildFile.yamlPath);
    // No target specified - builds all targets in the file
    const commandLine = `${catboyPath} ${command} -v -f "${relativeYamlPath}"`;
    
    const terminal = terminalManager.getOrCreateTerminal(
        buildFile.projectName,
        'all-targets',
        workspaceFolder.uri.fsPath
    );

    terminal.show();
    terminal.sendText(commandLine);

    setTimeout(() => {
        statusBar.setBuildStatus(false);
    }, 3000);
}

function executeCatboyCommand(
    command: string, 
    target: CatboyTarget,
    statusBar: CatboyStatusBar,
    terminalManager: TerminalManager
) {
    const config = vscode.workspace.getConfiguration('catboy');
    const catboyPath = config.get<string>('executablePath') || 'catboy';
    
    const workspaceFolder = vscode.workspace.getWorkspaceFolder(vscode.Uri.file(target.yamlPath));
    if (!workspaceFolder) {
        vscode.window.showErrorMessage(`Cannot find workspace folder for ${target.yamlPath}`);
        return;
    }

    statusBar.setBuildStatus(true, command);

    const relativeYamlPath = path.relative(workspaceFolder.uri.fsPath, target.yamlPath);
    const commandLine = `${catboyPath} ${command} -v -f "${relativeYamlPath}" ${target.name}`;
    
    const terminal = terminalManager.getOrCreateTerminal(
        target.projectName,
        target.name,
        workspaceFolder.uri.fsPath
    );

    terminal.show();
    terminal.sendText(commandLine);

    setTimeout(() => {
        statusBar.setBuildStatus(false);
    }, 3000);
}