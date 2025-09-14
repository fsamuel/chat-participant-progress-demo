# 🧪 Testing the Progress Demo Tools

This file contains examples and test scenarios for the Copilot Agent Mode tools.

## Quick Test Commands

### For Traditional Chat Participant
```
@progress /simple
@progress /steps  
@progress /file
@progress /long
@progress tools
```

### For Copilot Agent Mode

Try these natural language requests with Copilot:

#### Simple Progress Demo
```
Show me a simple progress demo with 4 steps
Run a basic task that takes 3 seconds
Demonstrate simple progress tracking
```

#### File Processing
```
Process 12 JavaScript files and show progress
Simulate processing 20 files with TypeScript and JSON types
Show me file processing progress for 8 files
```

#### Workspace Analysis  
```
Analyze my current workspace structure
Scan the workspace for TypeScript files
Show me what files are in my project
```

#### Multi-Phase Task Runner
```
Run a 5-phase deployment process
Execute a custom workflow with Setup, Build, Test, Deploy phases
Show me a multi-stage task with detailed steps
```

#### Interactive Wizard
```
Walk me through an interactive setup wizard
Run a 6-step configuration wizard
Show me an interactive installation process
```

## Test Scenarios

### 1. Basic Functionality Test
- **Request**: "Show me a progress demo"
- **Expected**: Copilot selects `progress-demo-simple` with default parameters
- **Verify**: Progress indicator shows and completes successfully

### 2. Parameter Configuration Test
- **Request**: "Process 15 files over 5 seconds" 
- **Expected**: `progress-demo-file-processor` with fileCount=15, processingTime=5000
- **Verify**: Shows 15 file entries with correct timing

### 3. Workspace Integration Test
- **Request**: "Analyze my workspace"
- **Expected**: `progress-demo-workspace-analyzer` scans actual workspace
- **Verify**: Shows real files from current workspace

### 4. Cancellation Test
- **Request**: "Run a long task" then cancel during execution
- **Expected**: Tool respects cancellation token
- **Verify**: Shows cancellation message

### 5. Tool Chaining Test
- **Request**: "First analyze my workspace, then process the TypeScript files"
- **Expected**: Copilot uses multiple tools in sequence
- **Verify**: Both operations complete successfully

## Validation Checklist

- [ ] All 5 tools are registered correctly
- [ ] Tools appear in `vscode.lm.tools` list  
- [ ] Copilot can discover and invoke tools automatically
- [ ] Progress indicators work during tool execution
- [ ] Cancellation is handled gracefully
- [ ] Output is properly formatted with markdown
- [ ] Error handling works for invalid inputs
- [ ] Tools work with both empty and populated workspaces

## Debugging Tips

### Check Tool Registration
```javascript
// In VS Code Developer Tools Console
vscode.lm.tools.map(t => t.name)
// Should include all 5 progress-demo-* tools
```

### Verify Tool Execution
- Watch VS Code Developer Console for tool invocation logs
- Check that `prepareInvocation` shows appropriate messages
- Verify `invoke` method executes without errors

### Test Individual Tools
Use the chat participant commands to test each tool type:
- `@progress /simple` → similar to progress-demo-simple
- `@progress /file` → similar to progress-demo-file-processor
- etc.

## Performance Notes

- Tools use realistic timing delays for demonstration
- Processing times are configurable via input parameters
- Large file counts or long durations may take time to complete
- All operations respect VS Code's cancellation tokens

## Troubleshooting

### Tools Not Appearing
1. Check package.json `languageModelTools` contribution
2. Verify tool registration in `registerProgressTools()`
3. Ensure extension is activated properly

### Copilot Not Using Tools
1. Verify Copilot agent mode is enabled
2. Check that request language matches tool descriptions
3. Try more explicit requests like "use the progress demo tools"

### Progress Not Showing
1. Confirm tools are returning `LanguageModelToolResult`
2. Check that text content includes progress indicators
3. Verify timing delays are appropriate for testing

---

**Happy testing!** 🎯 These tools demonstrate the full range of progress tracking capabilities available in VS Code extensions.
