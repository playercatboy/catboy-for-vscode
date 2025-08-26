import * as vscode from 'vscode';
import { CatboyTarget } from './projectDiscovery';
import { localize, LanguageManager } from './languageManager';

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
        this.buildButton.text = `$(tools) ${localize('catboy.statusBar.buildButton.text', 'Build')}`;
        this.buildButton.tooltip = localize('catboy.statusBar.buildButton.tooltip', 'Build current target');
        this.buildButton.command = 'catboy.buildCurrent';
        
        this.cleanButton = vscode.window.createStatusBarItem(
            vscode.StatusBarAlignment.Left,
            98
        );
        this.cleanButton.text = `$(trash) ${localize('catboy.statusBar.cleanButton.text', 'Clean')}`;
        this.cleanButton.tooltip = localize('catboy.statusBar.cleanButton.tooltip', 'Clean current target');
        this.cleanButton.command = 'catboy.cleanCurrent';
        
        this.rebuildButton = vscode.window.createStatusBarItem(
            vscode.StatusBarAlignment.Left,
            97
        );
        this.rebuildButton.text = `$(sync) ${localize('catboy.statusBar.rebuildButton.text', 'Rebuild')}`;
        this.rebuildButton.tooltip = localize('catboy.statusBar.rebuildButton.tooltip', 'Rebuild current target');
        this.rebuildButton.command = 'catboy.rebuildCurrent';
        
        this.update();
        
        // Register for language change notifications
        LanguageManager.getInstance().registerRefreshCallback(() => {
            this.refreshButtonLabels();
        });
    }

    setCurrentTarget(target: CatboyTarget | undefined): void {
        this.currentTarget = target;
        this.update();
    }

    setBuildStatus(inProgress: boolean, command?: string): void {
        this.buildInProgress = inProgress;
        if (inProgress && command) {
            const action = command.toLowerCase() === 'build' ? localize('catboy.command.build.title', 'Build') : 
                          command.toLowerCase() === 'clean' ? localize('catboy.command.clean.title', 'Clean') : 
                          localize('catboy.command.rebuild.title', 'Rebuild');
            this.statusBarItem.text = `$(sync~spin) ${localize('catboy.statusBar.building', 'Catboy: {0} {1}', action, this.currentTarget?.name || '')}`;
            this.statusBarItem.tooltip = localize('catboy.statusBar.tooltip.building', 'Running {0} on {1}', action, this.currentTarget?.name || '');
        } else {
            this.update();
        }
    }

    private update(): void {
        if (this.currentTarget) {
            const icon = this.buildInProgress ? '$(sync~spin)' : '$(tools)';
            this.statusBarItem.text = `${icon} ${localize('catboy.statusBar.currentTarget', 'Catboy: {0}/{1}', this.currentTarget.projectName, this.currentTarget.name)}`;
            this.statusBarItem.tooltip = localize('catboy.statusBar.tooltip.currentTarget', 'Current target: {0}\nProject: {1}\nClick to select a different target', this.currentTarget.name, this.currentTarget.projectName);
            this.statusBarItem.show();
            
            // Show build action buttons when a target is selected
            this.buildButton.show();
            this.cleanButton.show();
            this.rebuildButton.show();
        } else {
            this.statusBarItem.text = `$(tools) ${localize('catboy.statusBar.noTarget', 'Catboy: No target selected')}`;
            this.statusBarItem.tooltip = localize('catboy.statusBar.tooltip.noTarget', 'Click to select a Catboy target');
            this.statusBarItem.show();
            
            // Hide build action buttons when no target is selected
            this.buildButton.hide();
            this.cleanButton.hide();
            this.rebuildButton.hide();
        }
    }

    private refreshButtonLabels(): void {
        // Update button labels with new language
        this.buildButton.text = `$(tools) ${localize('catboy.statusBar.buildButton.text', 'Build')}`;
        this.buildButton.tooltip = localize('catboy.statusBar.buildButton.tooltip', 'Build current target');
        
        this.cleanButton.text = `$(trash) ${localize('catboy.statusBar.cleanButton.text', 'Clean')}`;
        this.cleanButton.tooltip = localize('catboy.statusBar.cleanButton.tooltip', 'Clean current target');
        
        this.rebuildButton.text = `$(sync) ${localize('catboy.statusBar.rebuildButton.text', 'Rebuild')}`;
        this.rebuildButton.tooltip = localize('catboy.statusBar.rebuildButton.tooltip', 'Rebuild current target');
        
        // Also refresh the main status bar text and tooltip
        this.update();
    }

    dispose(): void {
        this.statusBarItem.dispose();
        this.buildButton.dispose();
        this.cleanButton.dispose();
        this.rebuildButton.dispose();
    }
}