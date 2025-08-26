import * as assert from 'assert';
import * as vscode from 'vscode';

suite('Extension Test Suite', () => {
    vscode.window.showInformationMessage('Start all tests.');

    test('Extension should be present', () => {
        assert.ok(vscode.extensions.getExtension('playercatboy.catboy-for-vscode'));
    });

    test('Should register all commands', async () => {
        const commands = await vscode.commands.getCommands();
        
        assert.ok(commands.includes('catboy.refresh'));
        assert.ok(commands.includes('catboy.build'));
        assert.ok(commands.includes('catboy.clean'));
        assert.ok(commands.includes('catboy.rebuild'));
    });

    test('Should have configuration', () => {
        const config = vscode.workspace.getConfiguration('catboy');
        assert.ok(config.has('executablePath'));
    });
});