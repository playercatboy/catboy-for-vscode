import * as vscode from 'vscode';
import * as path from 'path';
import { CatboyTreeDataProvider, TargetItem } from './treeDataProvider';
import { ProjectDiscovery, CatboyTarget } from './projectDiscovery';

export function registerCommands(
    context: vscode.ExtensionContext,
    treeDataProvider: CatboyTreeDataProvider,
    projectDiscovery: ProjectDiscovery
) {
    context.subscriptions.push(
        vscode.commands.registerCommand('catboy.refresh', () => {
            treeDataProvider.refresh();
        })
    );

    context.subscriptions.push(
        vscode.commands.registerCommand('catboy.build', (item: TargetItem) => {
            if (item && item.target) {
                executeCatboyCommand('build', item.target);
            }
        })
    );

    context.subscriptions.push(
        vscode.commands.registerCommand('catboy.clean', (item: TargetItem) => {
            if (item && item.target) {
                executeCatboyCommand('clean', item.target);
            }
        })
    );

    context.subscriptions.push(
        vscode.commands.registerCommand('catboy.rebuild', (item: TargetItem) => {
            if (item && item.target) {
                executeCatboyCommand('rebuild', item.target);
            }
        })
    );
}

function executeCatboyCommand(command: string, target: CatboyTarget) {
    const config = vscode.workspace.getConfiguration('catboy');
    const catboyPath = config.get<string>('executablePath') || 'catboy';
    
    const workspaceFolder = vscode.workspace.getWorkspaceFolder(vscode.Uri.file(target.yamlPath));
    if (!workspaceFolder) {
        vscode.window.showErrorMessage(`Cannot find workspace folder for ${target.yamlPath}`);
        return;
    }

    const terminal = vscode.window.createTerminal({
        name: `Catboy: ${command} ${target.projectName}/${target.name}`,
        cwd: workspaceFolder.uri.fsPath
    });

    const relativeYamlPath = path.relative(workspaceFolder.uri.fsPath, target.yamlPath);
    const commandLine = `${catboyPath} ${command} -v -f "${relativeYamlPath}" ${target.name}`;
    
    terminal.show();
    terminal.sendText(commandLine);
}