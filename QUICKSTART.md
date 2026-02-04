# Quick Start Guide - MCP for Samsara

Get up and running in **5 minutes**!

## Step 1: Get Your Samsara API Token

1. Log into [Samsara Dashboard](https://cloud.samsara.com)
2. Go to **Settings** → **Organization** → **API Tokens**
3. Click **Create API Token**
4. Give it a name (e.g., "Claude Integration")
5. Copy the token (you'll need it in Step 3)

**Note:** You need Admin or API Administrator permissions.

---

## Step 2: Install the MCP

Choose one method:

### Method A: NPM (Recommended)

```bash
npm install -g @automation-squad/mcp-samsara
```

### Method B: From Source

```bash
git clone https://github.com/automation-squad/mcp-samsara
cd mcp-samsara
npm install
npm run build
```

---

## Step 3: Configure Claude Desktop

### Find your config file:

**macOS:**  
`~/Library/Application Support/Claude/claude_desktop_config.json`

**Windows:**  
`%APPDATA%\Claude\claude_desktop_config.json`

### Edit the file:

If the file doesn't exist, create it with this content:

```json
{
  "mcpServers": {
    "samsara": {
      "command": "npx",
      "args": ["-y", "@automation-squad/mcp-samsara"],
      "env": {
        "SAMSARA_API_TOKEN": "paste-your-token-here",
        "SAMSARA_BASE_URL": "https://api.samsara.com"
      }
    }
  }
}
```

**EU Customers:** Change the URL to `https://api.eu.samsara.com`

### If you already have other MCPs:

Add the Samsara config to your existing `mcpServers` object:

```json
{
  "mcpServers": {
    "existing-mcp": {
      ...
    },
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

## Step 4: Restart Claude

**Important:** You must completely quit and restart Claude Desktop.

- **macOS:** Cmd+Q to quit, then reopen
- **Windows:** Right-click system tray icon → Quit, then reopen

---

## Step 5: Verify It's Working

Open a new conversation in Claude and ask:

```
List all my Samsara vehicles
```

or

```
Show me my current routes
```

If you see results, you're all set! 🎉

---

## Common First Tasks

### Create a route

```
Create a delivery route called "Morning Deliveries" with these stops:
1. Warehouse at 123 Main Street, Springfield, IL
2. Customer A at 456 Oak Avenue, Springfield, IL
3. Customer B at 789 Pine Road, Springfield, IL
4. Return to warehouse

Optimize for minimum distance and assign vehicle ID abc123
```

### Track vehicles

```
Show me real-time locations for all vehicles currently on routes
```

### Monitor driver compliance

```
Get HOS logs for driver with ID driver_123 for the past 7 days
```

---

## Troubleshooting

### "Tools not showing up"

1. Check config file syntax (must be valid JSON)
2. Make sure you **completely quit** Claude (not just close window)
3. Verify API token is correct
4. Check Claude logs for errors

### "API error (401): Unauthorized"

Your API token is invalid or expired. Get a new one from Samsara dashboard.

### "API error (403): Forbidden"

Your API token doesn't have sufficient permissions. You need Admin or API Administrator role.

### Still having issues?

- Join our [Discord community](https://discord.gg/automation-squad)
- Email: support@automationsquad.com
- Check [GitHub issues](https://github.com/automation-squad/mcp-samsara/issues)

---

## Next Steps

- Read the [full README](README.md) for all 47 tools
- Check out [example use cases](EXAMPLES.md)
- Join the beta to lock in your discount!

---

**You're ready to automate your fleet! 🚀**
