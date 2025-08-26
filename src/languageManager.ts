import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

export interface LocalizationMessages {
    [key: string]: string;
}

export class LanguageManager {
    private static instance: LanguageManager;
    private messages: LocalizationMessages = {};
    private currentLocale: string = 'en';
    private extensionPath: string;
    private refreshCallbacks: Array<() => void> = [];

    private constructor(extensionPath: string) {
        this.extensionPath = extensionPath;
        this.loadLanguage();
        
        // Apply language immediately on startup
        this.applyVSCodeLocale();
        
        // Listen for configuration changes
        vscode.workspace.onDidChangeConfiguration(e => {
            if (e.affectsConfiguration('catboy.language')) {
                this.loadLanguage();
                // Refresh UI elements that use runtime localization
                this.refreshUIElements();
                
                // Notify about language change
                vscode.window.showInformationMessage(
                    this.localize('catboy.languageChange.message', 'Language setting changed. Please reload the window to apply changes.'),
                    this.localize('catboy.languageChange.reload', 'Reload Window')
                ).then(selection => {
                    if (selection === this.localize('catboy.languageChange.reload', 'Reload Window')) {
                        vscode.commands.executeCommand('workbench.action.reloadWindow');
                    }
                });
            }
        });
    }

    public static getInstance(extensionPath?: string): LanguageManager {
        if (!LanguageManager.instance) {
            if (!extensionPath) {
                throw new Error('Extension path must be provided when creating LanguageManager instance');
            }
            LanguageManager.instance = new LanguageManager(extensionPath);
        }
        return LanguageManager.instance;
    }

    private loadLanguage(): void {
        const config = vscode.workspace.getConfiguration('catboy');
        const languageSetting = config.get<string>('language', 'auto');

        let locale: string;
        
        if (languageSetting === 'auto') {
            // Use VS Code's locale or fall back to English
            locale = vscode.env.language || 'en';
        } else {
            locale = languageSetting;
        }

        // Normalize locale
        if (locale.startsWith('zh')) {
            locale = 'zh-hans';
        } else {
            locale = 'en';
        }

        this.currentLocale = locale;
        this.loadMessages(locale);
    }

    private loadMessages(locale: string): void {
        const messagesPath = path.join(this.extensionPath, 'i18n', `messages${locale === 'en' ? '' : '.' + locale}.json`);
        
        try {
            if (fs.existsSync(messagesPath)) {
                const content = fs.readFileSync(messagesPath, 'utf8');
                this.messages = JSON.parse(content);
            } else {
                // Fall back to English if locale file doesn't exist
                const fallbackPath = path.join(this.extensionPath, 'i18n', 'messages.json');
                if (fs.existsSync(fallbackPath)) {
                    const content = fs.readFileSync(fallbackPath, 'utf8');
                    this.messages = JSON.parse(content);
                }
            }
        } catch (error) {
            console.error(`Error loading language file for locale '${locale}':`, error);
            // Use empty messages as fallback
            this.messages = {};
        }
    }

    public localize(key: string, defaultValue: string, ...args: string[]): string {
        let message = this.messages[key] || defaultValue;
        
        // Replace placeholders {0}, {1}, etc. with provided arguments
        args.forEach((arg, index) => {
            message = message.replace(new RegExp(`\\{${index}\\}`, 'g'), arg);
        });
        
        // Debug: Log if placeholders remain (in development)
        if (message.includes('{') && message.includes('}')) {
            console.warn(`Localization warning: Unreplaced placeholders in '${key}': ${message}`);
        }
        
        return message;
    }

    public getCurrentLocale(): string {
        return this.currentLocale;
    }

    public getSupportedLanguages(): Array<{value: string, label: string}> {
        return [
            { value: 'auto', label: this.localize('catboy.config.language.auto', 'Auto (follow VS Code language)') },
            { value: 'en', label: this.localize('catboy.config.language.english', 'English') },
            { value: 'zh-hans', label: this.localize('catboy.config.language.chinese', '中文(简体)') }
        ];
    }

    public async changeLanguage(): Promise<void> {
        const languages = this.getSupportedLanguages();
        const currentSetting = vscode.workspace.getConfiguration('catboy').get<string>('language', 'auto');
        
        const items = languages.map(lang => ({
            label: lang.label,
            description: lang.value === currentSetting ? '(current)' : '',
            value: lang.value
        }));

        const selected = await vscode.window.showQuickPick(items, {
            placeHolder: this.localize('catboy.languageSelector.placeholder', 'Select language for Catboy extension')
        });

        if (selected && selected.value !== currentSetting) {
            const config = vscode.workspace.getConfiguration('catboy');
            await config.update('language', selected.value, vscode.ConfigurationTarget.Global);
            
            // Show message and auto-reload since UI buttons require reload anyway
            const message = this.localize('catboy.languageChange.message', 'Language setting changed. Please reload the window to fully apply changes to all UI elements (buttons, tooltips, etc.).');
            const reloadText = this.localize('catboy.languageChange.reload', 'Reload Window');
            
            const choice = await vscode.window.showInformationMessage(message, reloadText);
            if (choice === reloadText) {
                vscode.commands.executeCommand('workbench.action.reloadWindow');
            }
        }
    }

    private refreshUIElements(): void {
        // Notify all registered components to refresh their UI
        this.refreshCallbacks.forEach(callback => {
            try {
                callback();
            } catch (error) {
                console.error('Error refreshing UI element:', error);
            }
        });
    }

    public registerRefreshCallback(callback: () => void): void {
        this.refreshCallbacks.push(callback);
    }

    private applyVSCodeLocale(): void {
        const config = vscode.workspace.getConfiguration('catboy');
        const languageSetting = config.get<string>('language', 'auto');
        
        if (languageSetting !== 'auto') {
            // Check if VS Code's display language matches our setting
            const vscodeLocale = vscode.env.language;
            let expectedVSCodeLocale = languageSetting === 'zh-hans' ? 'zh-cn' : 'en';
            
            console.log(`VS Code detected language: ${vscodeLocale}, Catboy setting: ${languageSetting}`);
            
            if (!vscodeLocale.startsWith(expectedVSCodeLocale.substring(0, 2))) {
                console.log(`Catboy language override: ${languageSetting}, VS Code locale: ${vscodeLocale}. UI buttons will show in VS Code's language until reload.`);
                
                // Only show notification on first activation, not every time
                if (!this.hasShownMismatchNotification()) {
                    this.showLanguageMismatchNotification();
                }
            }
        }
    }
    
    private hasShownMismatchNotification(): boolean {
        // Simple flag to avoid showing notification repeatedly
        return (global as any).__catboyLanguageNotificationShown === true;
    }
    
    private showLanguageMismatchNotification(): void {
        (global as any).__catboyLanguageNotificationShown = true;
        
        const message = this.localize('catboy.languageMismatch.message', 'Your Catboy language setting differs from VS Code\'s display language. Some UI buttons may show in VS Code\'s language until you reload the window.');
        const reloadText = this.localize('catboy.languageChange.reload', 'Reload Window');
        const configureText = this.localize('catboy.languageMismatch.configure', 'Configure VS Code Language');
        
        vscode.window.showInformationMessage(message, reloadText, configureText).then(choice => {
            if (choice === reloadText) {
                vscode.commands.executeCommand('workbench.action.reloadWindow');
            } else if (choice === configureText) {
                vscode.commands.executeCommand('workbench.action.configureLocale');
            }
        });
    }
}

// Convenience function for localization
export function localize(key: string, defaultValue: string, ...args: string[]): string {
    const manager = LanguageManager.getInstance();
    return manager.localize(key, defaultValue, ...args);
}