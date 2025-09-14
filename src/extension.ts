import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
    console.log('Chat Progress Demo extension is now active!');

    // Register the chat participant
    const participant = vscode.chat.createChatParticipant('chat-progress-demo.participant', handler);
    participant.iconPath = vscode.ThemeIcon.File;
    
    // Register advanced followup provider
    participant.followupProvider = {
        provideFollowups(result: vscode.ChatResult, context: vscode.ChatContext, token: vscode.CancellationToken) {
            const followups: vscode.ChatFollowup[] = [];
            
            // Check if this was a help response or initial interaction
            if (!result.metadata || result.metadata.command === 'help') {
                followups.push(
                    { prompt: 'Show me simple progress', label: '🔄 Simple Demo', command: 'simple' },
                    { prompt: 'Demo advanced features', label: '🚀 Advanced Features', command: 'advanced' },
                    { prompt: 'Test interactive capabilities', label: '🎯 Interactive Demo', command: 'interactive' }
                );
            }
            
            // Context-aware followups based on previous command
            if (result.metadata?.lastCommand) {
                switch (result.metadata.lastCommand) {
                    case 'simple':
                        followups.push(
                            { prompt: 'Show step-by-step progress', label: '📊 Try Steps Demo', command: 'steps' },
                            { prompt: 'Demo file processing', label: '📁 File Progress', command: 'file' }
                        );
                        break;
                    case 'advanced':
                        followups.push(
                            { prompt: 'Show native progress indicators', label: '💻 Native Progress', command: 'native' },
                            { prompt: 'Demo web content options', label: '🌐 Web Content', command: 'web' }
                        );
                        break;
                    case 'interactive':
                        followups.push(
                            { prompt: 'Run all demos sequentially', label: '🎬 Full Demo', command: 'full' },
                            { prompt: 'Test cancellation features', label: '⏹️ Test Cancel', command: 'long' }
                        );
                        break;
                }
            }
            
            // Always provide help option
            followups.push({ prompt: 'Show help', label: '❓ Help', command: undefined });
            
            return followups;
        }
    };

    context.subscriptions.push(participant);

    // Register commands
    const helloCommand = vscode.commands.registerCommand('chat-progress-demo.helloWorld', () => {
        vscode.window.showInformationMessage('Hello World from Chat Progress Demo!');
    });
    
    const advancedCommand = vscode.commands.registerCommand('chat-progress-demo.advancedAction', () => {
        vscode.window.showInformationMessage('🚀 Advanced action executed!', 'Show Details').then(selection => {
            if (selection === 'Show Details') {
                vscode.window.showInformationMessage('This demonstrates custom commands triggered from chat participant buttons.');
            }
        });
    });
    
    // Native progress demo commands
    const notificationProgressCommand = vscode.commands.registerCommand('chat-progress-demo.notificationProgress', async () => {
        await vscode.window.withProgress({
            location: vscode.ProgressLocation.Notification,
            title: "🔔 Notification Progress Demo",
            cancellable: true
        }, async (progress, token) => {
            for (let i = 0; i <= 100; i += 10) {
                if (token.isCancellationRequested) {
                    vscode.window.showWarningMessage('Progress was cancelled by user');
                    return;
                }
                
                progress.report({
                    increment: 10,
                    message: `Processing step ${i/10 + 1}/10`
                });
                
                await new Promise(resolve => setTimeout(resolve, 800));
            }
            vscode.window.showInformationMessage('✅ Notification progress completed!');
        });
    });
    
    const statusBarProgressCommand = vscode.commands.registerCommand('chat-progress-demo.statusBarProgress', async () => {
        await vscode.window.withProgress({
            location: vscode.ProgressLocation.Window,
            title: "$(sync~spin) Status Bar Demo"
        }, async (progress) => {
            const steps = ['Connecting...', 'Downloading...', 'Processing...', 'Finalizing...'];
            for (let i = 0; i < steps.length; i++) {
                progress.report({ message: steps[i] });
                await new Promise(resolve => setTimeout(resolve, 1000));
            }
        });
        vscode.window.showInformationMessage('✅ Status bar progress completed!');
    });
    
    const discreteProgressCommand = vscode.commands.registerCommand('chat-progress-demo.discreteProgress', async () => {
        await vscode.window.withProgress({
            location: vscode.ProgressLocation.Notification,
            title: "📈 Discrete Progress Demo",
            cancellable: false
        }, async (progress) => {
            // Show precise percentage progress
            for (let i = 0; i <= 100; i += 5) {
                progress.report({
                    increment: 5,
                    message: `${i}% complete - Processing item ${Math.floor(i/5) + 1}/20`
                });
                await new Promise(resolve => setTimeout(resolve, 200));
            }
        });
        vscode.window.showInformationMessage('✅ Discrete progress completed - 100% done!');
    });
    
    const combinedProgressCommand = vscode.commands.registerCommand('chat-progress-demo.combinedProgress', async () => {
        // Start status bar progress
        const statusBarPromise = vscode.window.withProgress({
            location: vscode.ProgressLocation.Window,
            title: "$(loading~spin) Background Operation"
        }, async (progress) => {
            for (let i = 0; i < 8; i++) {
                progress.report({ message: `Background step ${i + 1}/8` });
                await new Promise(resolve => setTimeout(resolve, 1000));
            }
        });
        
        // Simultaneously show notification progress
        const notificationPromise = vscode.window.withProgress({
            location: vscode.ProgressLocation.Notification,
            title: "🎭 Foreground Operation",
            cancellable: true
        }, async (progress, token) => {
            for (let i = 0; i <= 100; i += 20) {
                if (token.isCancellationRequested) {
                    vscode.window.showWarningMessage('Foreground operation cancelled');
                    return;
                }
                progress.report({
                    increment: 20,
                    message: `Main task ${i/20 + 1}/5`
                });
                await new Promise(resolve => setTimeout(resolve, 1600));
            }
        });
        
        // Wait for both to complete
        await Promise.all([statusBarPromise, notificationPromise]);
        vscode.window.showInformationMessage('✅ Both progress operations completed!');
    });
    
    // Interactive workflow commands
    const startWorkflowCommand = vscode.commands.registerCommand('chat-progress-demo.startWorkflow', async () => {
        const choice = await vscode.window.showQuickPick([
            { label: '🚀 Basic Setup', description: 'Quick start with default settings' },
            { label: '🔧 Advanced Configuration', description: 'Detailed customization options' },
            { label: '📚 Learning Mode', description: 'Step-by-step guidance' }
        ], { placeHolder: 'Choose your workflow type' });
        
        if (choice) {
            vscode.window.showInformationMessage(`Starting ${choice.label} workflow...`, 'Continue', 'Cancel').then(selection => {
                if (selection === 'Continue') {
                    vscode.window.showInformationMessage('Workflow completed! This demonstrates multi-step interactive processes.');
                }
            });
        }
    });
    
    const quickSetupCommand = vscode.commands.registerCommand('chat-progress-demo.quickSetup', async () => {
        await vscode.window.withProgress({
            location: vscode.ProgressLocation.Notification,
            title: "⚡ Quick Setup Wizard",
            cancellable: false
        }, async (progress) => {
            progress.report({ increment: 0, message: 'Analyzing workspace...' });
            await new Promise(r => setTimeout(r, 1000));
            
            progress.report({ increment: 33, message: 'Configuring settings...' });
            await new Promise(r => setTimeout(r, 1000));
            
            progress.report({ increment: 67, message: 'Installing dependencies...' });
            await new Promise(r => setTimeout(r, 1000));
            
            progress.report({ increment: 100, message: 'Setup complete!' });
        });
        
        vscode.window.showInformationMessage('✅ Quick setup completed! This demonstrates wizard-style workflows.');
    });
    
    const troubleshootCommand = vscode.commands.registerCommand('chat-progress-demo.troubleshoot', async () => {
        const issue = await vscode.window.showQuickPick([
            { label: '🐛 Build Errors', description: 'TypeScript compilation issues' },
            { label: '⚙️ Configuration Problems', description: 'Settings and workspace issues' },
            { label: '🔌 Extension Not Loading', description: 'Activation and runtime problems' }
        ], { placeHolder: 'What issue are you experiencing?' });
        
        if (issue) {
            const solution = await vscode.window.showInformationMessage(
                `Troubleshooting: ${issue.label}`,
                'View Solution',
                'Get Help',
                'Report Bug'
            );
            
            if (solution === 'View Solution') {
                vscode.window.showInformationMessage('This demonstrates contextual troubleshooting workflows with branching logic.');
            }
        }
    });
    
    const webviewCommand = vscode.commands.registerCommand('chat-progress-demo.openWebview', () => {
        const panel = vscode.window.createWebviewPanel(
            'demoWebview',
            'Demo Web Content',
            vscode.ViewColumn.One,
            {
                enableScripts: true,
                retainContextWhenHidden: true
            }
        );
        
        panel.webview.html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Demo Web Content</title>
    <style>
        body { font-family: Arial, sans-serif; padding: 20px; }
        .container { max-width: 800px; margin: 0 auto; }
        iframe { width: 100%; height: 400px; border: 1px solid #ccc; }
        .demo-section { margin: 20px 0; padding: 15px; background: #f5f5f5; border-radius: 5px; }
    </style>
</head>
<body>
    <div class="container">
        <h1>🌐 Demo Web Content Panel</h1>
        <p>This demonstrates how to embed web content in a VS Code webview panel.</p>
        
        <div class="demo-section">
            <h2>📊 Sample Dashboard</h2>
            <p>This could be your web application, dashboard, or interactive content:</p>
            <iframe src="https://code.visualstudio.com" title="VS Code Website"></iframe>
        </div>
        
        <div class="demo-section">
            <h2>🎯 Interactive Content</h2>
            <button onclick="alert('Button clicked in webview!')">Click Me!</button>
            <p>JavaScript works in webview panels!</p>
        </div>
        
        <div class="demo-section">
            <h2>📱 Responsive Design</h2>
            <p>Webviews can contain any HTML/CSS/JavaScript content you need.</p>
        </div>
    </div>
</body>
</html>`;
    });

    context.subscriptions.push(
        helloCommand, 
        advancedCommand,
        notificationProgressCommand,
        statusBarProgressCommand, 
        discreteProgressCommand,
        combinedProgressCommand,
        startWorkflowCommand,
        quickSetupCommand,
        troubleshootCommand,
        webviewCommand
    );

    // Register Language Model Tools for Copilot Agent Mode
    registerProgressTools(context);
}

function registerProgressTools(context: vscode.ExtensionContext) {
    // Tool 1: Simple Progress Demo
    const simpleProgressTool = vscode.lm.registerTool('progress-demo-simple', {
        invoke: async (options, token) => {
            const input = options.input as { duration?: number; steps?: number; message?: string };
            const duration = input.duration || 5000;
            const steps = input.steps || 3;
            const message = input.message || 'Processing task';

            const stepDuration = duration / steps;
            let result = `Starting ${message}...\n\n`;

            for (let i = 1; i <= steps; i++) {
                if (token.isCancellationRequested) {
                    result += `❌ Task cancelled at step ${i}`;
                    break;
                }

                result += `✓ Step ${i}/${steps}: ${message} (${Math.round((i / steps) * 100)}%)\n`;
                await sleep(stepDuration);
            }

            if (!token.isCancellationRequested) {
                result += `\n🎉 Task completed successfully in ${duration}ms!`;
            }

            return new vscode.LanguageModelToolResult([
                new vscode.LanguageModelTextPart(result)
            ]);
        },
        prepareInvocation: async (options, token) => {
            const input = options.input as { duration?: number; steps?: number; message?: string };
            const message = input.message || 'task';
            return {
                invocationMessage: `Running simple progress demo for "${message}"...`
            };
        }
    });

    // Tool 2: File Processor
    const fileProcessorTool = vscode.lm.registerTool('progress-demo-file-processor', {
        invoke: async (options, token) => {
            const input = options.input as { 
                fileCount?: number; 
                fileTypes?: string[]; 
                processingTime?: number;
                showProgress?: boolean;
            };
            
            const fileCount = input.fileCount || 8;
            const fileTypes = input.fileTypes || ['.js', '.ts', '.json', '.md', '.css', '.html'];
            const processingTime = input.processingTime || 3000;
            const showProgress = input.showProgress !== false;

            let result = `📁 Processing ${fileCount} files...\n\n`;
            const stepTime = processingTime / fileCount;

            const files = [];
            for (let i = 0; i < fileCount; i++) {
                const ext = fileTypes[i % fileTypes.length];
                const name = `file${i + 1}${ext}`;
                files.push(name);
            }

            for (let i = 0; i < files.length; i++) {
                if (token.isCancellationRequested) {
                    result += `\n❌ File processing cancelled at ${files[i]}`;
                    break;
                }

                const file = files[i];
                const progress = Math.round(((i + 1) / files.length) * 100);
                
                if (showProgress) {
                    result += `📄 ${file} - ${progress}% complete\n`;
                } else {
                    result += `📄 ${file} ✓\n`;
                }
                
                await sleep(stepTime);
            }

            if (!token.isCancellationRequested) {
                result += `\n✅ Successfully processed ${files.length} files!`;
            }

            return new vscode.LanguageModelToolResult([
                new vscode.LanguageModelTextPart(result)
            ]);
        },
        prepareInvocation: async (options, token) => {
            const input = options.input as { fileCount?: number };
            const count = input.fileCount || 8;
            return {
                invocationMessage: `Processing ${count} files with progress tracking...`
            };
        }
    });

    // Tool 3: Workspace Analyzer
    const workspaceAnalyzerTool = vscode.lm.registerTool('progress-demo-workspace-analyzer', {
        invoke: async (options, token) => {
            const input = options.input as { 
                deep?: boolean; 
                includeHidden?: boolean; 
                fileTypes?: string[];
            };

            const deep = input.deep !== false;
            const includeHidden = input.includeHidden || false;
            const fileTypes = input.fileTypes || [];

            let result = `🔍 Analyzing workspace structure...\n\n`;

            // Phase 1: Discover workspace folders
            result += `📋 Phase 1: Discovering workspace folders\n`;
            await sleep(800);
            
            const workspaceFolders = vscode.workspace.workspaceFolders;
            if (workspaceFolders && workspaceFolders.length > 0) {
                for (const folder of workspaceFolders) {
                    result += `  📁 ${folder.name} (${folder.uri.fsPath})\n`;
                }
            } else {
                result += `  ⚠️ No workspace folders found\n`;
            }

            if (token.isCancellationRequested) {
                result += `\n❌ Analysis cancelled`;
                return new vscode.LanguageModelToolResult([
                    new vscode.LanguageModelTextPart(result)
                ]);
            }

            // Phase 2: Scan for files
            result += `\n📋 Phase 2: Scanning for files\n`;
            await sleep(1000);

            try {
                if (workspaceFolders && workspaceFolders.length > 0) {
                    const pattern = fileTypes.length > 0 
                        ? `**/*.{${fileTypes.map(t => t.replace('.', '')).join(',')}}`
                        : '**/*';
                    
                    const files = await vscode.workspace.findFiles(
                        pattern, 
                        includeHidden ? null : '**/node_modules/**', 
                        100
                    );

                    result += `  📊 Found ${files.length} files\n`;
                    
                    // Group by file type
                    const filesByType: Record<string, number> = {};
                    files.forEach(file => {
                        const ext = file.path.split('.').pop() || 'no-extension';
                        filesByType[ext] = (filesByType[ext] || 0) + 1;
                    });

                    result += `\n📈 File type breakdown:\n`;
                    Object.entries(filesByType)
                        .sort(([,a], [,b]) => b - a)
                        .forEach(([ext, count]) => {
                            result += `  • .${ext}: ${count} files\n`;
                        });
                } else {
                    result += `  ⚠️ No files to scan (no workspace)\n`;
                }
            } catch (error) {
                result += `  ❌ Error scanning files: ${error}\n`;
            }

            if (token.isCancellationRequested) {
                result += `\n❌ Analysis cancelled`;
                return new vscode.LanguageModelToolResult([
                    new vscode.LanguageModelTextPart(result)
                ]);
            }

            // Phase 3: Analyze configuration
            result += `\n📋 Phase 3: Analyzing configuration\n`;
            await sleep(600);

            try {
                const packageJson = await vscode.workspace.findFiles('**/package.json', '**/node_modules/**', 1);
                const tsconfig = await vscode.workspace.findFiles('**/tsconfig.json', '**/node_modules/**', 1);
                const gitignore = await vscode.workspace.findFiles('**/.gitignore', null, 1);

                result += `  📦 package.json: ${packageJson.length > 0 ? '✓ Found' : '❌ Not found'}\n`;
                result += `  🔧 tsconfig.json: ${tsconfig.length > 0 ? '✓ Found' : '❌ Not found'}\n`;
                result += `  🚫 .gitignore: ${gitignore.length > 0 ? '✓ Found' : '❌ Not found'}\n`;
            } catch (error) {
                result += `  ❌ Error analyzing configuration: ${error}\n`;
            }

            result += `\n✅ Workspace analysis complete!`;

            return new vscode.LanguageModelToolResult([
                new vscode.LanguageModelTextPart(result)
            ]);
        },
        prepareInvocation: async (options, token) => {
            return {
                invocationMessage: `Analyzing workspace structure and files...`
            };
        }
    });

    // Tool 4: Task Runner
    const taskRunnerTool = vscode.lm.registerTool('progress-demo-task-runner', {
        invoke: async (options, token) => {
            const input = options.input as { 
                phases?: string[]; 
                totalDuration?: number; 
                allowCancellation?: boolean;
                showDetails?: boolean;
            };

            const phases = input.phases || ['Setup', 'Processing', 'Validation', 'Completion'];
            const totalDuration = input.totalDuration || 8000;
            const allowCancellation = input.allowCancellation !== false;
            const showDetails = input.showDetails !== false;

            let result = `🚀 Starting multi-phase task execution...\n\n`;
            const phaseDuration = totalDuration / phases.length;

            for (let i = 0; i < phases.length; i++) {
                const phase = phases[i];
                const phaseNumber = i + 1;

                if (allowCancellation && token.isCancellationRequested) {
                    result += `❌ Task cancelled during ${phase} phase`;
                    break;
                }

                result += `📋 Phase ${phaseNumber}/${phases.length}: ${phase}\n`;
                
                if (showDetails) {
                    // Simulate sub-steps within each phase
                    const subSteps = Math.floor(Math.random() * 3) + 2; // 2-4 sub-steps
                    const subStepDuration = phaseDuration / subSteps;

                    for (let j = 0; j < subSteps; j++) {
                        if (allowCancellation && token.isCancellationRequested) {
                            result += `  ❌ Cancelled during substep ${j + 1}\n`;
                            break;
                        }

                        const substepNames = [
                            'Initializing resources',
                            'Loading data',
                            'Running algorithms',
                            'Validating results',
                            'Generating output',
                            'Cleanup operations'
                        ];
                        
                        const substepName = substepNames[j % substepNames.length];
                        result += `  • ${substepName}...\n`;
                        await sleep(subStepDuration);
                        result += `  ✓ ${substepName} complete\n`;
                    }
                } else {
                    await sleep(phaseDuration);
                }

                if (!token.isCancellationRequested) {
                    result += `✅ Phase ${phaseNumber} complete\n\n`;
                }
            }

            if (!token.isCancellationRequested) {
                result += `🎉 All phases completed successfully!\n`;
                result += `📊 Total execution time: ${totalDuration}ms`;
            }

            return new vscode.LanguageModelToolResult([
                new vscode.LanguageModelTextPart(result)
            ]);
        },
        prepareInvocation: async (options, token) => {
            const input = options.input as { phases?: string[] };
            const phaseCount = input.phases?.length || 4;
            return {
                invocationMessage: `Executing ${phaseCount}-phase task with progress tracking...`
            };
        }
    });

    // Tool 5: Interactive Wizard
    const interactiveWizardTool = vscode.lm.registerTool('progress-demo-interactive-wizard', {
        invoke: async (options, token) => {
            const input = options.input as { 
                wizardType?: string; 
                steps?: number; 
                includeChoices?: boolean;
                autoAdvance?: boolean;
            };

            const wizardType = input.wizardType || 'Setup Wizard';
            const steps = input.steps || 5;
            const includeChoices = input.includeChoices !== false;
            const autoAdvance = input.autoAdvance !== false;

            let result = `🧙‍♂️ ${wizardType} - Interactive Progress Demo\n\n`;

            const wizardSteps = [
                { title: 'Welcome & Introduction', action: 'Preparing wizard interface' },
                { title: 'User Preferences', action: 'Collecting user settings' },
                { title: 'Configuration Setup', action: 'Applying configurations' },
                { title: 'Resource Installation', action: 'Installing required components' },
                { title: 'Validation & Testing', action: 'Verifying setup' },
                { title: 'Completion & Summary', action: 'Finalizing installation' }
            ];

            for (let i = 0; i < Math.min(steps, wizardSteps.length); i++) {
                if (token.isCancellationRequested) {
                    result += `❌ Wizard cancelled at step ${i + 1}`;
                    break;
                }

                const step = wizardSteps[i];
                result += `📋 Step ${i + 1}/${steps}: ${step.title}\n`;
                result += `   🔄 ${step.action}...\n`;

                // Simulate processing time
                await sleep(1000 + Math.random() * 1000);

                if (includeChoices && i === 1) {
                    // Simulate user choice at preferences step
                    const choices = ['Basic Setup', 'Advanced Configuration', 'Custom Settings'];
                    const selectedChoice = choices[Math.floor(Math.random() * choices.length)];
                    result += `   ⚙️ Selected: ${selectedChoice}\n`;
                }

                if (includeChoices && i === 3) {
                    // Simulate component selection
                    const components = ['TypeScript Support', 'Debugging Tools', 'Extension Pack'];
                    const selectedComponents = components.slice(0, Math.floor(Math.random() * 2) + 1);
                    result += `   📦 Installing: ${selectedComponents.join(', ')}\n`;
                }

                result += `   ✅ ${step.title} complete\n\n`;

                if (autoAdvance && i < steps - 1) {
                    await sleep(500); // Brief pause between steps
                }
            }

            if (!token.isCancellationRequested) {
                result += `🎉 ${wizardType} completed successfully!\n`;
                result += `📊 Summary: ${steps} steps completed with interactive elements`;
            }

            return new vscode.LanguageModelToolResult([
                new vscode.LanguageModelTextPart(result)
            ]);
        },
        prepareInvocation: async (options, token) => {
            const input = options.input as { wizardType?: string; steps?: number };
            const wizardType = input.wizardType || 'Setup Wizard';
            const stepCount = input.steps || 5;
            return {
                invocationMessage: `Running ${wizardType} with ${stepCount} interactive steps...`
            };
        }
    });

    // Add all tools to context subscriptions
    context.subscriptions.push(
        simpleProgressTool,
        fileProcessorTool, 
        workspaceAnalyzerTool,
        taskRunnerTool,
        interactiveWizardTool
    );
}

async function handler(
    request: vscode.ChatRequest,
    context: vscode.ChatContext,
    stream: vscode.ChatResponseStream,
    token: vscode.CancellationToken
): Promise<vscode.ChatResult> {
    
    // Handle different commands
    const command = request.command;
    
    // Debug: log what we're receiving
    console.log('Command received:', command);
    console.log('Request prompt:', request.prompt);
    
    // Check if this is a request about tools (for Copilot agent mode)
    const prompt = request.prompt.trim().toLowerCase();
    if (prompt.includes('tools') || prompt.includes('agent') || prompt.includes('copilot')) {
        return await showToolsHelp(stream);
    }
    
    // Parse command from prompt if command is undefined
    let actualCommand = command;
    if (!actualCommand) {
        if (prompt.includes('simple')) {
            actualCommand = 'simple';
        } else if (prompt.includes('steps')) {
            actualCommand = 'steps';
        } else if (prompt.includes('file')) {
            actualCommand = 'file';
        } else if (prompt.includes('long')) {
            actualCommand = 'long';
        } else if (prompt.includes('links')) {
            actualCommand = 'links';
        } else if (prompt.includes('details')) {
            actualCommand = 'details';
        } else if (prompt.includes('web')) {
            actualCommand = 'web';
        } else if (prompt.includes('advanced')) {
            actualCommand = 'advanced';
        } else if (prompt.includes('native')) {
            actualCommand = 'native';
        } else if (prompt.includes('interactive')) {
            actualCommand = 'interactive';
        }
    }
    
    try {
        switch (actualCommand) {
            case 'simple':
                return await handleSimpleProgress(stream, token);
            case 'steps':
                return await handleStepProgress(stream, token);
            case 'file':
                return await handleFileProgress(stream, token);
            case 'long':
                return await handleLongRunningTask(stream, token);
            case 'links':
                return await handleFileLinksDemo(stream, token);
            case 'details':
                return await handleDetailsDemo(stream, token);
            case 'web':
                return await handleWebContentDemo(stream, token);
            case 'advanced':
                return await handleAdvancedFeatures(stream, token, context);
            case 'native':
                return await handleNativeProgressDemo(stream, token);
            case 'interactive':
                return await handleInteractiveDemo(stream, token, context);
            default:
                return await showHelp(stream);
        }
    } catch (error) {
        stream.markdown(`❌ **Error:** ${error instanceof Error ? error.message : 'Unknown error'}`);
        return { errorDetails: { message: 'Command failed' } };
    }
}

async function handleSimpleProgress(stream: vscode.ChatResponseStream, token: vscode.CancellationToken) {
    stream.markdown('## Simple Progress Demo\n\nStarting a simple task...\n');
    
    // Show indeterminate progress with longer delays
    stream.progress('🔄 **Initializing system**...\n\nThis is a very long message to see how it would show up. Does the system do a good job of displaying this? How are you today? I can leave several lines of text here and it will show all of it.');
    await sleep(3000);
    
    if (token.isCancellationRequested) {
        stream.markdown('⚠️ **Task was cancelled**');
        return {};
    }
    
    stream.progress('📊 Processing data chunks...');
    await sleep(4000);
    
    if (token.isCancellationRequested) {
        stream.markdown('⚠️ **Task was cancelled**');
        return {};
    }
    
    stream.progress('✨ Finalizing results...');
    await sleep(2500);
    
    if (token.isCancellationRequested) {
        stream.markdown('⚠️ **Task was cancelled**');
        return {};
    }
    
    stream.markdown('✅ **Task completed successfully!**\n\nThis demonstrated a simple progress indicator with text updates.');
    
    return {};
}

async function handleStepProgress(stream: vscode.ChatResponseStream, token: vscode.CancellationToken) {
    stream.markdown('## Step-by-Step Progress Demo\n\nExecuting multi-step process...\n');
    
    const steps = [
        'Validating input parameters',
        'Connecting to external service',
        'Downloading required data',
        'Processing information',
        'Generating results',
        'Saving output'
    ];
    
    for (let i = 0; i < steps.length; i++) {
        if (token.isCancellationRequested) {
            stream.markdown('⚠️ **Task was cancelled**');
            return {};
        }
        
        const step = steps[i];
        stream.progress(`Step ${i + 1}/${steps.length}: ${step}`);
        
        // Simulate work for each step
        const workTime = Math.random() * 1000 + 500; // 500-1500ms
        await sleep(workTime);
        
        stream.markdown(`- ✓ ${step}\n`);
    }
    
    stream.markdown('\n🎉 **All steps completed successfully!**\n\nThis showed progress with specific step indicators.');
    
    return {};
}

async function handleFileProgress(stream: vscode.ChatResponseStream, token: vscode.CancellationToken) {
    stream.markdown('## File Processing Progress Demo\n\nSimulating file processing with progress tracking...\n');
    
    const files = [
        'config.json',
        'data.csv',
        'image1.png',
        'image2.jpg',
        'document.pdf',
        'script.js',
        'styles.css',
        'readme.md'
    ];
    
    stream.markdown(`Processing ${files.length} files:\n`);
    
    for (let i = 0; i < files.length; i++) {
        if (token.isCancellationRequested) {
            stream.markdown('⚠️ **File processing was cancelled**');
            return {};
        }
        
        const file = files[i];
        const progress = Math.round(((i + 1) / files.length) * 100);
        
        stream.progress(`Processing ${file} (${progress}%)`);
        
        // Simulate file processing time
        await sleep(600);
        
        stream.markdown(`- 📁 ${file} ✓\n`);
    }
    
    stream.markdown('\n📊 **File processing complete!**\n\nThis demonstrated progress tracking with percentage completion.');
    
    return {};
}

async function handleLongRunningTask(stream: vscode.ChatResponseStream, token: vscode.CancellationToken) {
    stream.markdown('## Long-Running Task Demo\n\nSimulating a complex operation with detailed progress...\n');
    
    // Phase 1: Setup
    stream.progress('Setting up environment...');
    await sleep(1000);
    stream.markdown('🔧 **Phase 1: Setup Complete**\n');
    
    // Phase 2: Data Collection
    stream.markdown('**Phase 2: Data Collection**\n');
    for (let i = 1; i <= 5; i++) {
        if (token.isCancellationRequested) {
            stream.markdown('⚠️ **Task was cancelled during data collection**');
            return {};
        }
        
        stream.progress(`Collecting batch ${i}/5...`);
        await sleep(800);
        stream.markdown(`- Batch ${i} collected (${Math.random() * 1000 + 500 | 0} records)\n`);
    }
    
    // Phase 3: Analysis
    stream.markdown('\n**Phase 3: Analysis**\n');
    const analysisSteps = ['Parsing data', 'Running algorithms', 'Generating insights', 'Validating results'];
    
    for (let i = 0; i < analysisSteps.length; i++) {
        if (token.isCancellationRequested) {
            stream.markdown('⚠️ **Task was cancelled during analysis**');
            return {};
        }
        
        stream.progress(`Analysis: ${analysisSteps[i]}...`);
        await sleep(1200);
        stream.markdown(`- ${analysisSteps[i]} ✓\n`);
    }
    
    // Phase 4: Completion
    stream.progress('Finalizing results...');
    await sleep(500);
    
    stream.markdown('\n🚀 **Long-running task completed successfully!**\n\n**Summary:**\n- Total processing time: ~15 seconds\n- Data batches processed: 5\n- Analysis steps completed: 4\n- Status: Success ✅');
    
    return {};
}

async function handleFileLinksDemo(stream: vscode.ChatResponseStream, token: vscode.CancellationToken) {
    stream.markdown('## File Links Demo\n\nDemonstrating how to create links to files with custom titles...\n');
    
    // Get current workspace folder
    const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
    
    stream.progress('🔍 Scanning workspace files...');
    await sleep(1000);
    
    let basePath: string;
    let useExamples = false;
    
    if (workspaceFolder) {
        basePath = workspaceFolder.uri.fsPath;
    } else {
        // Use example paths when no workspace is open
        basePath = 'C:/Users/example/project';
        useExamples = true;
        stream.markdown('ℹ️ *No workspace folder found - showing example links*\n\n');
    }
    
    stream.markdown(`### 📁 **${useExamples ? 'Example ' : ''}Files with Custom Link Titles:**\n`);
    
    // Link to package.json with custom title
    const packageJsonUri = vscode.Uri.file(basePath + '/package.json');
    stream.markdown(`- [📦 **Project Configuration**](${packageJsonUri.toString()}) - Main package.json file\n`);
    
    // Link to extension.ts with custom title  
    const extensionUri = vscode.Uri.file(basePath + '/src/extension.ts');
    stream.markdown(`- [⚡ **Extension Source Code**](${extensionUri.toString()}) - Main TypeScript file\n`);
    
    // Link to tsconfig.json with custom title
    const tsconfigUri = vscode.Uri.file(basePath + '/tsconfig.json');
    stream.markdown(`- [🔧 **TypeScript Config**](${tsconfigUri.toString()}) - Compiler configuration\n`);
    
    // Link to README.md with custom title
    const readmeUri = vscode.Uri.file(basePath + '/README.md');
    stream.markdown(`- [📖 **Documentation**](${readmeUri.toString()}) - Project README\n`);
    
    stream.progress('🔗 Creating additional examples...');
    await sleep(1000);
    
    stream.markdown('\n### 🌐 **Different Link Styles:**\n');
    
    // Inline code link
    stream.markdown(`Check out the \`extension.ts\` file: [View Source](${extensionUri.toString()})\n`);
    
    // Bold link
    stream.markdown(`**Important:** [**📋 Package Dependencies**](${packageJsonUri.toString()})\n`);
    
    // Link with emoji and description
    stream.markdown(`🎯 [**Main Extension File**](${extensionUri.toString()}) - Contains all the chat participant logic\n`);
    
    // Multiple links in one line
    stream.markdown(`Quick access: [Config](${tsconfigUri.toString()}) | [Source](${extensionUri.toString()}) | [Docs](${readmeUri.toString()})\n`);
    
    stream.markdown('\n### 💡 **Link Syntax Examples:**\n');
    stream.markdown('```markdown\n');
    stream.markdown('[Custom Title](file:///path/to/file.ext)\n');
    stream.markdown('[📁 **Folder Name**](file:///path/to/folder/)\n');
    stream.markdown('Check the [important file](file:///path/to/file.txt) for details.\n');
    stream.markdown('[🎯 **Bold Link**](file:///C:/path/to/file.js)\n');
    stream.markdown('```\n');
    
    stream.markdown('\n### 🔗 **Additional Link Examples:**\n');
    
    // Create some universal example links
    const exampleFile1 = vscode.Uri.file('C:/Windows/System32/notepad.exe');
    const exampleFile2 = vscode.Uri.file('C:/Windows/explorer.exe');
    
    stream.markdown(`- [🗒️ **Notepad Application**](${exampleFile1.toString()}) - Windows Notepad\n`);
    stream.markdown(`- [📁 **File Explorer**](${exampleFile2.toString()}) - Windows Explorer\n`);
    stream.markdown(`- [🌐 **Example Web Link**](https://code.visualstudio.com) - VS Code Website\n`);
    
    if (token.isCancellationRequested) {
        stream.markdown('⚠️ **Demo was cancelled**');
        return {};
    }
    
    stream.markdown('\n✅ **File Links Demo Complete!**\n\nClick any of the links above to open the corresponding files in VS Code.');
    
    return {};
}

async function handleDetailsDemo(stream: vscode.ChatResponseStream, token: vscode.CancellationToken) {
    stream.markdown('## Collapsible Content Alternatives\n\n❌ **HTML `<details>` tags don\'t work in VS Code chat**\n\nBut here are effective alternatives for organizing content:\n\n');
    
    stream.progress('🎨 Creating organized content sections...');
    await sleep(1000);
    
    // Alternative 1: Expandable sections with follow-up prompts
    stream.markdown('### 📋 **Method 1: Interactive Follow-up Prompts**\n\n');
    stream.markdown('Instead of collapsible content, use **follow-up prompts** that users can click:\n\n');
    stream.markdown('> 🔍 **Want to see more details?** Try these commands:\n> - `@progress simple` - Basic progress demo\n> - `@progress steps` - Step-by-step process\n> - `@progress file` - File processing example\n\n');
    
    stream.progress('📊 Adding organized sections...');
    await sleep(800);
    
    // Alternative 2: Visual separators and sections
    stream.markdown('### � **Method 2: Visual Section Organization**\n\n');
    stream.markdown('Use **visual separators** and **clear headings** to organize content:\n\n');
    
    stream.markdown('---\n\n#### 🚀 **Quick Start Guide**\n\n');
    stream.markdown('```bash\n# Install dependencies\nnpm install\n\n# Start development\nnpm run dev\n\n# Build for production\nnpm run build\n```\n\n');
    
    stream.markdown('---\n\n#### ⚙️ **Configuration Options**\n\n');
    stream.markdown('| Option | Default | Description |\n|--------|---------|-------------|\n| `autoSave` | `true` | Automatically save changes |\n| `formatOnSave` | `false` | Format code on save |\n| `lintOnType` | `true` | Show lint errors while typing |\n\n');
    
    stream.markdown('---\n\n#### 🔧 **Advanced Settings**\n\n');
    stream.markdown('```json\n{\n  "compilerOptions": {\n    "target": "ES2020",\n    "module": "commonjs",\n    "strict": true,\n    "esModuleInterop": true\n  }\n}\n```\n\n');
    
    if (token.isCancellationRequested) {
        stream.markdown('⚠️ **Demo was cancelled**');
        return {};
    }
    
    stream.progress('🎨 Adding progressive disclosure...');
    await sleep(600);
    
    // Alternative 3: Progressive disclosure
    stream.markdown('### 🎯 **Method 3: Progressive Disclosure**\n\n');
    stream.markdown('Show **summary first**, then provide **detailed explanations**:\n\n');
    
    stream.markdown('> **📊 Quick Summary:** This extension demonstrates chat participants with progress indicators.\n\n');
    stream.markdown('**🔍 Detailed Breakdown:**\n\n');
    stream.markdown('1. **Simple Progress** - Basic indeterminate progress with text updates\n');
    stream.markdown('2. **Step Progress** - Multi-step processes with individual completion markers\n');
    stream.markdown('3. **File Progress** - Percentage-based tracking for file operations\n');
    stream.markdown('4. **Long Tasks** - Complex multi-phase operations with detailed reporting\n\n');
    
    stream.markdown('**🛠️ Technical Details:**\n');
    stream.markdown('- Uses `ChatResponseStream.progress()` for indicators\n');
    stream.markdown('- Supports cancellation via `CancellationToken`\n');
    stream.markdown('- Combines progress with markdown output\n');
    stream.markdown('- Handles errors gracefully with try-catch blocks\n\n');
    
    // Alternative 4: Tabbed-style sections
    stream.markdown('### 📚 **Method 4: Tabbed-Style Information**\n\n');
    stream.markdown('Create **tab-like sections** using emojis and consistent formatting:\n\n');
    
    stream.markdown('🔍 **Debug Info** | ⚙️ **Requirements** | 📝 **Changes** | 🚀 **Deployment**\n\n');
    
    stream.markdown('**🔍 Debug Information:**\n');
    stream.markdown('- Environment: `Development`\n- Version: `1.0.0`\n- Build: `2025.09.10`\n- Node: `v18.17.0`\n\n');
    
    stream.markdown('**⚙️ System Requirements:**\n');
    stream.markdown('- Node.js >= 18.0.0\n- VS Code >= 1.80.0\n- TypeScript >= 4.9.0\n- npm >= 8.0.0\n\n');
    
    stream.markdown('**📝 Recent Changes:**\n');
    stream.markdown('- ✅ Added progress indicators\n- ✅ Implemented file links\n- ✅ Created organization alternatives\n- 📋 Updated documentation\n\n');
    
    // Alternative 5: Expandable with user interaction
    stream.markdown('### 🎨 **Method 5: Interactive Expandable Content**\n\n');
    stream.markdown('Use **blockquotes** and **callouts** to highlight expandable concepts:\n\n');
    
    stream.markdown('> 💡 **Pro Tip:** Want to see the advanced configuration?\n> Type `@progress long` to see a complex multi-phase operation in action!\n\n');
    
    stream.markdown('> ⚠️ **Note:** For detailed error handling examples,\n> try `@progress simple` and then cancel it mid-process.\n\n');
    
    stream.markdown('> 📚 **Learn More:** Each demo command shows different aspects:\n>\n> - **Simple**: Basic progress patterns\n> - **Steps**: Sequential task tracking  \n> - **File**: Percentage-based progress\n> - **Long**: Multi-phase operations\n>\n> Pick the one that matches your use case!\n\n');
    
    stream.markdown('### 📋 **Implementation Examples:**\n\n```typescript\n// Method 1: Follow-up prompts\nparticipant.followupProvider = {\n  provideFollowups() {\n    return [{\n      prompt: "Show advanced options",\n      label: "🔧 Advanced"\n    }];\n  }\n};\n\n// Method 2: Conditional content\nif (userWantsDetails) {\n  stream.markdown("## Detailed Information\\n...");\n}\n\n// Method 3: Progressive disclosure\nstream.markdown("**Summary:** Basic info\\n");\nstream.markdown("**Details:** Extended info\\n");\n```\n\n');
    
    if (token.isCancellationRequested) {
        stream.markdown('⚠️ **Demo was cancelled**');
        return {};
    }
    
    stream.markdown('### 🎯 **Best Practices Summary:**\n\n');
    stream.markdown('1. **📋 Follow-up Prompts** - Most interactive, lets users choose what to explore\n');
    stream.markdown('2. **📂 Visual Separators** - Clean organization with headers and dividers\n');
    stream.markdown('3. **🎯 Progressive Disclosure** - Summary first, details follow\n');
    stream.markdown('4. **📚 Tabbed Style** - Multiple topics in organized sections\n');
    stream.markdown('5. **🎨 Interactive Callouts** - Blockquotes with guidance for next steps\n\n');
    
    stream.markdown('✅ **Alternatives Demo Complete!**\n\n');
    stream.markdown('💡 **Recommendation:** Use **follow-up prompts** for the most interactive experience, or **visual separators** for the cleanest organization.\n\n');
    
    return {};
}

async function handleWebContentDemo(stream: vscode.ChatResponseStream, token: vscode.CancellationToken) {
    stream.markdown('## Web Content in Chat Participants\n\n❌ **Direct web embedding (iframes, webviews) is NOT supported in ChatResponseStream**\n\nBut here are the supported alternatives and workarounds:\n\n');
    
    stream.progress('🔍 Exploring available options...');
    await sleep(1000);
    
    // Show what IS supported
    stream.markdown('### ✅ **What IS Supported:**\n\n');
    
    // 1. Images via markdown
    stream.markdown('#### 🖼️ **1. Images via Markdown**\n');
    stream.markdown('You can embed images using standard markdown syntax:\n\n');
    stream.markdown('```markdown\n![Alt text](https://via.placeholder.com/300x150/0066cc/ffffff?text=Sample+Image)\n```\n\n');
    stream.markdown('Result: ![Sample Image](https://via.placeholder.com/300x150/0066cc/ffffff?text=Sample+Image)\n\n');
    
    stream.progress('🔗 Adding interactive elements...');
    await sleep(800);
    
    // 2. Clickable links
    stream.markdown('#### 🔗 **2. Clickable Web Links**\n');
    stream.markdown('Links open in the default browser:\n\n');
    stream.markdown('- [🌐 **VS Code Documentation**](https://code.visualstudio.com/docs)\n');
    stream.markdown('- [📚 **Extension API Reference**](https://code.visualstudio.com/api)\n');
    stream.markdown('- [🎯 **Chat Extension Guide**](https://code.visualstudio.com/api/extension-guides/chat)\n');
    stream.markdown('- [🔧 **GitHub Repository**](https://github.com/microsoft/vscode)\n\n');
    
    // 3. Buttons with commands
    stream.markdown('#### 🔘 **3. Interactive Buttons**\n');
    stream.markdown('Buttons can trigger VS Code commands:\n\n');
    
    // Add some buttons
    stream.button({
        command: 'workbench.action.openSettings',
        title: '⚙️ Open Settings',
        tooltip: 'Open VS Code Settings'
    });
    
    stream.button({
        command: 'workbench.action.showCommands',
        title: '🎯 Command Palette',
        tooltip: 'Open Command Palette'
    });
    
    stream.button({
        command: 'workbench.action.terminal.new',
        title: '💻 New Terminal',
        tooltip: 'Open New Terminal'
    });
    
    stream.markdown('\n\n');
    
    if (token.isCancellationRequested) {
        stream.markdown('⚠️ **Demo was cancelled**');
        return {};
    }
    
    stream.progress('📊 Creating rich content examples...');
    await sleep(600);
    
    // 4. File references and anchors
    stream.markdown('#### 📁 **4. File References & Anchors**\n');
    
    // Get workspace folder if available
    const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
    if (workspaceFolder) {
        const packageUri = vscode.Uri.file(workspaceFolder.uri.fsPath + '/package.json');
        stream.reference(packageUri, vscode.ThemeIcon.File);
        stream.markdown('Reference to package.json file ↑\n\n');
        
        stream.anchor(packageUri, '📦 Jump to package.json');
        stream.markdown('Anchor link to package.json ↑\n\n');
    } else {
        stream.markdown('*File references would appear here if workspace was open*\n\n');
    }
    
    // 5. Rich markdown content
    stream.markdown('#### 📋 **5. Rich Markdown Content**\n\n');
    stream.markdown('Tables, code blocks, and formatting:\n\n');
    
    stream.markdown('| Feature | Supported | Alternative |\n');
    stream.markdown('|---------|-----------|-------------|\n');
    stream.markdown('| Images | ✅ Markdown | External URLs |\n');
    stream.markdown('| Videos | ❌ No | Links to video sites |\n');
    stream.markdown('| Iframes | ❌ No | Open in browser |\n');
    stream.markdown('| Forms | ❌ No | Use buttons + commands |\n');
    stream.markdown('| JavaScript | ❌ No | Extension commands |\n\n');
    
    // 6. Workarounds section
    stream.markdown('### 🔧 **Workarounds for Web Content:**\n\n');
    
    stream.markdown('#### 💡 **Method 1: Simple Browser**\n');
    stream.markdown('Use VS Code\'s built-in Simple Browser:\n\n');
    
    stream.button({
        command: 'simpleBrowser.show',
        title: '🌐 Open Simple Browser',
        arguments: ['https://code.visualstudio.com'],
        tooltip: 'Open website in VS Code Simple Browser'
    });
    
    stream.markdown('\n\n```typescript\n// In your extension\nstream.button({\n  command: \'simpleBrowser.show\',\n  title: \'🌐 Open Website\',\n  arguments: [\'https://example.com\']\n});\n```\n\n');
    
    if (token.isCancellationRequested) {
        stream.markdown('⚠️ **Demo was cancelled**');
        return {};
    }
    
    stream.markdown('#### 💡 **Method 2: Webview Panel**\n');
    stream.markdown('Create a separate webview panel for complex web content:\n\n');
    
    stream.button({
        command: 'chat-progress-demo.openWebview',
        title: '📱 Demo Webview Panel',
        tooltip: 'Open a webview panel with web content'
    });
    
    stream.markdown('\n\n```typescript\n// Create webview panel\nconst panel = vscode.window.createWebviewPanel(\n  \'webContent\',\n  \'Web Content\',\n  vscode.ViewColumn.One,\n  { enableScripts: true }\n);\n\npanel.webview.html = `<!DOCTYPE html>\n<html><body>\n  <h1>Embedded Web Content</h1>\n  <iframe src="https://example.com"></iframe>\n</body></html>`;\n```\n\n');
    
    stream.markdown('#### 💡 **Method 3: External Browser**\n');
    stream.markdown('Open content in the user\'s default browser:\n\n');
    
    stream.markdown('- [📊 **Interactive Dashboard**](https://code.visualstudio.com/learn) - VS Code Learn\n');
    stream.markdown('- [🎮 **Web App Demo**](https://vscode.dev) - VS Code for the Web\n');
    stream.markdown('- [📈 **Data Visualization**](https://marketplace.visualstudio.com/vscode) - Extensions Marketplace\n\n');
    
    stream.markdown('### 📋 **Summary of Capabilities:**\n\n');
    
    stream.markdown('**✅ Directly Supported:**\n');
    stream.markdown('- Static images (PNG, JPG, SVG via URLs)\n');
    stream.markdown('- Clickable web links\n');
    stream.markdown('- Interactive buttons triggering commands\n');
    stream.markdown('- File references and anchors\n');
    stream.markdown('- Rich markdown (tables, code, formatting)\n\n');
    
    stream.markdown('**❌ Not Supported:**\n');
    stream.markdown('- Embedded iframes\n');
    stream.markdown('- Direct HTML/CSS/JavaScript\n');
    stream.markdown('- Video embedding\n');
    stream.markdown('- Interactive forms\n');
    stream.markdown('- Live web widgets\n\n');
    
    stream.markdown('**🔧 Best Workarounds:**\n');
    stream.markdown('1. **Simple Browser** - For lightweight web content\n');
    stream.markdown('2. **Webview Panels** - For complex interactive content\n');
    stream.markdown('3. **External Browser** - For full web applications\n');
    stream.markdown('4. **Buttons + Commands** - For interactive functionality\n\n');
    
    stream.markdown('✅ **Web Content Demo Complete!**\n\n💡 **Recommendation:** Use buttons to open webviews or Simple Browser for the best user experience with web content.');
    
    return {};
}

async function handleAdvancedFeatures(stream: vscode.ChatResponseStream, token: vscode.CancellationToken, context: vscode.ChatContext) {
    stream.markdown('## 🚀 Advanced Chat Participant Features\n\nDemonstrating advanced capabilities beyond basic progress indicators...\n');
    
    stream.progress('🔍 Loading advanced feature demonstrations...');
    await sleep(1000);
    
    // Feature 1: File Tree Visualization
    stream.markdown('### 🌳 **Feature 1: Interactive File Trees**\n\n');
    stream.markdown('The `filetree()` method creates interactive file/folder visualizations:\n\n');
    
    const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
    let baseUri: vscode.Uri;
    
    if (workspaceFolder) {
        baseUri = workspaceFolder.uri;
        // Create a real file tree based on actual workspace
        const fileTree: vscode.ChatResponseFileTree[] = [
            {
                name: 'Chat Participants Project',
                children: [
                    { name: 'src', children: [
                        { name: 'extension.ts' },
                        { name: 'types.ts' }
                    ]},
                    { name: 'out', children: [
                        { name: 'extension.js' },
                        { name: 'extension.js.map' }
                    ]},
                    { name: 'node_modules', children: [
                        { name: '@types', children: [
                            { name: 'vscode' }
                        ]},
                        { name: 'typescript' }
                    ]},
                    { name: 'package.json' },
                    { name: 'tsconfig.json' },
                    { name: 'README.md' }
                ]
            }
        ];
        stream.filetree(fileTree, baseUri);
    } else {
        // Example file tree
        baseUri = vscode.Uri.file('C:/example/project');
        const exampleTree: vscode.ChatResponseFileTree[] = [
            {
                name: 'Example Project',
                children: [
                    { name: 'src', children: [
                        { name: 'main.ts' },
                        { name: 'utils.ts' },
                        { name: 'components', children: [
                            { name: 'Button.tsx' },
                            { name: 'Modal.tsx' }
                        ]}
                    ]},
                    { name: 'tests', children: [
                        { name: 'main.test.ts' },
                        { name: 'utils.test.ts' }
                    ]},
                    { name: 'package.json' },
                    { name: 'webpack.config.js' }
                ]
            }
        ];
        stream.filetree(exampleTree, baseUri);
    }
    
    stream.markdown('\n💡 **File trees are clickable and navigable!**\n\n');
    
    stream.progress('🔗 Creating smart references...');
    await sleep(800);
    
    // Feature 2: References and Anchors
    stream.markdown('### 📎 **Feature 2: Smart References & Anchors**\n\n');
    
    if (workspaceFolder) {
        const packageJsonUri = vscode.Uri.file(workspaceFolder.uri.fsPath + '/package.json');
        const extensionUri = vscode.Uri.file(workspaceFolder.uri.fsPath + '/src/extension.ts');
        
        stream.markdown('**References** (show file info):  ');
        stream.reference(packageJsonUri, vscode.ThemeIcon.File);
        stream.reference(extensionUri, vscode.ThemeIcon.File);
        
        stream.markdown('\n\n**Anchors** (quick navigation):  ');
        stream.anchor(packageJsonUri, '📦 Jump to Package Config');
        stream.anchor(extensionUri, '⚡ View Extension Code');
        
        // Location-based anchor (specific line)
        const location = new vscode.Location(extensionUri, new vscode.Position(0, 0));
        stream.anchor(location, '🎯 Go to Extension Start');
    } else {
        stream.markdown('*References and anchors would appear here with an open workspace*\n');
    }
    
    stream.markdown('\n\n');
    
    if (token.isCancellationRequested) {
        stream.markdown('⚠️ **Demo was cancelled**');
        return {};
    }
    
    stream.progress('🎯 Adding interactive commands...');
    await sleep(600);
    
    // Feature 3: Command Buttons with Arguments
    stream.markdown('### 🔘 **Feature 3: Advanced Command Buttons**\n\n');
    stream.markdown('Buttons can execute complex VS Code commands with arguments:\n\n');
    
    // Create file button
    stream.button({
        command: 'workbench.action.files.newUntitledFile',
        title: '📄 New File',
        tooltip: 'Create a new untitled file'
    });
    
    // Open specific settings
    stream.button({
        command: 'workbench.action.openSettings',
        title: '⚙️ Editor Settings',
        arguments: ['editor'],
        tooltip: 'Open editor-specific settings'
    });
    
    // Search in files
    stream.button({
        command: 'workbench.action.findInFiles',
        title: '🔍 Search Files',
        arguments: [{ query: 'ChatResponseStream', isRegex: false }],
        tooltip: 'Search for ChatResponseStream in workspace'
    });
    
    // Custom extension command
    stream.button({
        command: 'chat-progress-demo.advancedAction',
        title: '🚀 Custom Action',
        tooltip: 'Execute custom extension command'
    });
    
    stream.markdown('\n\n');
    
    // Feature 4: Context Awareness
    stream.markdown('### 🧠 **Feature 4: Context Awareness**\n\n');
    stream.markdown('Chat participants can access conversation history and context:\n\n');
    
    // Show conversation context
    if (context.history && context.history.length > 0) {
        stream.markdown(`📚 **Conversation History:** ${context.history.length} previous messages\n\n`);
        
        const recentMessages = context.history.slice(-3);
        stream.markdown('**Recent interactions:**\n');
        recentMessages.forEach((turn, index) => {
            if (turn instanceof vscode.ChatRequestTurn) {
                stream.markdown(`${index + 1}. User: "${turn.prompt}"\n`);
            } else if (turn instanceof vscode.ChatResponseTurn) {
                stream.markdown(`${index + 1}. Assistant: Responded with ${turn.response.length} parts\n`);
            }
        });
        stream.markdown('\n');
    } else {
        stream.markdown('📚 **Conversation History:** This is our first interaction!\n\n');
    }
    
    stream.progress('📊 Generating data visualizations...');
    await sleep(800);
    
    // Feature 5: Data Tables and Visualizations
    stream.markdown('### 📊 **Feature 5: Rich Data Presentation**\n\n');
    
    // Performance metrics table
    stream.markdown('**Performance Metrics:**\n\n');
    stream.markdown('| Metric | Simple | Steps | File | Long |\n');
    stream.markdown('|--------|--------|-------|------|------|\n');
    stream.markdown('| Duration | ~10s | ~8s | ~5s | ~15s |\n');
    stream.markdown('| Cancellable | ✅ | ✅ | ✅ | ✅ |\n');
    stream.markdown('| Progress Type | Text | Counter | Percentage | Multi-phase |\n');
    stream.markdown('| Complexity | Low | Medium | Medium | High |\n\n');
    
    // Feature comparison chart (ASCII art)
    stream.markdown('**Feature Usage Chart:**\n\n');
    stream.markdown('```\nProgress Types Used:\n\nSimple   ████████░░ 80%\nSteps    ██████████ 100%\nFile     ████████░░ 85%\nLong     ██████████ 100%\nLinks    ██████░░░░ 60%\nDetails  ████░░░░░░ 40%\nWeb      ███████░░░ 70%\nAdvanced █████████░ 90%\n```\n\n');
    
    if (token.isCancellationRequested) {
        stream.markdown('⚠️ **Demo was cancelled**');
        return {};
    }
    
    stream.progress('🎨 Adding rich content types...');
    await sleep(600);
    
    // Feature 6: Rich Content Types
    stream.markdown('### 🎨 **Feature 6: Rich Content Types**\n\n');
    
    // Code with syntax highlighting
    stream.markdown('**Advanced TypeScript Example:**\n\n');
    stream.markdown('```typescript\n');
    stream.markdown('interface ChatParticipantAdvanced extends vscode.ChatParticipant {\n');
    stream.markdown('  followupProvider?: vscode.ChatFollowupProvider;\n');
    stream.markdown('  iconPath?: vscode.ThemeIcon | vscode.Uri;\n');
    stream.markdown('}\n\n');
    stream.markdown('class AdvancedChatHandler {\n');
    stream.markdown('  async handleRequest(\n');
    stream.markdown('    request: vscode.ChatRequest,\n');
    stream.markdown('    context: vscode.ChatContext,\n');
    stream.markdown('    stream: vscode.ChatResponseStream\n');
    stream.markdown('  ): Promise<vscode.ChatResult> {\n');
    stream.markdown('    // Advanced processing logic\n');
    stream.markdown('    const fileTree = await this.generateFileTree();\n');
    stream.markdown('    stream.filetree(fileTree, workspaceUri);\n');
    stream.markdown('    return { metadata: { success: true } };\n');
    stream.markdown('  }\n');
    stream.markdown('}\n');
    stream.markdown('```\n\n');
    
    // JSON configuration example
    stream.markdown('**Configuration Example:**\n\n');
    stream.markdown('```json\n');
    stream.markdown('{\n');
    stream.markdown('  "chatParticipant": {\n');
    stream.markdown('    "id": "advanced-demo",\n');
    stream.markdown('    "name": "Advanced Demo",\n');
    stream.markdown('    "features": {\n');
    stream.markdown('      "fileTrees": true,\n');
    stream.markdown('      "references": true,\n');
    stream.markdown('      "commands": true,\n');
    stream.markdown('      "contextAware": true,\n');
    stream.markdown('      "richContent": true\n');
    stream.markdown('    },\n');
    stream.markdown('    "permissions": ["workspace.read", "commands.execute"]\n');
    stream.markdown('  }\n');
    stream.markdown('}\n');
    stream.markdown('```\n\n');
    
    // Feature 7: Error Handling and Metadata
    stream.markdown('### ⚠️ **Feature 7: Advanced Error Handling**\n\n');
    
    stream.markdown('**Structured Error Responses:**\n\n');
    stream.markdown('```typescript\n');
    stream.markdown('// Return detailed error information\n');
    stream.markdown('return {\n');
    stream.markdown('  errorDetails: {\n');
    stream.markdown('    message: "Specific error description",\n');
    stream.markdown('    // Additional error context\n');
    stream.markdown('  },\n');
    stream.markdown('  metadata: {\n');
    stream.markdown('    executionTime: Date.now() - startTime,\n');
    stream.markdown('    featuresUsed: ["filetree", "references"],\n');
    stream.markdown('    success: false\n');
    stream.markdown('  }\n');
    stream.markdown('};\n');
    stream.markdown('```\n\n');
    
    stream.markdown('### 🏆 **Summary of Advanced Features:**\n\n');
    stream.markdown('✅ **Interactive File Trees** - Navigable project structure\n');
    stream.markdown('✅ **Smart References** - File and location linking\n');
    stream.markdown('✅ **Advanced Commands** - Buttons with arguments\n');
    stream.markdown('✅ **Context Awareness** - Conversation history access\n');
    stream.markdown('✅ **Rich Data Tables** - Formatted information display\n');
    stream.markdown('✅ **Syntax Highlighting** - Code examples with proper formatting\n');
    stream.markdown('✅ **Error Handling** - Structured error responses with metadata\n\n');
    
    stream.markdown('🎯 **Next Steps:**\n');
    stream.markdown('- Try clicking the file tree items above\n');
    stream.markdown('- Use the reference links to navigate files\n');
    stream.markdown('- Click the command buttons to see VS Code actions\n');
    stream.markdown('- Check out the other demo commands for specific features\n\n');
    
    stream.markdown('✅ **Advanced Features Demo Complete!**\n\n💡 These features make chat participants powerful tools for interactive development assistance.');
    
    // Return metadata about this execution
    return {
        metadata: {
            featuresDemo: ['filetree', 'references', 'anchors', 'commands', 'context', 'tables', 'code'],
            executionTime: '~8 seconds',
            interactiveElements: 7,
            success: true
        }
    };
}

async function handleNativeProgressDemo(stream: vscode.ChatResponseStream, token: vscode.CancellationToken) {
    stream.markdown('## 🔄 Native VS Code Progress Indicators\n\nBeyond chat participant progress, VS Code offers powerful native progress indicators:\n\n');
    
    stream.progress('📋 Preparing native progress demos...');
    await sleep(1000);
    
    // Overview of native progress types
    stream.markdown('### 🎯 **Native Progress Types Available:**\n\n');
    stream.markdown('| Location | Supports Cancel | Supports Discrete | Supports Icons | Use Case |\n');
    stream.markdown('|----------|----------------|-------------------|----------------|----------|\n');
    stream.markdown('| **Notification** | ✅ Yes | ✅ Yes | ❌ No | Long operations |\n');
    stream.markdown('| **Status Bar** | ❌ No | ❌ No | ✅ Yes | Background tasks |\n');
    stream.markdown('| **Source Control** | ❌ No | ❌ No | ❌ No | SCM operations |\n');
    stream.markdown('| **Custom View** | ❌ No | ❌ No | ❌ No | View-specific |\n\n');
    
    // Demo buttons for each type
    stream.markdown('### 🚀 **Interactive Demos** (Click to Try):\n\n');
    
    // Notification Progress Demo
    stream.button({
        command: 'chat-progress-demo.notificationProgress',
        title: '🔔 Notification Progress',
        tooltip: 'Shows progress as a notification with cancel button'
    });
    
    stream.button({
        command: 'chat-progress-demo.statusBarProgress',
        title: '📊 Status Bar Progress',
        tooltip: 'Shows progress in the status bar with icon'
    });
    
    stream.button({
        command: 'chat-progress-demo.discreteProgress',
        title: '📈 Discrete Progress',
        tooltip: 'Shows percentage-based progress (0-100%)'
    });
    
    stream.button({
        command: 'chat-progress-demo.combinedProgress',
        title: '🎭 Combined Progress',
        tooltip: 'Shows multiple progress indicators simultaneously'
    });
    
    stream.markdown('\n\n');
    
    stream.progress('💡 Creating implementation examples...');
    await sleep(800);
    
    // Implementation examples
    stream.markdown('### 💻 **Implementation Examples:**\n\n');
    
    stream.markdown('#### 🔔 **1. Notification Progress (Most Feature-Rich)**\n\n');
    stream.markdown('```typescript\n');
    stream.markdown('vscode.window.withProgress({\n');
    stream.markdown('  location: vscode.ProgressLocation.Notification,\n');
    stream.markdown('  title: "Processing Files",\n');
    stream.markdown('  cancellable: true\n');
    stream.markdown('}, async (progress, token) => {\n');
    stream.markdown('  // Discrete progress (0-100%)\n');
    stream.markdown('  for (let i = 0; i <= 100; i += 10) {\n');
    stream.markdown('    if (token.isCancellationRequested) {\n');
    stream.markdown('      throw new Error("Cancelled by user");\n');
    stream.markdown('    }\n');
    stream.markdown('    \n');
    stream.markdown('    progress.report({\n');
    stream.markdown('      increment: 10,\n');
    stream.markdown('      message: \\`Processing step \\${i/10 + 1}/10\\`\n');
    stream.markdown('    });\n');
    stream.markdown('    \n');
    stream.markdown('    await new Promise(resolve => setTimeout(resolve, 500));\n');
    stream.markdown('  }\n');
    stream.markdown('});\n');
    stream.markdown('```\n\n');
    
    stream.markdown('#### 📊 **2. Status Bar Progress (Subtle Background)**\n\n');
    stream.markdown('```typescript\n');
    stream.markdown('vscode.window.withProgress({\n');
    stream.markdown('  location: vscode.ProgressLocation.Window,\n');
    stream.markdown('  title: "$(sync~spin) Syncing workspace..."\n');
    stream.markdown('}, async (progress, token) => {\n');
    stream.markdown('  // Indeterminate progress with icon\n');
    stream.markdown('  progress.report({ message: "Connecting..." });\n');
    stream.markdown('  await connectToService();\n');
    stream.markdown('  \n');
    stream.markdown('  progress.report({ message: "Downloading..." });\n');
    stream.markdown('  await downloadData();\n');
    stream.markdown('  \n');
    stream.markdown('  progress.report({ message: "Finalizing..." });\n');
    stream.markdown('  await cleanup();\n');
    stream.markdown('});\n');
    stream.markdown('```\n\n');
    
    if (token.isCancellationRequested) {
        stream.markdown('⚠️ **Demo was cancelled**');
        return {};
    }
    
    stream.markdown('### 🏆 **Best Practices Summary:**\n\n');
    stream.markdown('✅ **Use Notification Progress** for:\n');
    stream.markdown('- Long-running operations (>5 seconds)\n');
    stream.markdown('- Operations that need cancellation\n');
    stream.markdown('- Discrete progress tracking (0-100%)\n\n');
    
    stream.markdown('✅ **Use Status Bar Progress** for:\n');
    stream.markdown('- Background operations\n');
    stream.markdown('- Quick tasks that don\'t need user attention\n');
    stream.markdown('- Operations with nice icons/branding\n\n');
    
    stream.markdown('✅ **Use Chat Progress** for:\n');
    stream.markdown('- Conversational context\n');
    stream.markdown('- Step-by-step explanations\n');
    stream.markdown('- Educational/demo purposes\n');
    stream.markdown('- Progress that\'s part of the response content\n\n');
    
    stream.markdown('✅ **Native Progress Demo Complete!**\n\n💡 **Try the buttons above** to see each progress type in action!');
    
    return {};
}

async function handleInteractiveDemo(stream: vscode.ChatResponseStream, token: vscode.CancellationToken, context: vscode.ChatContext) {
    stream.markdown('## 🎯 Interactive Chat Features Demo\n\nDemonstrating advanced interactive capabilities and UX patterns...\n');
    
    stream.progress('🚀 Loading interactive features...');
    await sleep(1000);
    
    // Feature 1: Advanced Followup Patterns
    stream.markdown('### 🔄 **Feature 1: Smart Followup Suggestions**\n\n');
    stream.markdown('Followup providers can create **context-aware suggestions** based on:\n\n');
    
    stream.markdown('- **Previous commands** executed\n');
    stream.markdown('- **Result metadata** from responses\n');
    stream.markdown('- **Conversation history** and context\n');
    stream.markdown('- **Dynamic user preferences**\n\n');
    
    stream.markdown('```typescript\n');
    stream.markdown('participant.followupProvider = {\n');
    stream.markdown('  provideFollowups(result, context, token) {\n');
    stream.markdown('    const followups = [];\n');
    stream.markdown('    \n');
    stream.markdown('    // Context-aware suggestions\n');
    stream.markdown('    if (result.metadata?.lastCommand === "simple") {\n');
    stream.markdown('      followups.push({\n');
    stream.markdown('        prompt: "Show advanced progress",\n');
    stream.markdown('        label: "🚀 Next Level",\n');
    stream.markdown('        command: "advanced"\n');
    stream.markdown('      });\n');
    stream.markdown('    }\n');
    stream.markdown('    \n');
    stream.markdown('    return followups;\n');
    stream.markdown('  }\n');
    stream.markdown('};\n');
    stream.markdown('```\n\n');
    
    // Show current context
    stream.markdown('**📊 Current Conversation Context:**\n\n');
    if (context.history && context.history.length > 0) {
        stream.markdown(`- **History Length:** ${context.history.length} interactions\n`);
        stream.markdown(`- **Recent Commands:** ${getRecentCommands(context.history).join(', ')}\n\n`);
    } else {
        stream.markdown('- **History:** This is our first interaction!\n\n');
    }
    
    stream.progress('🎨 Creating interactive workflows...');
    await sleep(800);
    
    // Feature 2: Multi-Step Workflows
    stream.markdown('### 🔗 **Feature 2: Multi-Step Interactive Workflows**\n\n');
    stream.markdown('Create **guided experiences** with chained interactions:\n\n');
    
    // Workflow buttons
    stream.button({
        command: 'chat-progress-demo.startWorkflow',
        title: '🎬 Start Guided Workflow',
        tooltip: 'Begin a multi-step interactive process'
    });
    
    stream.button({
        command: 'chat-progress-demo.quickSetup',
        title: '⚡ Quick Setup Wizard',
        tooltip: 'Fast configuration workflow'
    });
    
    stream.button({
        command: 'chat-progress-demo.troubleshoot',
        title: '🔧 Troubleshooting Guide',
        tooltip: 'Interactive problem solving'
    });
    
    stream.markdown('\n\n**Workflow Pattern:**\n\n');
    stream.markdown('```typescript\n');
    stream.markdown('// Step 1: Initial command\n');
    stream.markdown('if (step === 1) {\n');
    stream.markdown('  stream.markdown("Choose your setup type:");\n');
    stream.markdown('  stream.button({ command: "setup.basic", title: "Basic" });\n');
    stream.markdown('  stream.button({ command: "setup.advanced", title: "Advanced" });\n');
    stream.markdown('  return { metadata: { nextStep: 2, workflow: "setup" } };\n');
    stream.markdown('}\n');
    stream.markdown('\n');
    stream.markdown('// Step 2: Configuration based on choice\n');
    stream.markdown('if (step === 2 && workflow === "setup") {\n');
    stream.markdown('  // Continue workflow...\n');
    stream.markdown('}\n');
    stream.markdown('```\n\n');
    
    if (token.isCancellationRequested) {
        stream.markdown('⚠️ **Demo was cancelled**');
        return {};
    }
    
    stream.progress('📋 Adding dynamic content generation...');
    await sleep(600);
    
    // Feature 3: Dynamic Content Generation
    stream.markdown('### 🤖 **Feature 3: Dynamic Content Generation**\n\n');
    stream.markdown('Generate **personalized content** based on:\n\n');
    
    // Get workspace info for personalization
    const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
    if (workspaceFolder) {
        stream.markdown(`**🏠 Current Workspace:** \`${workspaceFolder.name}\`\n\n`);
        stream.markdown('**📁 Detected Project Type:** TypeScript Extension\n\n');
        stream.markdown('**🎯 Suggested Actions for Your Project:**\n\n');
        
        // Project-specific suggestions
        stream.button({
            command: 'workbench.action.tasks.runTask',
            title: '🔨 Build Project',
            arguments: ['npm: compile'],
            tooltip: 'Build the TypeScript project'
        });
        
        stream.button({
            command: 'extension.test',
            title: '🧪 Run Tests',
            tooltip: 'Execute project tests'
        });
        
        stream.button({
            command: 'workbench.action.debug.start',
            title: '🐛 Debug Extension',
            tooltip: 'Start debugging the extension'
        });
        
        stream.markdown('\n\n');
    } else {
        stream.markdown('**📂 No workspace detected** - Open a project for personalized suggestions!\n\n');
    }
    
    // Feature 4: Real-time Adaptation
    stream.markdown('### ⚡ **Feature 4: Real-time Adaptation**\n\n');
    stream.markdown('Adapt responses based on **user behavior patterns**:\n\n');
    
    const currentTime = new Date();
    const timeOfDay = currentTime.getHours();
    let greeting, suggestion;
    
    if (timeOfDay < 12) {
        greeting = 'Good morning! 🌅';
        suggestion = 'Start your day with some productivity tips?';
    } else if (timeOfDay < 17) {
        greeting = 'Good afternoon! ☀️';
        suggestion = 'Need help with your current task?';
    } else {
        greeting = 'Good evening! 🌙';
        suggestion = 'Wrapping up for the day? Let me help optimize your workflow.';
    }
    
    stream.markdown(`**⏰ Time-aware Greeting:** ${greeting}\n\n`);
    stream.markdown(`**💡 Contextual Suggestion:** ${suggestion}\n\n`);
    
    stream.markdown('```typescript\n');
    stream.markdown('// Adaptive behavior example\n');
    stream.markdown('const userPattern = analyzeUserHistory(context.history);\n');
    stream.markdown('const timeContext = getTimeOfDay();\n');
    stream.markdown('const workspaceContext = getWorkspaceInfo();\n');
    stream.markdown('\n');
    stream.markdown('if (userPattern.prefersDetailedExplanations) {\n');
    stream.markdown('  stream.markdown("## Detailed Step-by-Step Guide");\n');
    stream.markdown('} else {\n');
    stream.markdown('  stream.markdown("## Quick Summary");\n');
    stream.markdown('}\n');
    stream.markdown('```\n\n');
    
    stream.progress('🎪 Creating rich interactions...');
    await sleep(600);
    
    // Feature 5: Rich Interactive Elements
    stream.markdown('### 🎪 **Feature 5: Rich Interactive Combinations**\n\n');
    stream.markdown('Combine multiple features for **rich user experiences**:\n\n');
    
    // Interactive file explorer
    if (workspaceFolder) {
        const interactiveTree: vscode.ChatResponseFileTree[] = [
            {
                name: '🎯 Interactive Project Explorer',
                children: [
                    { name: '📝 Click to edit → package.json' },
                    { name: '⚡ Run demo → src/extension.ts' },
                    { name: '🔧 Configure → tsconfig.json' },
                    { name: '📖 View docs → README.md' }
                ]
            }
        ];
        stream.filetree(interactiveTree, workspaceFolder.uri);
        stream.markdown('\n**💡 Each item above is clickable and context-aware!**\n\n');
    }
    
    // Multi-modal interaction example
    stream.markdown('**🎯 Multi-Modal Interaction Example:**\n\n');
    
    // Progress + File Tree + Buttons + References
    stream.progress('Analyzing project structure...');
    await sleep(400);
    
    stream.markdown('**Analysis Results:**\n\n');
    stream.markdown('| Component | Status | Action |\n');
    stream.markdown('|-----------|--------|--------|\n');
    stream.markdown('| Dependencies | ✅ Up to date | - |\n');
    stream.markdown('| TypeScript | ✅ Configured | [View Config](tsconfig.json) |\n');
    stream.markdown('| Extension | 🔄 Development | [Test Now](#test) |\n');
    stream.markdown('| Documentation | ⚠️ Needs update | [Edit README](README.md) |\n\n');
    
    // Action buttons based on analysis
    stream.button({
        command: 'workbench.action.files.openFile',
        title: '📝 Update Documentation',
        arguments: [vscode.Uri.file(workspaceFolder?.uri.fsPath + '/README.md')],
        tooltip: 'Open README.md for editing'
    });
    
    stream.button({
        command: 'workbench.action.debug.start',
        title: '🧪 Test Extension',
        tooltip: 'Launch Extension Development Host'
    });
    
    stream.markdown('\n\n');
    
    if (token.isCancellationRequested) {
        stream.markdown('⚠️ **Demo was cancelled**');
        return {};
    }
    
    // Feature 6: Error Recovery and Suggestions
    stream.markdown('### 🚑 **Feature 6: Intelligent Error Recovery**\n\n');
    stream.markdown('Provide **helpful recovery suggestions** when things go wrong:\n\n');
    
    stream.markdown('```typescript\n');
    stream.markdown('try {\n');
    stream.markdown('  await riskyOperation();\n');
    stream.markdown('} catch (error) {\n');
    stream.markdown('  // Intelligent error handling\n');
    stream.markdown('  if (error.code === "ENOENT") {\n');
    stream.markdown('    stream.markdown("File not found. Try:");\n');
    stream.markdown('    stream.button({\n');
    stream.markdown('      command: "workbench.action.files.newUntitledFile",\n');
    stream.markdown('      title: "📄 Create New File"\n');
    stream.markdown('    });\n');
    stream.markdown('  }\n');
    stream.markdown('  \n');
    stream.markdown('  return {\n');
    stream.markdown('    errorDetails: { message: error.message },\n');
    stream.markdown('    metadata: { \n');
    stream.markdown('      errorType: error.code,\n');
    stream.markdown('      suggestedActions: ["create-file", "check-permissions"]\n');
    stream.markdown('    }\n');
    stream.markdown('  };\n');
    stream.markdown('}\n');
    stream.markdown('```\n\n');
    
    // Simulate an error recovery scenario
    stream.markdown('**🔧 Example Error Recovery Scenario:**\n\n');
    stream.markdown('> ❌ **Simulated Error:** Could not compile TypeScript\n>\n> **💡 Suggested Solutions:**\n');
    
    stream.button({
        command: 'typescript.reloadProjects',
        title: '🔄 Reload TypeScript',
        tooltip: 'Reload TypeScript language service'
    });
    
    stream.button({
        command: 'workbench.action.problems.focus',
        title: '🔍 View Problems',
        tooltip: 'Open Problems panel to see specific errors'
    });
    
    stream.button({
        command: 'workbench.action.terminal.new',
        title: '💻 Open Terminal',
        tooltip: 'Run npx tsc for detailed error info'
    });
    
    stream.markdown('\n\n### 🏆 **Interactive Features Summary:**\n\n');
    stream.markdown('✅ **Smart Followup Suggestions** - Context-aware next actions\n');
    stream.markdown('✅ **Multi-Step Workflows** - Guided interactive processes\n');
    stream.markdown('✅ **Dynamic Content** - Personalized based on context\n');
    stream.markdown('✅ **Real-time Adaptation** - Time and behavior-aware responses\n');
    stream.markdown('✅ **Rich Combinations** - Multiple interactive elements together\n');
    stream.markdown('✅ **Error Recovery** - Intelligent suggestions when things fail\n\n');
    
    stream.markdown('🎯 **Best Practices:**\n');
    stream.markdown('- **Always provide clear next steps** via followups\n');
    stream.markdown('- **Adapt to user context** (time, workspace, history)\n');
    stream.markdown('- **Combine multiple interaction types** for rich UX\n');
    stream.markdown('- **Handle errors gracefully** with actionable suggestions\n');
    stream.markdown('- **Make everything clickable** where possible\n\n');
    
    stream.markdown('✅ **Interactive Demo Complete!**\n\n💡 **Notice the smart followup suggestions** that will appear below based on this interaction!');
    
    // Return rich metadata for followup provider
    return {
        metadata: {
            lastCommand: 'interactive',
            interactionType: 'demo',
            featuresShown: ['followups', 'workflows', 'dynamic-content', 'adaptation', 'error-recovery'],
            userEngagement: 'high',
            suggestedNext: ['native', 'advanced', 'full-demo']
        }
    };
}

// Helper function to extract recent commands from history
function getRecentCommands(history: readonly (vscode.ChatRequestTurn | vscode.ChatResponseTurn)[]): string[] {
    return history
        .filter(turn => turn instanceof vscode.ChatRequestTurn)
        .slice(-3)
        .map(turn => {
            const prompt = (turn as vscode.ChatRequestTurn).prompt.toLowerCase();
            if (prompt.includes('simple')) return 'simple';
            if (prompt.includes('advanced')) return 'advanced';
            if (prompt.includes('native')) return 'native';
            if (prompt.includes('interactive')) return 'interactive';
            return 'other';
        });
}

async function showHelp(stream: vscode.ChatResponseStream) {
    stream.markdown(`# 📊 Progress Demo Chat Participant

This chat participant demonstrates various types of progress indicators in VS Code chat.

## Available Commands:

### \`@progress /simple\`
Shows a basic progress indicator with text updates.

### \`@progress /steps\`
Demonstrates step-by-step progress with individual completion markers.

### \`@progress /file\`
Simulates file processing with percentage-based progress tracking.

### \`@progress /long\`
Shows a complex multi-phase operation with detailed progress reporting.

### \`@progress /links\`
Demonstrates creating clickable file links with custom titles in markdown.

### \`@progress /details\`
Shows alternatives to collapsible sections (since HTML details don't work).

### \`@progress /web\`
Demonstrates web content capabilities and workarounds in chat.

### \`@progress /advanced\`
Showcases advanced chat participant features like file trees and references.

### \`@progress /native\`
Demonstrates VS Code's native progress indicators beyond chat progress.

### \`@progress /interactive\`
Advanced interactive features and sophisticated UX patterns.

## Usage Examples:
- \`@progress /simple\` - Run a simple task
- \`@progress /steps\` - Execute multi-step process
- \`@progress /file\` - Process multiple files
- \`@progress /long\` - Run complex long operation
- \`@progress /links\` - Show file link examples
- \`@progress /details\` - Alternatives to collapsible content
- \`@progress /web\` - Web content options and workarounds
- \`@progress /advanced\` - Advanced features showcase
- \`@progress /native\` - Native VS Code progress indicators
- \`@progress /interactive\` - Advanced interactive features and UX patterns

## 🛠️ Copilot Agent Mode Tools

This extension also provides **Language Model Tools** for Copilot agent mode:
- Ask about "tools" or "agent mode" to see tool documentation
- Copilot can automatically use these tools for progress demonstrations
- Tools include: simple progress, file processing, workspace analysis, task runner, and interactive wizard

Try any of these commands to see different progress indicator patterns in action! 🎯`);
    
    return {};
}

async function showToolsHelp(stream: vscode.ChatResponseStream) {
    stream.markdown(`# 🛠️ Progress Demo Tools for Copilot Agent Mode

This extension provides several **Language Model Tools** that can be used by Copilot in agent mode to demonstrate various progress tracking patterns.

## Available Tools:

### 🔄 **progress-demo-simple**
Demonstrates simple progress indicators with configurable duration and steps.

**Input Schema:**
\`\`\`json
{
  "duration": 5000,     // Total duration in milliseconds (optional, default: 5000)
  "steps": 3,           // Number of steps to show (optional, default: 3)
  "message": "Processing task"  // Custom message (optional)
}
\`\`\`

### 📁 **progress-demo-file-processor**
Simulates file processing operations with progress tracking.

**Input Schema:**
\`\`\`json
{
  "fileCount": 8,       // Number of files to process (optional, default: 8)
  "fileTypes": [".js", ".ts", ".json"],  // File extensions (optional)
  "processingTime": 3000,  // Total processing time in ms (optional, default: 3000)
  "showProgress": true  // Show percentage progress (optional, default: true)
}
\`\`\`

### 🔍 **progress-demo-workspace-analyzer**
Analyzes workspace structure and files with step-by-step progress reporting.

**Input Schema:**
\`\`\`json
{
  "deep": true,         // Deep analysis (optional, default: true)
  "includeHidden": false,  // Include hidden files (optional, default: false)
  "fileTypes": [".ts", ".js"]  // Specific file types to analyze (optional)
}
\`\`\`

### 🚀 **progress-demo-task-runner**
Executes multi-phase tasks with detailed progress and cancellation support.

**Input Schema:**
\`\`\`json
{
  "phases": ["Setup", "Processing", "Validation", "Completion"],  // Custom phases (optional)
  "totalDuration": 8000,  // Total duration in ms (optional, default: 8000)
  "allowCancellation": true,  // Allow cancellation (optional, default: true)
  "showDetails": true   // Show detailed sub-steps (optional, default: true)
}
\`\`\`

### 🧙‍♂️ **progress-demo-interactive-wizard**
Runs interactive setup wizards with progress tracking and user choices.

**Input Schema:**
\`\`\`json
{
  "wizardType": "Setup Wizard",  // Name of the wizard (optional)
  "steps": 5,           // Number of wizard steps (optional, default: 5)
  "includeChoices": true,  // Include simulated choices (optional, default: true)
  "autoAdvance": true   // Auto-advance between steps (optional, default: true)
}
\`\`\`

## 🤖 Usage in Copilot Agent Mode

These tools are automatically available to Copilot when this extension is installed. Copilot can:

1. **Automatically select** the appropriate tool based on user requests
2. **Configure parameters** based on context and user preferences  
3. **Chain multiple tools** for complex workflows
4. **Handle cancellation** and error scenarios gracefully

## 💡 Example Agent Requests

Here are some example requests that would trigger these tools:

- *"Show me a simple progress demo with 5 steps"* → **progress-demo-simple**
- *"Process 10 files and show progress"* → **progress-demo-file-processor**  
- *"Analyze my workspace structure"* → **progress-demo-workspace-analyzer**
- *"Run a multi-phase task with custom phases"* → **progress-demo-task-runner**
- *"Walk me through an interactive setup"* → **progress-demo-interactive-wizard**

## 🔧 Integration Benefits

✅ **Seamless Progress Tracking** - All tools provide detailed progress updates  
✅ **Cancellation Support** - Users can stop long-running operations  
✅ **Flexible Configuration** - Tools adapt to different use cases  
✅ **Rich Output** - Formatted markdown with emojis and structure  
✅ **Real Workspace Integration** - Some tools work with actual VS Code workspace  

Try asking Copilot to use these tools for demonstrations! 🎯`);
    
    return {};
}

function sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export function deactivate() {}
