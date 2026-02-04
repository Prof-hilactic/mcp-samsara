#!/bin/bash
# Automation Squad - MCP for Samsara
# Quick Install Script

set -e

echo "🚀 Automation Squad - MCP for Samsara Quick Installer"
echo "=================================================="
echo ""

# Check Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js not found. Please install Node.js 18+ first."
    echo "   Visit: https://nodejs.org/"
    exit 1
fi

NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js version too old. Need 18+, found $(node -v)"
    exit 1
fi

echo "✅ Node.js $(node -v) found"
echo ""

# Get current directory
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
echo "📁 MCP Location: $SCRIPT_DIR"
echo ""

# Check if build exists
if [ ! -f "$SCRIPT_DIR/build/index.js" ]; then
    echo "📦 Building MCP server..."
    npm install
    npm run build
    echo "✅ Build complete"
    echo ""
fi

# Get API token
echo "🔑 Samsara API Token Setup"
echo ""
read -p "Enter your Samsara API Token (or press Enter to skip): " API_TOKEN

if [ -z "$API_TOKEN" ]; then
    echo ""
    echo "⚠️  No token provided. You'll need to add it manually to configs."
    echo ""
    API_TOKEN="YOUR_SAMSARA_API_TOKEN_HERE"
fi

# Ask which platforms to install
echo "📱 Which platforms do you want to install on?"
echo ""
echo "1. Claude Desktop"
echo "2. Claude Code / Antigravity"
echo "3. Both"
echo ""
read -p "Choose (1/2/3): " PLATFORM_CHOICE

install_claude_desktop() {
    echo ""
    echo "📱 Installing for Claude Desktop..."
    
    # Detect OS
    if [[ "$OSTYPE" == "darwin"* ]]; then
        CONFIG_DIR="$HOME/Library/Application Support/Claude"
        CONFIG_FILE="$CONFIG_DIR/claude_desktop_config.json"
    else
        CONFIG_DIR="$APPDATA/Claude"
        CONFIG_FILE="$CONFIG_DIR/claude_desktop_config.json"
    fi
    
    # Create directory if needed
    mkdir -p "$CONFIG_DIR"
    
    # Check if config exists
    if [ -f "$CONFIG_FILE" ]; then
        echo "⚠️  Config file exists: $CONFIG_FILE"
        read -p "Backup existing config? (y/n): " BACKUP
        if [ "$BACKUP" = "y" ]; then
            cp "$CONFIG_FILE" "$CONFIG_FILE.backup.$(date +%s)"
            echo "✅ Backed up to $CONFIG_FILE.backup.*"
        fi
    fi
    
    # Create config
    cat > "$CONFIG_FILE" << EOF
{
  "mcpServers": {
    "samsara": {
      "command": "node",
      "args": ["$SCRIPT_DIR/build/index.js"],
      "env": {
        "SAMSARA_API_TOKEN": "$API_TOKEN",
        "SAMSARA_BASE_URL": "https://api.samsara.com"
      }
    }
  }
}
EOF
    
    echo "✅ Claude Desktop configured!"
    echo "   Config: $CONFIG_FILE"
    echo ""
    echo "⚠️  IMPORTANT: Restart Claude Desktop completely (Quit and reopen)"
}

install_claude_code() {
    echo ""
    echo "📱 Installing for Claude Code / Antigravity..."
    
    MCP_DIR="$HOME/.claude/mcp-servers/samsara"
    
    # Create directory
    mkdir -p "$MCP_DIR"
    
    # Copy MCP files
    cp -r "$SCRIPT_DIR"/* "$MCP_DIR/"
    
    # Create config
    cat > "$MCP_DIR/config.json" << EOF
{
  "command": "node",
  "args": ["build/index.js"],
  "env": {
    "SAMSARA_API_TOKEN": "$API_TOKEN",
    "SAMSARA_BASE_URL": "https://api.samsara.com"
  }
}
EOF
    
    echo "✅ Claude Code / Antigravity configured!"
    echo "   Location: $MCP_DIR"
    echo ""
    echo "ℹ️  MCPs auto-load in Claude Code and Antigravity"
}

# Execute based on choice
case $PLATFORM_CHOICE in
    1)
        install_claude_desktop
        ;;
    2)
        install_claude_code
        ;;
    3)
        install_claude_desktop
        install_claude_code
        ;;
    *)
        echo "❌ Invalid choice"
        exit 1
        ;;
esac

echo ""
echo "🎉 Installation Complete!"
echo ""
echo "📚 Next Steps:"
echo "   1. Make sure your Samsara API token is set correctly"
echo "   2. Restart Claude Desktop if installed there"
echo "   3. Test with: 'List all my Samsara vehicles'"
echo ""
echo "📖 Documentation:"
echo "   - README.md - Full documentation"
echo "   - QUICKSTART.md - Quick start guide"
echo "   - EXAMPLES.md - Usage examples"
echo ""
echo "🐛 Troubleshooting:"
echo "   - Verify token: https://cloud.samsara.com (Settings → API Tokens)"
echo "   - Check configs are valid JSON"
echo "   - For EU region, change SAMSARA_BASE_URL to https://api.eu.samsara.com"
echo ""
echo "💬 Support:"
echo "   - GitHub: https://github.com/YOUR_USERNAME/mcp-samsara/issues"
echo "   - Email: support@automationsquad.com"
echo ""
echo "Happy automating! 🚀"
