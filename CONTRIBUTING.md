# Contributing to USWDS MCP Server

Thank you for your interest in contributing to the USWDS MCP Server! This document provides guidelines and instructions for contributing.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [How to Contribute](#how-to-contribute)
- [Adding New Tools](#adding-new-tools)
- [Testing](#testing)
- [Code Style](#code-style)
- [Pull Request Process](#pull-request-process)
- [Reporting Issues](#reporting-issues)

## Code of Conduct

This project follows standard open-source community guidelines. Be respectful, inclusive, and collaborative.

## Getting Started

1. **Fork the repository** on GitHub
2. **Clone your fork** locally:
   ```bash
   git clone https://github.com/YOUR-USERNAME/uswds-local-mcp-server.git
   cd uswds-local-mcp-server
   ```
3. **Add upstream remote**:
   ```bash
   git remote add upstream https://github.com/ORIGINAL-OWNER/uswds-local-mcp-server.git
   ```

## Development Setup

### Prerequisites

- Node.js 18+ and npm
- TypeScript knowledge
- Familiarity with USWDS and React-USWDS

### Installation

```bash
# Install dependencies
npm install

# Build the project
npm run build

# Run in development mode
npm run watch  # In one terminal
npm run dev    # In another terminal
```

### Testing

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Type check without building
npm run lint
```

## How to Contribute

### Types of Contributions

We welcome:

- **Bug fixes** - Fix issues in existing tools
- **New tools** - Add tools from FUTURE_TOOLS.md or propose new ones
- **Documentation** - Improve README, guides, examples
- **Tests** - Add or improve test coverage
- **Performance** - Optimize existing code
- **Examples** - Add real-world usage examples

### Before You Start

1. **Check existing issues** - Someone might already be working on it
2. **Open an issue** - Discuss major changes before implementing
3. **Read FUTURE_TOOLS.md** - See planned features and priorities

## Adding New Tools

New tools are the most common contribution. Follow these steps:

### 1. Plan Your Tool

- Check **FUTURE_TOOLS.md** for planned tools
- Open an issue to discuss your tool idea
- Define the tool's input/output schema
- Consider both React and vanilla USWDS modes (if applicable)

### 2. Implement the Tool

#### Create or Update Service

If your tool needs new logic, create or update a service in `src/services/`:

```typescript
// src/services/my-new-service.ts
export class MyNewService {
  async myMethod(input: string): Promise<any> {
    // Implementation
    return {
      result: "success",
      data: "..."
    };
  }
}
```

#### Register the Tool

Add your tool to `src/index.ts`:

```typescript
// 1. Import your service
import { MyNewService } from './services/my-new-service.js';

// 2. Instantiate it
const myNewService = new MyNewService();

// 3. Add tool definition to the tools array
{
  name: 'my_new_tool',
  description: 'Clear description of what this tool does',
  inputSchema: {
    type: 'object',
    properties: {
      input_param: {
        type: 'string',
        description: 'Description of this parameter'
      }
    },
    required: ['input_param']
  }
}

// 4. Add tool handler in the switch statement
case 'my_new_tool': {
  const inputParam = args?.input_param as string;
  const result = await myNewService.myMethod(inputParam);
  return {
    content: [
      {
        type: 'text',
        text: JSON.stringify(result, null, 2)
      }
    ]
  };
}
```

### 3. Add Tests

Create tests in `src/__tests__/`:

```typescript
// src/__tests__/my-new-service.test.ts
import { describe, it, expect } from '@jest/globals';
import { MyNewService } from '../services/my-new-service.js';

describe('MyNewService', () => {
  const service = new MyNewService();

  it('should do something', async () => {
    const result = await service.myMethod('test');
    expect(result).toBeDefined();
  });
});
```

### 4. Document Your Tool

Add documentation to `README.md`:

````markdown
### 21. `my_new_tool`

Description of what the tool does and when to use it.

**Parameters:**
- `input_param` (required): Description of the parameter

**Example:**
```json
{
  "input_param": "example value"
}
```

**Output:**
```json
{
  "result": "success",
  "data": "..."
}
```
````

### 5. Update FUTURE_TOOLS.md

Mark your tool as completed:

```markdown
- [x] 🎯 **my_new_tool** - Description ✅ **LIVE**
```

### 6. Test Your Changes

```bash
# Build and test
npm run build
npm test

# Test with MCP Inspector
npm run inspector

# Test with Claude Desktop
# Update your config and restart Claude
```

## Testing

### Writing Tests

- **Unit tests** - Test individual services and functions
- **Integration tests** - Test tool handlers end-to-end
- Use `describe` and `it` blocks
- Test both success and error cases
- Use `async/await` for async operations

### Test Structure

```typescript
describe('ServiceName', () => {
  describe('methodName', () => {
    it('should handle normal case', async () => {
      const result = await service.method('input');
      expect(result).toHaveProperty('expectedProperty');
    });

    it('should handle error case', async () => {
      const result = await service.method('invalid');
      expect(result.error).toBeDefined();
    });
  });
});
```

### Coverage Goals

- Aim for 70%+ code coverage
- Focus on services and core logic
- Data files (like react-components.ts) don't need tests

## Code Style

### TypeScript

- Use TypeScript for all new code
- Use `async/await` over callbacks
- Define interfaces for complex objects
- Use `any` sparingly, prefer specific types

### Naming Conventions

- **Files**: `kebab-case.ts` (e.g., `component-service.ts`)
- **Classes**: `PascalCase` (e.g., `ComponentService`)
- **Functions/Methods**: `camelCase` (e.g., `getComponentInfo`)
- **Constants**: `UPPER_SNAKE_CASE` (e.g., `REACT_COMPONENTS`)

### Code Organization

```
src/
├── index.ts           # Main entry point, tool definitions and handlers
├── services/          # Business logic, service classes
│   └── *-service.ts
└── data/             # Static data (components, tokens, etc.)
    └── *.ts
```

### Error Handling

Always return structured errors:

```typescript
if (invalid) {
  return {
    error: 'Clear error message',
    message: 'More details about what went wrong',
    hint: 'Suggestion for how to fix it'
  };
}
```

### Return Format

Use consistent return formats:

```typescript
return {
  success: true,          // Optional success flag
  data: {...},           // Main data payload
  metadata: {...},       // Optional metadata
  notes: [...],         // Optional notes or warnings
  documentation: '...'   // Optional link to docs
};
```

## Pull Request Process

### Before Submitting

1. **Update your branch** with latest upstream:
   ```bash
   git fetch upstream
   git rebase upstream/main
   ```

2. **Run all checks**:
   ```bash
   npm run build
   npm run lint
   npm test
   ```

3. **Update documentation** (README.md, CHANGELOG.md)

4. **Test manually** with MCP Inspector or Claude Desktop

### PR Guidelines

- **Title**: Use clear, descriptive titles
  - ✅ "Add get_validation_patterns tool"
  - ❌ "Update stuff"

- **Description**: Include:
  - What the PR does
  - Why the change is needed
  - Related issues (e.g., "Closes #123")
  - Testing performed
  - Screenshots/examples (if UI changes)

- **Commits**:
  - Use conventional commits: `feat:`, `fix:`, `docs:`, `test:`, `refactor:`
  - One logical change per commit
  - Clear commit messages

- **Size**: Keep PRs focused and reasonably sized
  - Large features can be split into multiple PRs

### PR Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New tool/feature
- [ ] Documentation update
- [ ] Test addition/improvement
- [ ] Code refactoring

## Related Issues
Closes #(issue number)

## Testing
- [ ] Unit tests pass
- [ ] Integration tests pass
- [ ] Manually tested with MCP Inspector
- [ ] Manually tested with Claude Desktop

## Checklist
- [ ] Code builds without errors
- [ ] Tests added/updated and passing
- [ ] Documentation updated (README.md)
- [ ] CHANGELOG.md updated
- [ ] FUTURE_TOOLS.md updated (if applicable)
```

### Review Process

1. Automated checks must pass (CI/CD)
2. At least one maintainer approval required
3. Address review feedback
4. Maintainer will merge once approved

## Reporting Issues

### Bug Reports

Use the bug report template and include:

- **Description**: What's broken?
- **Steps to Reproduce**: How to trigger the bug
- **Expected Behavior**: What should happen
- **Actual Behavior**: What actually happens
- **Environment**: Node version, OS, MCP client (Claude Desktop, etc.)
- **Logs**: Any error messages or logs

### Feature Requests

Check FUTURE_TOOLS.md first! If not listed:

- **Description**: What feature do you want?
- **Use Case**: Why is it needed?
- **Examples**: How would it work?
- **Alternatives**: What alternatives have you considered?

### Questions

For questions:
- Check README.md and other documentation first
- Search existing issues
- Open a discussion (not an issue) for general questions

## Development Tips

### Debugging

```bash
# Enable debug logging
export DEBUG=true
npm run dev

# Use MCP Inspector for interactive testing
npm run inspector
```

### Common Issues

**Build errors**: Run `rm -rf dist && npm run build`

**Test failures**: Ensure services return expected structure

**Type errors**: Run `npm run lint` to see all type issues

### Resources

- [USWDS Documentation](https://designsystem.digital.gov/)
- [React-USWDS Documentation](https://github.com/trussworks/react-uswds)
- [MCP Protocol Specification](https://modelcontextprotocol.io/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

## Questions?

- Open a GitHub Discussion
- Check existing issues and PRs
- Review the documentation in this repo

Thank you for contributing! 🎉
