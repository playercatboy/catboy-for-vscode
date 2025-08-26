import * as vscode from 'vscode';
import { CatboyTarget } from './projectDiscovery';

export class CatboyStatusBar {
    private statusBarItem: vscode.StatusBarItem;
    private buildButton: vscode.StatusBarItem;
    private cleanButton: vscode.StatusBarItem;
    private rebuildButton: vscode.StatusBarItem;
    private currentTarget: CatboyTarget | undefined;
    private buildInProgress: boolean = false;

    constructor() {
        this.statusBarItem = vscode.window.createStatusBarItem(
            vscode.StatusBarAlignment.Left,
            100
        );
        this.statusBarItem.command = 'catboy.selectTarget';
        
        // Create build action buttons
        this.buildButton = vscode.window.createStatusBarItem(
            vscode.StatusBarAlignment.Left,
            99
        );
        this.buildButton.text = '$(tools) Build';
        this.buildButton.tooltip = 'Build current target';
        this.buildButton.command = 'catboy.buildCurrent';
        
        this.cleanButton = vscode.window.createStatusBarItem(
            vscode.StatusBarAlignment.Left,
            98
        );
        this.cleanButton.text = '$(trash) Clean';
        this.cleanButton.tooltip = 'Clean current target';
        this.cleanButton.command = 'catboy.cleanCurrent';
        
        this.rebuildButton = vscode.window.createStatusBarItem(
            vscode.StatusBarAlignment.Left,
            97
        );
        this.rebuildButton.text = '$(sync) Rebuild';
        this.rebuildButton.tooltip = 'Rebuild current target';
        this.rebuildButton.command = 'catboy.rebuildCurrent';
        
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
            
            // Show build action buttons when a target is selected
            this.buildButton.show();
            this.cleanButton.show();
            this.rebuildButton.show();
        } else {
            this.statusBarItem.text = '$(tools) Catboy: No target selected';
            this.statusBarItem.tooltip = 'Click to select a Catboy target';
            this.statusBarItem.show();
            
            // Hide build action buttons when no target is selected
            this.buildButton.hide();
            this.cleanButton.hide();
            this.rebuildButton.hide();
        }
    }

    dispose(): void {
        this.statusBarItem.dispose();
        this.buildButton.dispose();
        this.cleanButton.dispose();
        this.rebuildButton.dispose();
    }
}