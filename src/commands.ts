import * as vscode from 'vscode';
import * as path from 'path';
import { CatboyTreeDataProvider, TargetItem, BuildFileItem, getIconForTargetType } from './treeDataProvider';
import { ProjectDiscovery, CatboyTarget, CatboyProject, CatboyBuildFile } from './projectDiscovery';
import { CatboyStatusBar } from './statusBar';
import { TerminalManager } from './terminalManager';

function getIconNameForTargetType(targetType?: string): string {
    if (!targetType) {
        return 'symbol-method';
    }
    
    switch (targetType.toLowerCase()) {
        case 'exe':
        case 'executable':
            return 'gear'; // Gear icon for executables
        case 'dll':
        case 'shared_library':
            return 'library'; // Library/book icon for shared libraries
        case 'sll':
        case 'static_library':
        case 'static_linked_library':
            return 'archive'; // Archive/box icon for static libraries
        case 'obj':
        case 'object_files':
            return 'file-binary'; // Binary file icon for object files
        case 'luna':
        case 'luna_bsp':
            return 'star-full'; // Star icon for Luna BSP
        default:
            return 'symbol-method'; // Default icon for unknown types
    }
}

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
                treeDataProvider.setCurrentTarget(item.target);
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
                treeDataProvider.setCurrentTarget(item.target);
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
                treeDataProvider.setCurrentTarget(item.target);
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
                    const iconName = getIconNameForTargetType(target.targetType);
                    const typeInfo = target.targetType ? ` (${target.targetType})` : '';
                    items.push({
                        label: `$(${iconName}) ${target.name}`,
                        description: `${project.name}${typeInfo}`,
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
                // Extract target name by removing icon prefix (e.g., "$(symbol-method) target-name" -> "target-name")
                const targetName = selected.label.replace(/^\$\([^)]+\) /, '');
                // Extract project name by removing type info (e.g., "project-name (executable)" -> "project-name")
                const projectName = selected.description!.replace(/ \([^)]+\)$/, '');
                
                for (const project of projects) {
                    if (project.name === projectName) {
                        const target = project.targets.find(t => t.name === targetName);
                        if (target) {
                            statusBar.setCurrentTarget(target);
                            treeDataProvider.setCurrentTarget(target);
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
    
    // Function to update the context for conditional menu visibility
    function updateToggleContext() {
        const isShowing = treeDataProvider.isShowingYamlFiles();
        vscode.commands.executeCommand('setContext', 'catboy.showYamlFiles', isShowing);
    }
    
    // Register the toggle YAML files commands (both ON and OFF states)
    context.subscriptions.push(
        vscode.commands.registerCommand('catboy.toggleYamlFiles', () => {
            treeDataProvider.toggleYamlFiles();
            updateToggleContext();
        })
    );
    
    context.subscriptions.push(
        vscode.commands.registerCommand('catboy.toggleYamlFilesOn', () => {
            treeDataProvider.toggleYamlFiles();
            updateToggleContext();
        })
    );
    
    context.subscriptions.push(
        vscode.commands.registerCommand('catboy.toggleYamlFilesOff', () => {
            treeDataProvider.toggleYamlFiles();
            updateToggleContext();
        })
    );
    
    // Initialize the context state
    updateToggleContext();
    
    // Listen for configuration changes to update context
    vscode.workspace.onDidChangeConfiguration(e => {
        if (e.affectsConfiguration('catboy.showYamlFiles')) {
            updateToggleContext();
        }
    });

    // Register go-to-file command
    context.subscriptions.push(
        vscode.commands.registerCommand('catboy.goToFile', async (item: TargetItem | BuildFileItem) => {
            if (item instanceof BuildFileItem) {
                // Open the YAML file directly
                const document = await vscode.workspace.openTextDocument(item.buildFile.yamlPath);
                await vscode.window.showTextDocument(document);
            } else if (item instanceof TargetItem) {
                // Open the YAML file and highlight the target definition line
                const document = await vscode.workspace.openTextDocument(item.target.yamlPath);
                const editor = await vscode.window.showTextDocument(document);
                
                // Find the target definition line
                const targetName = item.target.name;
                const text = document.getText();
                const lines = text.split('\n');
                
                // Look for the specific target definition line (e.g., "  target-name:" under targets section)
                let targetLineIndex = -1;
                let inTargetsSection = false;
                
                for (let i = 0; i < lines.length; i++) {
                    const line = lines[i];
                    const trimmedLine = line.trim();
                    
                    // Check if we're entering the targets section
                    if (trimmedLine === 'targets:') {
                        inTargetsSection = true;
                        continue;
                    }
                    
                    // If we're in targets section and find our specific target
                    if (inTargetsSection && trimmedLine === `${targetName}:`) {
                        targetLineIndex = i;
                        break;
                    }
                    
                    // If we hit another top-level section (no indentation), exit targets
                    if (inTargetsSection && trimmedLine && !line.startsWith(' ') && !line.startsWith('\t') && trimmedLine.includes(':') && trimmedLine !== 'targets:') {
                        inTargetsSection = false;
                    }
                }
                
                // Highlight the target line if found
                if (targetLineIndex >= 0) {
                    const position = new vscode.Position(targetLineIndex, 0);
                    const range = new vscode.Range(position, position.with(undefined, lines[targetLineIndex].length));
                    editor.selection = new vscode.Selection(range.start, range.end);
                    editor.revealRange(range, vscode.TextEditorRevealType.InCenter);
                }
            }
        })
    );

    // Register set current target command for double-click functionality
    context.subscriptions.push(
        vscode.commands.registerCommand('catboy.setCurrentTarget', (item: TargetItem) => {
            if (item instanceof TargetItem && item.target) {
                statusBar.setCurrentTarget(item.target);
                treeDataProvider.setCurrentTarget(item.target);
                vscode.window.showInformationMessage(`Set current target: ${item.target.projectName}/${item.target.name}`);
            }
        })
    );

    // Register status bar build commands
    context.subscriptions.push(
        vscode.commands.registerCommand('catboy.buildCurrent', () => {
            const currentTarget = treeDataProvider.getCurrentTarget();
            if (currentTarget) {
                executeCatboyCommand('build', currentTarget, statusBar, terminalManager);
            } else {
                vscode.window.showWarningMessage('No target selected. Please select a target first.');
            }
        })
    );

    context.subscriptions.push(
        vscode.commands.registerCommand('catboy.cleanCurrent', () => {
            const currentTarget = treeDataProvider.getCurrentTarget();
            if (currentTarget) {
                executeCatboyCommand('clean', currentTarget, statusBar, terminalManager);
            } else {
                vscode.window.showWarningMessage('No target selected. Please select a target first.');
            }
        })
    );

    context.subscriptions.push(
        vscode.commands.registerCommand('catboy.rebuildCurrent', () => {
            const currentTarget = treeDataProvider.getCurrentTarget();
            if (currentTarget) {
                executeCatboyCommand('rebuild', currentTarget, statusBar, terminalManager);
            } else {
                vscode.window.showWarningMessage('No target selected. Please select a target first.');
            }
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