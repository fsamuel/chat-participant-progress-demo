# 🚀 Git Setup Commands for GitHub

After installing Git, run these commands in your project folder:

## 1. Initialize Git Repository
```bash
git init
```

## 2. Add All Files
```bash
git add .
```

## 3. Create Initial Commit
```bash
git commit -m "Initial commit: Chat Participant Progress Demo with Copilot Agent Mode support"
```

## 4. Create GitHub Repository
Go to [GitHub.com](https://github.com) and:
- Click "New repository" 
- Name it: `chat-participant-progress-demo`
- Description: `VS Code extension demonstrating chat participants with progress indicators and Copilot Agent Mode support`
- Make it Public (or Private if you prefer)
- **DO NOT** initialize with README, .gitignore, or license (we already have these)
- Click "Create repository"

## 5. Connect to GitHub Repository
Replace `YOUR_USERNAME` with your actual GitHub username:
```bash
git remote add origin https://github.com/YOUR_USERNAME/chat-participant-progress-demo.git
```

## 6. Push to GitHub
```bash
git branch -M main
git push -u origin main
```

## Alternative: Using SSH (if you have SSH keys set up)
```bash
git remote add origin git@github.com:YOUR_USERNAME/chat-participant-progress-demo.git
git branch -M main
git push -u origin main
```

## 7. Verify Upload
Visit your repository at:
`https://github.com/YOUR_USERNAME/chat-participant-progress-demo`

---

## 📝 Quick Reference for Future Updates

### After making changes:
```bash
git add .
git commit -m "Description of your changes"
git push
```

### Check status:
```bash
git status
```

### View commit history:
```bash
git log --oneline
```
