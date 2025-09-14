# Chat Participant Progress Demo

A VS Code extension that demonstrates how to implement chat participants with various types of progress indicators. **Now enhanced with Copilot Agent Mode support!**

## Features

This extension showcases different progress indicator patterns:

- **Simple Progress**: Basic indeterminate progress with text updates
- **Step Progress**: Multi-step operations with individual completion tracking
- **File Progress**: Percentage-based progress for batch operations
- **Long-running Tasks**: Complex multi-phase operations with detailed reporting
- **🤖 Copilot Agent Mode**: Language Model Tools for automatic progress demonstrations

## Usage

### Traditional Chat Participant Mode
1. Open VS Code Chat (Ctrl+Alt+I or Cmd+Alt+I)
2. Type `@progress` to interact with the progress demo participant
3. Use one of these commands:
   - `@progress /simple` - Simple progress demo
   - `@progress /steps` - Step-by-step progress
   - `@progress /file` - File processing simulation
   - `@progress /long` - Long-running task demo

### 🤖 Copilot Agent Mode (NEW!)
Let Copilot automatically choose and use progress demo tools:
- *"Show me a progress demo with 5 steps"*
- *"Process 10 files and track progress"*
- *"Analyze my workspace structure"*
- *"Run a multi-phase task"*

**See [COPILOT_AGENT_MODE.md](./COPILOT_AGENT_MODE.md) for detailed documentation.**

## Installation & Development

### Prerequisites
- Node.js 16.x or higher
- VS Code 1.74.0 or higher

### Setup
```bash
# Install dependencies
npm install

# Compile TypeScript
npm run compile

# Watch for changes during development
npm run watch
```

### Running the Extension
1. Open this folder in VS Code
2. Press F5 to launch a new Extension Development Host window
3. Open the chat panel and try the `@progress` participant

## Progress Indicator Patterns

### 1. Simple Progress
```typescript
stream.progress('Processing...');
```
Shows indeterminate progress with descriptive text.

### 2. Step-by-Step Progress
```typescript
for (let i = 0; i < steps.length; i++) {
    stream.progress(`Step ${i + 1}/${steps.length}: ${steps[i]}`);
    // ... do work
    stream.markdown(`- ✓ ${steps[i]}\\n`);
}
```
Tracks progress through multiple discrete steps.

### 3. Percentage Progress
```typescript
const progress = Math.round(((i + 1) / total) * 100);
stream.progress(`Processing item ${i + 1} (${progress}%)`);
```
Shows completion percentage for batch operations.

### 4. Multi-Phase Progress
```typescript
// Phase 1
stream.progress('Phase 1: Initialization...');
stream.markdown('🔧 **Phase 1 Complete**\\n');

// Phase 2
stream.progress('Phase 2: Processing...');
stream.markdown('📊 **Phase 2 Complete**\\n');
```
Organizes long operations into logical phases.

## Key Concepts

### Chat Participant API
- **Progress Indicators**: Use `stream.progress()` for ongoing status
- **Markdown Output**: Use `stream.markdown()` for formatted results
- **Cancellation**: Check `token.isCancellationRequested` for user cancellation
- **Error Handling**: Wrap operations in try-catch blocks
- **User Feedback**: Provide clear, descriptive progress messages

### 🤖 Language Model Tools API (NEW!)
- **Tool Registration**: Use `vscode.lm.registerTool()` for Copilot integration
- **Input Schemas**: Define structured input parameters for tools
- **Tool Invocation**: Implement `invoke()` and `prepareInvocation()` methods
- **Rich Results**: Return `LanguageModelToolResult` with formatted content
- **Cancellation Support**: Respect cancellation tokens in tool execution

## API Reference

The extension uses multiple VS Code APIs:

### Chat Participant API
- `vscode.chat.createChatParticipant()` - Register chat participant
- `ChatResponseStream.progress()` - Show progress indicator
- `ChatResponseStream.markdown()` - Output formatted text

### Language Model Tools API
- `vscode.lm.registerTool()` - Register tools for Copilot agent mode
- `LanguageModelTool.invoke()` - Execute tool logic
- `LanguageModelTool.prepareInvocation()` - Pre-execution setup
- `LanguageModelToolResult` - Return structured results
- `ChatResponseStream.markdown()` - Output formatted content
- `CancellationToken` - Handle user cancellation

## Contributing

Feel free to extend this demo with additional progress patterns or improvements!

## License

MIT
