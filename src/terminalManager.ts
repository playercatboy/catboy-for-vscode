import * as vscode from 'vscode';

interface TerminalInfo {
    terminal: vscode.Terminal;
    projectName: string;
    targetName: string;
}

export class TerminalManager {
    private terminals: Map<string, TerminalInfo> = new Map();

    constructor() {
        vscode.window.onDidCloseTerminal((terminal) => {
            for (const [key, info] of this.terminals.entries()) {
                if (info.terminal === terminal) {
                    this.terminals.delete(key);
                    break;
                }
            }
        });
    }

    getOrCreateTerminal(projectName: string, targetName: string, cwd: string): vscode.Terminal {
        const key = `${projectName}/${targetName}`;
        const existing = this.terminals.get(key);

        if (existing && existing.terminal.exitStatus === undefined) {
            return existing.terminal;
        }

        const terminal = vscode.window.createTerminal({
            name: `Catboy: ${key}`,
            cwd: cwd,
            iconPath: new vscode.ThemeIcon('tools')
        });

        this.terminals.set(key, {
            terminal: terminal,
            projectName: projectName,
            targetName: targetName
        });

        return terminal;
    }

    closeAllTerminals(): void {
        for (const info of this.terminals.values()) {
            info.terminal.dispose();
        }
        this.terminals.clear();
    }

    getActiveTerminal(): vscode.Terminal | undefined {
        return vscode.window.activeTerminal;
    }

    showTerminal(projectName: string, targetName: string): void {
        const key = `${projectName}/${targetName}`;
        const info = this.terminals.get(key);
        if (info && info.terminal.exitStatus === undefined) {
            info.terminal.show();
        }
    }

    dispose(): void {
        this.closeAllTerminals();
    }
}