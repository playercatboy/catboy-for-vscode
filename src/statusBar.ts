import * as vscode from 'vscode';
import { CatboyTarget } from './projectDiscovery';

export class CatboyStatusBar {
    private statusBarItem: vscode.StatusBarItem;
    private currentTarget: CatboyTarget | undefined;
    private buildInProgress: boolean = false;

    constructor() {
        this.statusBarItem = vscode.window.createStatusBarItem(
            vscode.StatusBarAlignment.Left,
            100
        );
        this.statusBarItem.command = 'catboy.selectTarget';
        this.update();
    }

    setCurrentTarget(target: CatboyTarget | undefined): void {
        this.currentTarget = target;
        this.update();
    }

    setBuildStatus(inProgress: boolean, command?: string): void {
        this.buildInProgress = inProgress;
        if (inProgress && command) {
            this.statusBarItem.text = `$(sync~spin) Catboy: ${command}ing ${this.currentTarget?.name || ''}`;
            this.statusBarItem.tooltip = `Running ${command} on ${this.currentTarget?.name}`;
        } else {
            this.update();
        }
    }

    private update(): void {
        if (this.currentTarget) {
            const icon = this.buildInProgress ? '$(sync~spin)' : '$(tools)';
            this.statusBarItem.text = `${icon} Catboy: ${this.currentTarget.projectName}/${this.currentTarget.name}`;
            this.statusBarItem.tooltip = `Current target: ${this.currentTarget.name}\nProject: ${this.currentTarget.projectName}\nClick to select a different target`;
            this.statusBarItem.show();
        } else {
            this.statusBarItem.text = '$(tools) Catboy: No target selected';
            this.statusBarItem.tooltip = 'Click to select a Catboy target';
            this.statusBarItem.show();
        }
    }

    dispose(): void {
        this.statusBarItem.dispose();
    }
}