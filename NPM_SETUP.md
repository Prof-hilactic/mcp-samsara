# NPM Publishing Instructions

## Prerequisites

1. NPM account: https://www.npmjs.com/signup
2. NPM organization (optional): `@automation-squad`

## Setup

### 1. Login to NPM

```bash
cd /path/to/mcp-samsara

# Login to NPM
npm login

# Enter your credentials when prompted
```

### 2. Verify Package Configuration

Check `package.json` name field:

```json
{
  "name": "@automation-squad/mcp-samsara",
  ...
}
```

**Options:**

**Option A: Use organization scope** (recommended)
- Requires creating NPM organization "automation-squad"
- Go to: https://www.npmjs.com/org/create
- Name: `automation-squad`
- Keep name as: `@automation-squad/mcp-samsara`

**Option B: Use your username**
- Change to: `@yourusername/mcp-samsara`
- Or use unscoped: `mcp-samsara` (if available)

### 3. Check for Name Availability

```bash
# Check if name is available
npm view @automation-squad/mcp-samsara

# If it returns "npm ERR! 404" - good! Name is available
# If it shows package details - name is taken, choose another
```

### 4. Verify Build

```bash
# Make sure everything is built
npm run build

# Test the package locally
npm pack

# This creates: automation-squad-mcp-samsara-1.0.0-beta.1.tgz
# Test install locally:
npm install -g ./automation-squad-mcp-samsara-1.0.0-beta.1.tgz
```

### 5. Publish to NPM

```bash
# For scoped packages (@automation-squad/...), make it public
npm publish --access public

# For unscoped packages
npm publish
```

**You should see:**
```
+ @automation-squad/mcp-samsara@1.0.0-beta.1
```

### 6. Verify Publication

```bash
# Check it's live
npm view @automation-squad/mcp-samsara

# Try installing it
npm install -g @automation-squad/mcp-samsara
```

## Update Package README on NPM

The README.md in your package will automatically appear on NPM!

Visit: https://www.npmjs.com/package/@automation-squad/mcp-samsara

## Future Updates

When you want to publish updates:

```bash
# Update version in package.json (or use npm version)
npm version patch  # 1.0.0-beta.1 -> 1.0.0-beta.2
# or
npm version minor  # 1.0.0 -> 1.1.0
# or  
npm version major  # 1.0.0 -> 2.0.0

# Build
npm run build

# Publish
npm publish --access public

# Push version tag to GitHub
git push --follow-tags
```

## Troubleshooting

### "You do not have permission to publish"

You need to:
1. Create the organization: https://www.npmjs.com/org/create
2. Or change package name to unscoped or your username scope

### "Package name too similar to existing package"

Choose a different name:
- `automation-squad-samsara`
- `mcp-server-samsara`
- `samsara-mcp-server`

### "Version already exists"

Increment version number:
```bash
npm version patch
npm publish --access public
```

## NPM Stats & Badges

After publishing, add badges to README.md:

```markdown
[![npm version](https://badge.fury.io/js/@automation-squad%2Fmcp-samsara.svg)](https://www.npmjs.com/package/@automation-squad/mcp-samsara)
[![npm downloads](https://img.shields.io/npm/dm/@automation-squad/mcp-samsara.svg)](https://www.npmjs.com/package/@automation-squad/mcp-samsara)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
```

## Done! 🎉

Your MCP is now on NPM! Anyone can install it with:

```bash
npm install -g @automation-squad/mcp-samsara
```

## Next Steps

1. Announce on Twitter/LinkedIn
2. Post on Product Hunt
3. Share in r/samsara, r/fleetmanagement
4. Add to MCP directory: https://github.com/modelcontextprotocol/servers
5. Get first beta users!
