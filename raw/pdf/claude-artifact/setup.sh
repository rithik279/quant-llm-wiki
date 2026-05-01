#!/bin/bash

# Portfolio Agent - Quick Start Setup
# This script initializes the agent system

set -e  # Exit on error

echo "╔════════════════════════════════════════════════════════════════╗"
echo "║     Portfolio Agent System - Quick Start Setup                 ║"
echo "╚════════════════════════════════════════════════════════════════╝"
echo ""

# Check Node.js
echo "✓ Checking Node.js..."
if ! command -v node &> /dev/null; then
    echo "✗ Node.js not found. Please install Node.js 18+"
    exit 1
fi
NODE_VERSION=$(node -v)
echo "  Found: $NODE_VERSION"
echo ""

# Create directories
echo "✓ Creating data directories..."
mkdir -p agent-data/{logs,news-cache}
echo "  Created: ./agent-data/{logs,news-cache}"
echo ""

# Install dependencies
echo "✓ Installing dependencies..."
if [ -f "package.json" ]; then
    npm install
    echo "  Dependencies installed"
else
    echo "✗ package.json not found"
    exit 1
fi
echo ""

# Setup .env
echo "✓ Setting up configuration..."
if [ ! -f ".env" ]; then
    cp .env.example .env
    echo "  Created .env from template"
    echo "  ⚠ IMPORTANT: Edit .env with your API keys"
    echo ""
    echo "  Required:"
    echo "  - ANTHROPIC_API_KEY (get from https://console.anthropic.com)"
    echo "  - NEWSAPI_KEY (free at https://newsapi.org)"
    echo "  - IBKR_ACCOUNT_ID (from your IBKR account)"
    echo ""
else
    echo "  .env already exists (not overwriting)"
fi
echo ""

# Test basic setup
echo "✓ Testing setup..."
if [ -f "portfolio-agent-system.js" ]; then
    echo "  ✓ portfolio-agent-system.js found"
else
    echo "  ✗ portfolio-agent-system.js not found"
    exit 1
fi

if [ -f "scheduler.js" ]; then
    echo "  ✓ scheduler.js found"
else
    echo "  ✗ scheduler.js not found"
    exit 1
fi
echo ""

# Summary
echo "╔════════════════════════════════════════════════════════════════╗"
echo "║                   Setup Complete!                              ║"
echo "╚════════════════════════════════════════════════════════════════╝"
echo ""
echo "Next steps:"
echo ""
echo "1. Add API keys to .env:"
echo "   nano .env"
echo ""
echo "2. Test the agent:"
echo "   npm run daily"
echo ""
echo "3. Enable automation:"
echo "   npm run schedule"
echo ""
echo "4. Monitor results:"
echo "   tail -f agent-data/logs/errors.json"
echo "   cat agent-data/suggestions.json"
echo ""
echo "5. Read full guide:"
echo "   cat README.md"
echo ""
