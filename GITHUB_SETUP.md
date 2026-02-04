# GitHub Setup Instructions

## 1. Create GitHub Repository

1. Go to https://github.com/new
2. Repository name: `mcp-samsara`
3. Description: "Automation Squad MCP for Samsara - Complete fleet management integration for Claude AI"
4. **Public** repository
5. **DON'T** initialize with README (we have one)
6. Click "Create repository"

## 2. Initialize Git in Your Local Directory

```bash
cd /path/to/mcp-samsara

# Initialize git
git init

# Add all files
git add .

# First commit
git commit -m "Initial release: MCP for Samsara v1.0.0-beta.1

- 47+ comprehensive tools for Samsara Fleet Management API
- Automatic stop state preservation
- Built-in route optimization
- Production-ready with full documentation
- Free beta launch"

# Add remote (replace YOUR_USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/mcp-samsara.git

# Push to GitHub
git branch -M main
git push -u origin main
```

## 3. Create Release Tag

```bash
# Create version tag
git tag -a v1.0.0-beta.1 -m "Beta Release 1

Features:
- 47+ Samsara API tools
- Automatic stop state preservation
- Route optimization
- Complete documentation

Free while in beta - lock in lifetime discount!"

# Push tag
git push origin v1.0.0-beta.1
```

## 4. Create GitHub Release (via Web UI)

1. Go to your repo: `https://github.com/YOUR_USERNAME/mcp-samsara`
2. Click "Releases" → "Create a new release"
3. Choose tag: `v1.0.0-beta.1`
4. Release title: `v1.0.0-beta.1 - Beta Launch 🚀`
5. Description:

```markdown
# Automation Squad - MCP for Samsara

> Complete Samsara Fleet Management integration for Claude AI

🚀 **FREE WHILE IN BETA** - Lock in your lifetime discount!

## What's Included

✅ **47+ comprehensive tools** (full API coverage)
✅ **Automatic stop state preservation** (our secret sauce!)
✅ **Built-in route optimization** (value-add feature)
✅ **Production-ready** with complete documentation
✅ **Smart rate limiting** and error handling
✅ **TMS integration** ready via externalIds

## Quick Start

```bash
npm install -g @automation-squad/mcp-samsara
```

See [README.md](README.md) for full installation instructions.

## Beta Pricing

- First 1,000 users: **FREE FOREVER**
- Next 99,000 users: **75% lifetime discount**

When we launch paid plans:
- Individual: $29/month (beta users: $7.25/mo)
- All-Access: $299/month (beta users: $74.75/mo)

[Join Beta →](https://automationsquad.com/beta)

## What's New

Initial beta release with complete Samsara Fleet Management API integration.

## Disclaimer

⚠️ **UNOFFICIAL:** This is an unofficial third-party MCP server. Not affiliated with Samsara Inc.
```

6. Attach the tarball: `mcp-samsara-v1.0.0-beta.1.tar.gz`
7. Click "Publish release"

## 5. Add Topics/Tags

On your repo main page:
1. Click the ⚙️ icon next to "About"
2. Add topics:
   - `mcp`
   - `samsara`
   - `fleet-management`
   - `claude-ai`
   - `automation`
   - `model-context-protocol`
   - `typescript`

## 6. Optional: Add GitHub Actions for Auto-Publishing

Create `.github/workflows/publish.yml`:

```yaml
name: Publish to NPM

on:
  release:
    types: [created]

jobs:
  publish:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
          registry-url: 'https://registry.npmjs.org'
      - run: npm install
      - run: npm run build
      - run: npm publish --access public
        env:
          NODE_AUTH_TOKEN: ${{ secrets.NPM_TOKEN }}
```

## Done! 🎉

Your MCP is now on GitHub and ready for the community!

Next: Publish to NPM (see NPM_SETUP.md)
