# USWDS MCP Server Dockerfile
FROM node:22-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy built dist folder and other necessary files
COPY dist/ ./dist/
COPY README.md ./
COPY LICENSE ./

# Ensure the entry point is executable
RUN chmod +x dist/index.js

# Run the server
CMD ["node", "dist/index.js"]
