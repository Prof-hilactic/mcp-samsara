# 🚀 START HERE - Use This MCP RIGHT NOW!

You can be using this in **2 minutes**. Here's how:

## Option 1: Automated Install (Recommended)

```bash
# Extract the tarball
cd ~/Downloads
tar -xzf mcp-samsara-v1.0.0-beta.1.tar.gz
cd mcp-samsara

# Run the installer
./install.sh

# Follow the prompts:
# 1. Enter your Samsara API token
# 2. Choose platform (Claude Desktop / Claude Code / Both)
# 3. Done!
```

**Then restart Claude Desktop (if you chose it) and start using it!**

---

## Option 2: Manual Install (Claude Desktop)

If you want to do it manually:

### Step 1: Extract & Build
```bash
cd ~/Downloads
tar -xzf mcp-samsara-v1.0.0-beta.1.tar.gz
cd mcp-samsara
npm install
```

### Step 2: Get Your Samsara Token
1. Go to https://cloud.samsara.com
2. Settings → Organization → API Tokens
3. Create new token
4. Copy it!

### Step 3: Configure Claude Desktop

**macOS:** Edit `~/Library/Application Support/Claude/claude_desktop_config.json`

**Windows:** Edit `%APPDATA%\Claude\claude_desktop_config.json`

Add this (create file if it doesn't exist):

```json
{
  "mcpServers": {
    "samsara": {
      "command": "node",
      "args": ["/Users/YOUR_USERNAME/Downloads/mcp-samsara/build/index.js"],
      "env": {
        "SAMSARA_API_TOKEN": "paste-your-token-here",
        "SAMSARA_BASE_URL": "https://api.samsara.com"
      }
    }
  }
}
```

**CHANGE:**
- `/Users/YOUR_USERNAME/Downloads/mcp-samsara` → Your actual path
- `paste-your-token-here` → Your Samsara token

### Step 4: Restart Claude

**Completely quit** Claude Desktop (not just close window)
Reopen it.

### Step 5: Test It!

Open Claude and say:
```
List all my Samsara vehicles
```

✅ **IT WORKS!**

---

## Option 3: Claude Code / Antigravity

```bash
# Extract
cd ~/Downloads
tar -xzf mcp-samsara-v1.0.0-beta.1.tar.gz

# Copy to MCP directory
mkdir -p ~/.claude/mcp-servers
cp -r mcp-samsara ~/.claude/mcp-servers/samsara

# Create config
cat > ~/.claude/mcp-servers/samsara/config.json << 'EOF'
{
  "command": "node",
  "args": ["build/index.js"],
  "env": {
    "SAMSARA_API_TOKEN": "YOUR_TOKEN_HERE",
    "SAMSARA_BASE_URL": "https://api.samsara.com"
  }
}
EOF

# Edit the config to add your real token:
nano ~/.claude/mcp-servers/samsara/config.json
```

**Then launch Claude Code or Antigravity - it auto-loads!**

---

## ⚡ Quick Troubleshooting

**"Tools not showing up"**
- Did you restart Claude Desktop completely? (Quit and reopen)
- Check config file syntax (use JSONLint.com)
- Verify path is absolute (no ~, full path)

**"401 Unauthorized"**
- Token is wrong - get a new one from Samsara dashboard

**"Cannot find module"**
- Run `npm install` in the mcp-samsara directory

---

## 🎯 First Things to Try

Once it's working:

**See your fleet:**
```
Show me all my vehicles and their current locations
```

**Create a route:**
```
Create a route called "Morning Deliveries" with stops at:
1. 123 Main St, Charlotte NC
2. 456 Oak Ave, Charlotte NC
3. 789 Pine Rd, Charlotte NC
```

**Check driver compliance:**
```
Get HOS logs for driver [name/ID] for the past week
```

**Set up webhooks:**
```
Create a webhook to https://myapp.com/webhook for route updates
```

---

## 📚 Full Documentation

- **README.md** - Complete feature list & guide
- **QUICKSTART.md** - Detailed setup instructions
- **EXAMPLES.md** - Real-world use cases
- **INSTALL_ALL_PLATFORMS.md** - Platform-specific guides

---

## 🚀 Ready to Publish?

After you've tested it locally:

1. **GitHub:** Follow `GITHUB_SETUP.md`
2. **NPM:** Follow `NPM_SETUP.md`
3. **Announce:** Share on social media!

---

**Questions?** Open an issue or email support@automationsquad.com

**Let's automate some fleet management! 🚚**
