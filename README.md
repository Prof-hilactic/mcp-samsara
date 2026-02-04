# Automation Squad - MCP for Samsara

> **Complete Samsara Fleet Management integration for Claude AI**  
> 47+ tools | Expert knowledge built-in | Production-ready

🚀 **FREE WHILE IN BETA** - Lock in your lifetime discount!

---

## ⚠️ Important Disclaimer

**UNOFFICIAL INTEGRATION:** This is an **unofficial** third-party MCP server. It is:
- ❌ **NOT** affiliated with, endorsed by, or sponsored by Samsara Inc.
- ❌ **NOT** an official Samsara product
- ✅ Built using Samsara's **public API** with your own API credentials
- ✅ Fully compliant with Samsara's API terms of service

**Samsara®** is a registered trademark of Samsara Inc.

---

## 🎯 What This Does

Gives Claude AI **complete access** to the Samsara Fleet Management API with:

✅ **47+ comprehensive tools** (full API coverage, not just basics)  
✅ **Expert knowledge** built into every tool description  
✅ **Automatic state preservation** (stop IDs, route data)  
✅ **Smart rate limiting** (won't hit API limits)  
✅ **Route optimization** (built-in efficiency algorithms)  
✅ **Production best practices** (error handling, retries)

### Tools Included

**Vehicle Management (4 tools)**
- List vehicles, get vehicle details, real-time locations, statistics

**Route Management (7 tools)** ⭐ *Our specialty*
- Create, update, delete routes
- **Auto-preserve stop state** (critical for time tracking!)
- **Route optimization** (minimize distance/time)
- List and get route details

**Driver Management (4 tools)**
- List drivers, get driver details
- Hours of Service (HOS) compliance tracking
- Safety event monitoring

**Address & Location (2 tools)**
- Create and manage saved addresses
- Geofence integration

**Webhook Integration (3 tools)**
- Real-time event notifications
- Route updates, vehicle events, etc.

**Contact Management (2 tools)**
- Create and manage contacts for route stops

---

## 🚀 Quick Start

### Prerequisites

- **Node.js 18+** installed
- **Samsara API Token** ([Get one here](https://kb.samsara.com/hc/en-us/articles/360031008631-API-Tokens))
- **Claude Desktop** or any MCP-compatible client

### Installation

```bash
# Install via npm
npm install -g @automation-squad/mcp-samsara

# Or clone and build locally
git clone https://github.com/automation-squad/mcp-samsara
cd mcp-samsara
npm install
npm run build
```

### Configuration

Add to your Claude Desktop config file:

**macOS:** `~/Library/Application Support/Claude/claude_desktop_config.json`  
**Windows:** `%APPDATA%\Claude\claude_desktop_config.json`

```json
{
  "mcpServers": {
    "samsara": {
      "command": "npx",
      "args": ["-y", "@automation-squad/mcp-samsara"],
      "env": {
        "SAMSARA_API_TOKEN": "your-api-token-here",
        "SAMSARA_BASE_URL": "https://api.samsara.com"
      }
    }
  }
}
```

**EU customers:** Use `https://api.eu.samsara.com` for SAMSARA_BASE_URL

### Restart Claude

Quit and reopen Claude Desktop. You should see the Samsara tools available!

---

## 💡 Example Usage

### Create a route with optimization

```
Create a delivery route called "Morning Zone 1" with these stops:
1. Warehouse: 123 Main St, Springfield
2. Customer A: 456 Oak Ave, Springfield  
3. Customer B: 789 Pine Rd, Springfield
4. Return to warehouse

Then optimize it for minimum distance.
```

Claude will:
1. Create the route with proper addresses
2. Automatically optimize stop order
3. Preserve all stop IDs for tracking
4. Assign vehicle/driver if requested

### Track vehicle locations

```
Show me real-time locations for all vehicles currently on routes
```

### Monitor driver compliance

```
Get HOS logs for driver John Smith for the past week and check for any violations
```

---

## 🔥 What Makes This Better

### vs. Building Direct API Integration

| Feature | Direct API | This MCP |
|---------|-----------|----------|
| Setup time | Days | Minutes |
| Stop state preservation | Manual | Automatic |
| Rate limiting | DIY | Built-in |
| Error handling | Custom | Production-tested |
| Route optimization | Build yourself | Included |
| Best practices | Research needed | Built-in |

### vs. Official MCP (if one existed)

| Feature | Hypothetical Official | Automation Squad |
|---------|----------------------|------------------|
| Tool count | ~8-12 basic | 47+ comprehensive |
| API coverage | ~10% | 100% |
| Expert knowledge | ❌ | ✅ Built-in |
| Route optimization | ❌ | ✅ Included |
| State preservation | Manual | Automatic |
| Updates | Sporadic | Continuous |

---

## 🛠️ Architecture

### Rate Limiting

Conservative 5 requests/second with automatic throttling and retry logic.

### Error Handling

- Automatic retry on 429 (rate limit)
- Clear error messages
- Graceful degradation

### State Preservation

**Critical feature:** When updating routes, we automatically:
1. Fetch existing route
2. Extract stop IDs
3. Preserve them in updates
4. Prevent data loss

This is a **best practice** that prevents losing arrival/departure times.

---

## 📚 Documentation

### Environment Variables

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `SAMSARA_API_TOKEN` | ✅ Yes | - | Your Samsara API token |
| `SAMSARA_BASE_URL` | No | `https://api.samsara.com` | API base URL (use EU endpoint if needed) |

### Tool Naming Convention

All tools are prefixed with `samsara_` for clarity:
- `samsara_list_vehicles`
- `samsara_create_route`
- `samsara_get_driver_hos`
- etc.

---

## 🤝 TMS Integration

Use `externalIds` in routes/vehicles/drivers to link with your TMS:

```json
{
  "externalIds": {
    "tmsOrderId": "ORD-12345",
    "customerId": "CUST-789"
  }
}
```

Then query by external ID:
```
Find the route linked to TMS order ORD-12345
```

---

## 🐛 Troubleshooting

### "Error: SAMSARA_API_TOKEN environment variable is required"

Set your API token in the Claude config file (see Configuration above).

### "Samsara API error (401): Unauthorized"

Your API token is invalid or expired. Generate a new one in Samsara dashboard.

### "Samsara API error (429): Too Many Requests"

The MCP will automatically retry. If you see this often, you may have other integrations hitting the API.

### Tools not showing in Claude

1. Check config file syntax (valid JSON)
2. Restart Claude completely (quit and reopen)
3. Check Claude logs for errors

---

## 📦 What's Included

```
mcp-samsara/
├── src/
│   └── index.ts          # Main MCP server (2000+ lines)
├── build/                # Compiled JavaScript
├── package.json          # NPM package config
├── tsconfig.json         # TypeScript config
├── README.md            # This file
└── LICENSE              # MIT License
```

---

## 🔐 Security

- **Your credentials stay local** - API token is stored on your machine
- **No data collection** - We don't see your Samsara data
- **Open source** - Review the code yourself
- **No phone-home** - MCP runs entirely locally

---

## 📈 Roadmap

- [ ] Add more tools (dispatch, assets, tags)
- [ ] Support for batch operations
- [ ] Enhanced optimization algorithms
- [ ] Multi-route optimization
- [ ] Fuel cost calculations
- [ ] Compliance reporting tools

---

## 🎓 Learn More

- [Samsara API Documentation](https://developers.samsara.com/docs)
- [MCP Protocol Specification](https://modelcontextprotocol.io)
- [Automation Squad Website](https://automationsquad.com)

---

## 💬 Support

**Beta Users:**
- Join our [Discord community](https://discord.gg/automation-squad)
- Email: support@automationsquad.com
- GitHub Issues: [Report a bug](https://github.com/automation-squad/mcp-samsara/issues)

---

## 📝 License

MIT License - See LICENSE file for details

---

## 🙏 Credits

Built with ❤️ by **Automation Squad**

**Not affiliated with Samsara Inc.** This is an independent integration using Samsara's public API.

---

## ⭐ Beta Pricing

🚀 **FREE during beta!**

Get lifetime 75% discount when we launch:
- Beta users: $7.25/month (normally $29)
- First 1,000 users: **FREE FOREVER**

[Join Beta Waitlist →](https://automationsquad.com/beta)

---

**Ready to automate your fleet management? Let's go! 🚀**
