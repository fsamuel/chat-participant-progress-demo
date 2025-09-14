<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

This is a VS Code extension project. Please use the get_vscode_api with a query as input to fetch the latest VS Code API references.

## Project Context
This extension demonstrates chat participants with various progress indicators including:
- Simple indeterminate progress
- Step-by-step progress tracking
- File processing with percentage completion
- Multi-phase long-running operations

## Key APIs Used
- vscode.chat.createChatParticipant() for chat participant registration
- ChatResponseStream.progress() for progress indicators
- ChatResponseStream.markdown() for formatted output
- CancellationToken for handling user cancellation

## Development Notes
- All progress demos should be cancellable
- Use descriptive progress messages
- Combine progress indicators with markdown output for rich UX
- Handle errors gracefully with try-catch blocks
