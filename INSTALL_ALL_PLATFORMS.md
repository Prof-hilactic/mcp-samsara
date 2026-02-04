# Complete Installation Guide
## MCP for Samsara - All Platforms

This guide covers installing the Samsara MCP on:
- ✅ Claude Desktop
- ✅ Claude Code
- ✅ Antigravity
- ✅ Cursor (bonus!)

---

## 🚀 Prerequisites

1. **Samsara API Token**
   - Log into [Samsara Dashboard](https://cloud.samsara.com)
   - Go to Settings → Organization → API Tokens
   - Create new token, copy it
   
2. **Node.js 18+** installed
   ```bash
   node --version  # Should be 18.0.0 or higher
   ```

---

## Method 1: Install from NPM (Easiest)

**Once published to NPM:**

```bash
npm install -g @automation-squad/mcp-samsara
```

Then skip to platform-specific config below!

---

## Method 2: Install from Local Build (Use NOW!)

If NPM isn't published yet, install locally:

```bash
# Extract the tarball
cd ~/Downloads
tar -xzf mcp-samsara-v1.0.0-beta.1.tar.gz
cd mcp-samsara

# Install dependencies
npm install

# Build (already done, but just in case)
npm run build

# Optional: Link globally
npm link
```

---

## 📱 Platform-Specific Configuration

### 1️⃣ CLAUDE DESKTOP

**Config file location:**
- **macOS:** `~/Library/Application Support/Claude/claude_desktop_config.json`
- **Windows:** `%APPDATA%\Claude\claude_desktop_config.json`

**From NPM:**
```json
{
  "mcpServers": {
    "samsara": {
      "command": "npx",
      "args": ["-y", "@automation-squad/mcp-samsara"],
      "env": {
        "SAMSARA_API_TOKEN": "your-token-here",
        "SAMSARA_BASE_URL": "https://api.samsara.com"
      }
    }
  }
}
```

**From Local Build:**
```json
{
  "mcpServers": {
    "samsara": {
      "command": "node",
      "args": ["/ABSOLUTE/PATH/TO/mcp-samsara/build/index.js"],
      "env": {
        "SAMSARA_API_TOKEN": "your-token-here",
        "SAMSARA_BASE_URL": "https://api.samsara.com"
      }
    }
  }
}
```

**Replace:**
- `/ABSOLUTE/PATH/TO/mcp-samsara` with actual path
  - macOS example: `/Users/robert/Downloads/mcp-samsara`
  - Windows example: `C:\\Users\\robert\\Downloads\\mcp-samsara`
- `your-token-here` with your Samsara API token

**Restart Claude Desktop** completely (Quit → Reopen)

**Test:**
```
List all my Samsara vehicles
```

---

### 2️⃣ CLAUDE CODE

Claude Code looks for MCPs in `~/.claude/mcp-servers/`

**From NPM (once published):**

Create `~/.claude/mcp-servers/samsara/config.json`:

```bash
mkdir -p ~/.claude/mcp-servers/samsara

cat > ~/.claude/mcp-servers/samsara/config.json << 'EOF'
{
  "command": "npx",
  "args": ["-y", "@automation-squad/mcp-samsara"],
  "env": {
    "SAMSARA_API_TOKEN": "your-token-here",
    "SAMSARA_BASE_URL": "https://api.samsara.com"
  }
}
EOF
```

**From Local Build:**

```bash
# Copy your MCP to the servers directory
mkdir -p ~/.claude/mcp-servers
cp -r /path/to/mcp-samsara ~/.claude/mcp-servers/samsara

# Create config
cat > ~/.claude/mcp-servers/samsara/config.json << 'EOF'
{
  "command": "node",
  "args": ["build/index.js"],
  "env": {
    "SAMSARA_API_TOKEN": "your-token-here",
    "SAMSARA_BASE_URL": "https://api.samsara.com"
  }
}
EOF
```

**Don't forget to replace `your-token-here`!**

**Test:**
```bash
claude-code
# Then: "List my Samsara vehicles"
```

---

### 3️⃣ ANTIGRAVITY

Antigravity uses the **same directory** as Claude Code!

**From NPM:**

```bash
mkdir -p ~/.claude/mcp-servers/samsara

cat > ~/.claude/mcp-servers/samsara/config.json << 'EOF'
{
  "command": "npx",
  "args": ["-y", "@automation-squad/mcp-samsara"],
  "env": {
    "SAMSARA_API_TOKEN": "your-token-here",
    "SAMSARA_BASE_URL": "https://api.samsara.com"
  }
}
EOF
```

**From Local Build:**

If you already did Claude Code setup, **you're done!** Same directory.

Otherwise:

```bash
mkdir -p ~/.claude/mcp-servers
cp -r /path/to/mcp-samsara ~/.claude/mcp-servers/samsara

cat > ~/.claude/mcp-servers/samsara/config.json << 'EOF'
{
  "command": "node",
  "args": ["build/index.js"],
  "env": {
    "SAMSARA_API_TOKEN": "your-token-here",
    "SAMSARA_BASE_URL": "https://api.samsara.com"
  }
}
EOF
```

**Replace `your-token-here`!**

**Launch Antigravity** and the MCP will be loaded automatically!

---

### 4️⃣ CURSOR (Bonus!)

Cursor can use MCPs via the Claude Code extension.

**Option A: If you have Claude Code extension installed:**

Same setup as Claude Code (uses `~/.claude/mcp-servers/`)

**Option B: Add to Cursor settings:**

1. Open Cursor Settings (Cmd+, or Ctrl+,)
2. Search for "MCP" or "Model Context Protocol"
3. Add server configuration:

```json
{
  "mcp.servers": {
    "samsara": {
      "command": "npx",
      "args": ["-y", "@automation-squad/mcp-samsara"],
      "env": {
        "SAMSARA_API_TOKEN": "your-token-here",
        "SAMSARA_BASE_URL": "https://api.samsara.com"
      }
    }
  }
}
```

---

## 🔍 Verification

After installing on any platform, verify it's working:

**Test Query:**
```
Show me all my Samsara vehicles
```

**Expected Response:**
Claude will call the `samsara_list_vehicles` tool and return your fleet data.

**If it's not working:**

1. Check config file syntax (valid JSON)
2. Verify API token is correct
3. Check absolute paths (no ~, use full paths)
4. Restart the application completely
5. Check application logs for errors

---

## 🌍 EU Customers

If you're using Samsara EU region, change the base URL:

```json
"SAMSARA_BASE_URL": "https://api.eu.samsara.com"
```

---

## 📊 Quick Reference

| Platform | Config Location | Restart Required |
|----------|----------------|------------------|
| Claude Desktop | `~/Library/Application Support/Claude/claude_desktop_config.json` | Yes |
| Claude Code | `~/.claude/mcp-servers/samsara/config.json` | No (auto-loads) |
| Antigravity | `~/.claude/mcp-servers/samsara/config.json` | No (auto-loads) |
| Cursor | Cursor Settings or `~/.claude/mcp-servers/` | Depends |

---

## 🎯 Common Use Cases

Once installed, try these:

**Fleet Overview:**
```
Show me current locations of all vehicles on routes
```

**Create Route:**
```
Create a delivery route with these stops:
1. Warehouse at 123 Main St
2. Customer A at 456 Oak Ave
3. Customer B at 789 Pine Rd
Then optimize it for distance
```

**Driver Compliance:**
```
Get HOS logs for driver D123 for the past week
```

**Webhook Setup:**
```
Set up a webhook to notify me at https://myapp.com/webhook
when routes are updated
```

---

## 🚨 Troubleshooting

### "Tool not found" or "No tools available"

- Verify config syntax (use JSONLint.com)
- Check absolute paths (no ~, no relative paths)
- Ensure API token is set
- Restart application

### "401 Unauthorized"

- API token is wrong or expired
- Generate new token in Samsara dashboard

### "429 Too Many Requests"

- Built-in rate limiting will handle this
- Wait a few seconds, retry

### "Cannot find module"

For local build:
- Run `npm install` in the mcp-samsara directory
- Verify build exists: `ls build/index.js`

---

## 💡 Pro Tips

**Multiple Platforms:**
Install once locally, use everywhere:

```bash
# Copy to shared location
cp -r mcp-samsara ~/.automation-squad/mcp-samsara

# Point all configs to same location
# ~/.automation-squad/mcp-samsara/build/index.js
```

**Different Tokens:**
Use different tokens for dev/prod:

```json
{
  "mcpServers": {
    "samsara-prod": {
      "env": { "SAMSARA_API_TOKEN": "prod-token" }
    },
    "samsara-dev": {
      "env": { "SAMSARA_API_TOKEN": "dev-token" }
    }
  }
}
```

**Global NPM Link:**
```bash
cd mcp-samsara
npm link

# Now use 'mcp-samsara' as command
```

---

## ✅ You're Ready!

You now have the Samsara MCP running on all your platforms! 🎉

**Next:** Start automating your fleet management! 🚚

Questions? Issues? 
- GitHub: https://github.com/YOUR_USERNAME/mcp-samsara/issues
- Discord: https://discord.gg/automation-squad
- Email: support@automationsquad.com
