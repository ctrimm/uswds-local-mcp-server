#!/bin/bash

# USWDS MCP Server Launcher
# This script ensures the correct Node.js version is used via nvm

set -e

# Get the directory where this script is located
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$SCRIPT_DIR"

# Function to load nvm
load_nvm() {
    # Check common nvm installation locations
    if [ -s "$HOME/.nvm/nvm.sh" ]; then
        export NVM_DIR="$HOME/.nvm"
        source "$NVM_DIR/nvm.sh"
        return 0
    elif [ -s "/usr/local/opt/nvm/nvm.sh" ]; then
        export NVM_DIR="/usr/local/opt/nvm"
        source "$NVM_DIR/nvm.sh"
        return 0
    elif [ -s "$XDG_CONFIG_HOME/nvm/nvm.sh" ]; then
        export NVM_DIR="$XDG_CONFIG_HOME/nvm"
        source "$NVM_DIR/nvm.sh"
        return 0
    else
        return 1
    fi
}

# Function to check Node version
check_node_version() {
    local current_version
    current_version=$(node --version 2>/dev/null | sed 's/v//' | cut -d. -f1)

    if [ -z "$current_version" ]; then
        echo "Error: Node.js is not installed" >&2
        return 1
    fi

    if [ "$current_version" -lt 20 ]; then
        echo "Error: Node.js version 20+ required (found v$current_version)" >&2
        echo "Please run: nvm install 20 && nvm use 20" >&2
        return 1
    fi

    return 0
}

# Try to load nvm and use the correct version
if load_nvm; then
    # nvm is available - use the version from .nvmrc
    if [ -f .nvmrc ]; then
        echo "Loading Node.js version from .nvmrc..." >&2
        nvm use

        # Install the version if it's not available
        if [ $? -ne 0 ]; then
            echo "Installing required Node.js version..." >&2
            nvm install
            nvm use
        fi
    else
        echo "Warning: .nvmrc not found, using current Node version" >&2
    fi
else
    echo "Warning: nvm not found, using system Node.js" >&2
fi

# Verify Node version is sufficient
if ! check_node_version; then
    exit 1
fi

# Log the Node version being used
echo "Using Node.js $(node --version)" >&2
echo "MCP Server starting..." >&2

# Check if dist/index.js exists (TypeScript build output)
if [ -f "$SCRIPT_DIR/dist/index.js" ]; then
    # Use compiled TypeScript output
    exec node dist/index.js "$@"
elif [ -f "$SCRIPT_DIR/index.js" ]; then
    # Fall back to source if no build exists
    echo "Warning: dist/index.js not found, using index.js directly" >&2
    echo "Run 'npm run build' to compile TypeScript" >&2
    exec node index.js "$@"
else
    echo "Error: No entry point found (dist/index.js or index.js)" >&2
    echo "Run 'npm run build' to compile TypeScript" >&2
    exit 1
fi
