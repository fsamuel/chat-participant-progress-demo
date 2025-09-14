# Usage Examples

This document provides detailed examples of how to use the Chat Participant Progress Demo extension.

## Quick Start

1. **Launch Extension**: Press `F5` in VS Code to start Extension Development Host
2. **Check Activation**: You should see "Progress Demo Extension Activated!" message
3. **Open VS Code Chat**: Press `Ctrl+Alt+I` (Windows/Linux) or `Cmd+Alt+I` (Mac)
4. **Start the participant**: Type `@progress` 
5. **Get help**: Just type `@progress` without any command to see available options

## Troubleshooting

### "Language model unavailable" Error
This means the chat participant isn't being recognized. Check:
- Extension activated properly (you should see activation message)
- VS Code version is 1.90.0 or newer
- Chat participant appears in chat suggestions when typing `@`

### Commands Run Too Fast
If you see instant results without progress indicators:
- Try `@progress /slow` first (designed to be very visible)
- Check Developer Console (`Help > Toggle Developer Tools`) for errors
- Make sure you're using `@progress` not just `progress`

## Command Examples

### Simple Progress Demo
```
@progress /simple
```
**What it does**: Shows a basic progress indicator that updates with descriptive text as the task progresses.

**Output Example**:
```
## Simple Progress Demo

Starting a simple task...

[Progress: Initializing...]
[Progress: Processing data...]
[Progress: Finalizing...]

✅ Task completed successfully!

This demonstrated a simple progress indicator with text updates.
```

### Step-by-Step Progress Demo
```
@progress /steps
```
**What it does**: Executes a multi-step process, showing progress for each individual step with completion checkmarks.

**Output Example**:
```
## Step-by-Step Progress Demo

Executing multi-step process...

[Progress: Step 1/6: Validating input parameters]
- ✓ Validating input parameters

[Progress: Step 2/6: Connecting to external service]
- ✓ Connecting to external service

...and so on for all 6 steps

🎉 All steps completed successfully!

This showed progress with specific step indicators.
```

### File Processing Demo
```
@progress /file
```
**What it does**: Simulates processing multiple files with percentage-based progress tracking.

**Output Example**:
```
## File Processing Progress Demo

Simulating file processing with progress tracking...

Processing 8 files:

[Progress: Processing config.json (13%)]
- 📁 config.json ✓

[Progress: Processing data.csv (25%)]
- 📁 data.csv ✓

...continues for all files

📊 File processing complete!

This demonstrated progress tracking with percentage completion.
```

### Long-Running Task Demo
```
@progress /long
```
**What it does**: Shows a complex multi-phase operation with detailed progress reporting across different phases.

### Ultra-Slow Demo
```
@progress /slow
```
**What it does**: 🐌 Runs VERY slowly (30 seconds total) to ensure progress indicators are clearly visible. **Try this first!**

**Output Example**:
```
## Long-Running Task Demo

Simulating a complex operation with detailed progress...

[Progress: Setting up environment...]
🔧 Phase 1: Setup Complete

Phase 2: Data Collection
[Progress: Collecting batch 1/5...]
- Batch 1 collected (847 records)

...continues through all phases

🚀 Long-running task completed successfully!

Summary:
- Total processing time: ~15 seconds
- Data batches processed: 5
- Analysis steps completed: 4
- Status: Success ✅
```

## Progress Indicator Types

### 1. Indeterminate Progress
- Shows activity without specific completion percentage
- Good for tasks where duration is unknown
- Uses descriptive text to show current activity

### 2. Determinate Progress
- Shows specific completion percentage or step count
- Good for batch operations or multi-step processes
- Provides clear indication of remaining work

### 3. Multi-Phase Progress
- Organizes long operations into logical phases
- Each phase can have its own progress tracking
- Helps users understand complex workflows

## Cancellation Support

All demos support cancellation via the VS Code chat interface. When a user cancels:
- The operation stops gracefully
- A cancellation message is displayed
- Resources are properly cleaned up

## Best Practices Demonstrated

1. **Clear Progress Messages**: Use descriptive text that explains what's happening
2. **Appropriate Granularity**: Don't update progress too frequently or too rarely
3. **Visual Feedback**: Combine progress indicators with markdown for rich output
4. **Graceful Cancellation**: Always check for cancellation tokens
5. **Error Handling**: Wrap operations in try-catch blocks
6. **User-Friendly Output**: Use emojis and formatting for better readability

## Integration Tips

- Use `stream.progress()` for ongoing status updates
- Use `stream.markdown()` for formatted output and results
- Check `token.isCancellationRequested` regularly in loops
- Provide meaningful error messages when operations fail
- Consider breaking long operations into smaller, reportable chunks
