import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';
import * as yaml from 'yaml';

export interface CatboyTarget {
    name: string;
    projectName: string;
    yamlPath: string;
}

export interface CatboyProject {
    name: string;
    targets: CatboyTarget[];
}

export class ProjectDiscovery {
    private projects: Map<string, CatboyProject> = new Map();

    async discoverProjects(): Promise<CatboyProject[]> {
        this.projects.clear();
        
        if (!vscode.workspace.workspaceFolders) {
            return [];
        }

        for (const folder of vscode.workspace.workspaceFolders) {
            await this.scanFolder(folder.uri.fsPath);
        }

        return Array.from(this.projects.values());
    }

    private async scanFolder(folderPath: string): Promise<void> {
        const pattern = new vscode.RelativePattern(folderPath, '**/build.yaml');
        const files = await vscode.workspace.findFiles(pattern);

        for (const file of files) {
            await this.parseBuildYaml(file.fsPath);
        }
    }

    private async parseBuildYaml(yamlPath: string): Promise<void> {
        try {
            const content = fs.readFileSync(yamlPath, 'utf8');
            const parsed = yaml.parse(content);

            if (!parsed || typeof parsed !== 'object') {
                console.warn(`Invalid YAML structure in ${yamlPath}`);
                return;
            }

            const projectName = parsed.name;
            if (!projectName || typeof projectName !== 'string') {
                console.warn(`Missing or invalid project name in ${yamlPath}`);
                return;
            }

            if (!this.projects.has(projectName)) {
                this.projects.set(projectName, {
                    name: projectName,
                    targets: []
                });
            }

            const project = this.projects.get(projectName)!;

            if (parsed.targets && typeof parsed.targets === 'object') {
                for (const targetName of Object.keys(parsed.targets)) {
                    project.targets.push({
                        name: targetName,
                        projectName: projectName,
                        yamlPath: yamlPath
                    });
                }
            }
        } catch (error) {
            console.error(`Error parsing ${yamlPath}:`, error);
        }
    }

    getProjects(): CatboyProject[] {
        return Array.from(this.projects.values());
    }

    async refresh(): Promise<CatboyProject[]> {
        return this.discoverProjects();
    }
}