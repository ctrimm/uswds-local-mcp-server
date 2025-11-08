# MCP Tools for USWDS Coding Agent

**Comprehensive guide to tool calls and MCP server capabilities**

---

## Tool Categories Overview

```
Essential Tools (Must Have)
├── Filesystem Operations
├── USWDS Documentation Access
└── Code Validation

Recommended Tools (Should Have)
├── Accessibility Testing
├── Version Control
├── Browser Testing
└── Component Preview

Advanced Tools (Nice to Have)
├── Design Token Validation
├── Responsive Testing
├── Performance Analysis
└── Screenshot Comparison

Integration Tools (Optional)
├── Figma Integration
├── Deployment
├── Monitoring
└── User Feedback
```

---

## Essential Tools (Priority 1)

### 1. Filesystem Operations

**Purpose:** Read USWDS templates, write generated code, manage workspace

```typescript
// MCP Server: @modelcontextprotocol/server-filesystem

{
  "name": "read_file",
  "description": "Read contents of a file",
  "inputSchema": {
    "type": "object",
    "properties": {
      "path": {
        "type": "string",
        "description": "Absolute path to file"
      }
    },
    "required": ["path"]
  }
}

{
  "name": "write_file",
  "description": "Write content to a file",
  "inputSchema": {
    "type": "object",
    "properties": {
      "path": {
        "type": "string",
        "description": "Absolute path to file"
      },
      "content": {
        "type": "string",
        "description": "Content to write"
      }
    },
    "required": ["path", "content"]
  }
}

{
  "name": "list_directory",
  "description": "List files in a directory",
  "inputSchema": {
    "type": "object",
    "properties": {
      "path": {
        "type": "string",
        "description": "Directory path"
      }
    },
    "required": ["path"]
  }
}

{
  "name": "search_files",
  "description": "Search for files by pattern",
  "inputSchema": {
    "type": "object",
    "properties": {
      "path": {
        "type": "string",
        "description": "Base directory"
      },
      "pattern": {
        "type": "string",
        "description": "Glob pattern (e.g., '*.html')"
      }
    },
    "required": ["path", "pattern"]
  }
}
```

**Example Usage:**
```python
# Agent reads USWDS button template
template = read_file("/uswds-repo/packages/usa-button/src/usa-button.html")

# Agent writes generated component
write_file("/workspace/my-button-group.html", generated_code)

# Agent lists available components
components = list_directory("/uswds-repo/packages")

# Agent searches for form examples
forms = search_files("/uswds-repo", "**/*form*.html")
```

### 2. USWDS Documentation Access

**Purpose:** Fetch latest USWDS docs, component specs, design tokens

```typescript
// Custom MCP Server: uswds-docs-server

{
  "name": "get_component_docs",
  "description": "Get USWDS component documentation",
  "inputSchema": {
    "type": "object",
    "properties": {
      "component": {
        "type": "string",
        "description": "Component name (e.g., 'button', 'input', 'alert')"
      },
      "include_examples": {
        "type": "boolean",
        "description": "Include code examples",
        "default": true
      }
    },
    "required": ["component"]
  }
}

{
  "name": "get_design_tokens",
  "description": "Get USWDS design tokens",
  "inputSchema": {
    "type": "object",
    "properties": {
      "category": {
        "type": "string",
        "enum": ["color", "spacing", "typography", "all"],
        "description": "Token category"
      }
    },
    "required": ["category"]
  }
}

{
  "name": "get_pattern_guidance",
  "description": "Get USWDS pattern documentation",
  "inputSchema": {
    "type": "object",
    "properties": {
      "pattern": {
        "type": "string",
        "description": "Pattern name (e.g., 'create-user-profile', 'form-validation')"
      }
    },
    "required": ["pattern"]
  }
}

{
  "name": "search_documentation",
  "description": "Search USWDS documentation",
  "inputSchema": {
    "type": "object",
    "properties": {
      "query": {
        "type": "string",
        "description": "Search query"
      },
      "type": {
        "type": "string",
        "enum": ["components", "utilities", "patterns", "all"],
        "default": "all"
      }
    },
    "required": ["query"]
  }
}
```

**Example Usage:**
```python
# Agent looks up button documentation
button_docs = get_component_docs("button", include_examples=True)

# Agent gets color tokens for design
colors = get_design_tokens("color")

# Agent searches for form patterns
form_patterns = search_documentation("form validation", type="patterns")
```

### 3. Code Validation

**Purpose:** Validate HTML syntax, USWDS conventions, accessibility

```typescript
// Custom MCP Server: uswds-validator-server

{
  "name": "validate_html",
  "description": "Validate HTML syntax and structure",
  "inputSchema": {
    "type": "object",
    "properties": {
      "html": {
        "type": "string",
        "description": "HTML code to validate"
      },
      "standard": {
        "type": "string",
        "enum": ["html5", "xhtml"],
        "default": "html5"
      }
    },
    "required": ["html"]
  }
}

{
  "name": "validate_uswds_classes",
  "description": "Check if USWDS classes are used correctly",
  "inputSchema": {
    "type": "object",
    "properties": {
      "html": {
        "type": "string",
        "description": "HTML code to check"
      }
    },
    "required": ["html"]
  }
}

{
  "name": "validate_accessibility",
  "description": "Check WCAG 2.1 AA compliance",
  "inputSchema": {
    "type": "object",
    "properties": {
      "html": {
        "type": "string",
        "description": "HTML code to check"
      },
      "level": {
        "type": "string",
        "enum": ["A", "AA", "AAA"],
        "default": "AA"
      }
    },
    "required": ["html"]
  }
}

{
  "name": "validate_design_tokens",
  "description": "Check if design tokens are used instead of hard-coded values",
  "inputSchema": {
    "type": "object",
    "properties": {
      "code": {
        "type": "string",
        "description": "CSS/HTML code to check"
      }
    },
    "required": ["code"]
  }
}
```

**Response Format:**
```json
{
  "valid": false,
  "errors": [
    {
      "line": 15,
      "column": 8,
      "message": "Button missing aria-label attribute",
      "severity": "error",
      "rule": "wcag-2.1-4.1.2"
    }
  ],
  "warnings": [
    {
      "line": 23,
      "message": "Consider using design token 'primary' instead of '#005ea2'",
      "severity": "warning",
      "rule": "uswds-design-tokens"
    }
  ],
  "score": 7.5
}
```

---

## Recommended Tools (Priority 2)

### 4. Accessibility Testing

**Purpose:** Automated accessibility checks beyond basic validation

```typescript
// MCP Server: accessibility-testing-server

{
  "name": "run_axe_core",
  "description": "Run axe-core accessibility tests",
  "inputSchema": {
    "type": "object",
    "properties": {
      "html": {
        "type": "string",
        "description": "HTML to test"
      },
      "rules": {
        "type": "array",
        "items": {"type": "string"},
        "description": "Specific rules to run (empty = all)",
        "default": []
      }
    },
    "required": ["html"]
  }
}

{
  "name": "run_pa11y",
  "description": "Run pa11y accessibility tests",
  "inputSchema": {
    "type": "object",
    "properties": {
      "html_file": {
        "type": "string",
        "description": "Path to HTML file"
      },
      "standard": {
        "type": "string",
        "enum": ["WCAG2A", "WCAG2AA", "WCAG2AAA"],
        "default": "WCAG2AA"
      }
    },
    "required": ["html_file"]
  }
}

{
  "name": "check_color_contrast",
  "description": "Check color contrast ratios",
  "inputSchema": {
    "type": "object",
    "properties": {
      "foreground": {
        "type": "string",
        "description": "Foreground color (hex, rgb, or token)"
      },
      "background": {
        "type": "string",
        "description": "Background color"
      }
    },
    "required": ["foreground", "background"]
  }
}

{
  "name": "check_keyboard_navigation",
  "description": "Test keyboard navigation order",
  "inputSchema": {
    "type": "object",
    "properties": {
      "html_file": {
        "type": "string",
        "description": "Path to HTML file"
      }
    },
    "required": ["html_file"]
  }
}

{
  "name": "generate_aria_attributes",
  "description": "Suggest ARIA attributes for element",
  "inputSchema": {
    "type": "object",
    "properties": {
      "element": {
        "type": "string",
        "description": "HTML element"
      },
      "context": {
        "type": "string",
        "description": "Context/purpose of element"
      }
    },
    "required": ["element", "context"]
  }
}
```

**Example Usage:**
```python
# Agent validates generated code
results = run_axe_core(generated_html)

# Agent checks color contrast
contrast = check_color_contrast("primary-darker", "white")
# Returns: {"ratio": 7.5, "passes_aa": true, "passes_aaa": true}

# Agent suggests ARIA attributes
aria = generate_aria_attributes(
    "<button>Submit</button>",
    "Form submission button that saves user data"
)
# Returns: {"aria-label": "Submit form", "aria-pressed": "false"}
```

### 5. Git Version Control

**Purpose:** Track changes, commit generated code, manage versions

```typescript
// MCP Server: @modelcontextprotocol/server-git

{
  "name": "git_status",
  "description": "Get git repository status",
  "inputSchema": {
    "type": "object",
    "properties": {
      "repo_path": {
        "type": "string",
        "description": "Repository path"
      }
    },
    "required": ["repo_path"]
  }
}

{
  "name": "git_add",
  "description": "Stage files for commit",
  "inputSchema": {
    "type": "object",
    "properties": {
      "repo_path": {"type": "string"},
      "files": {
        "type": "array",
        "items": {"type": "string"},
        "description": "Files to stage"
      }
    },
    "required": ["repo_path", "files"]
  }
}

{
  "name": "git_commit",
  "description": "Commit staged changes",
  "inputSchema": {
    "type": "object",
    "properties": {
      "repo_path": {"type": "string"},
      "message": {
        "type": "string",
        "description": "Commit message"
      }
    },
    "required": ["repo_path", "message"]
  }
}

{
  "name": "git_diff",
  "description": "Show changes in file",
  "inputSchema": {
    "type": "object",
    "properties": {
      "repo_path": {"type": "string"},
      "file": {"type": "string"}
    },
    "required": ["repo_path", "file"]
  }
}

{
  "name": "git_create_branch",
  "description": "Create new branch",
  "inputSchema": {
    "type": "object",
    "properties": {
      "repo_path": {"type": "string"},
      "branch_name": {"type": "string"}
    },
    "required": ["repo_path", "branch_name"]
  }
}
```

**Example Usage:**
```python
# Agent commits generated component
git_add("/workspace", ["button-group.html"])
git_commit("/workspace", "feat: Add accessible button group component")

# Agent creates feature branch for new work
git_create_branch("/workspace", "feature/alert-components")
```

### 6. Browser Testing & Preview

**Purpose:** Test components in real browser, take screenshots

```typescript
// MCP Server: @modelcontextprotocol/server-puppeteer

{
  "name": "render_html",
  "description": "Render HTML in headless browser",
  "inputSchema": {
    "type": "object",
    "properties": {
      "html": {
        "type": "string",
        "description": "HTML to render"
      },
      "width": {
        "type": "number",
        "default": 1280
      },
      "height": {
        "type": "number",
        "default": 720
      }
    },
    "required": ["html"]
  }
}

{
  "name": "take_screenshot",
  "description": "Take screenshot of rendered page",
  "inputSchema": {
    "type": "object",
    "properties": {
      "url_or_html": {
        "type": "string",
        "description": "URL or HTML content"
      },
      "output_path": {
        "type": "string",
        "description": "Where to save screenshot"
      },
      "viewport": {
        "type": "object",
        "properties": {
          "width": {"type": "number"},
          "height": {"type": "number"}
        }
      }
    },
    "required": ["url_or_html", "output_path"]
  }
}

{
  "name": "test_responsive",
  "description": "Test component at multiple viewport sizes",
  "inputSchema": {
    "type": "object",
    "properties": {
      "html": {"type": "string"},
      "viewports": {
        "type": "array",
        "items": {
          "type": "object",
          "properties": {
            "name": {"type": "string"},
            "width": {"type": "number"},
            "height": {"type": "number"}
          }
        },
        "default": [
          {"name": "mobile", "width": 375, "height": 667},
          {"name": "tablet", "width": 768, "height": 1024},
          {"name": "desktop", "width": 1280, "height": 720}
        ]
      }
    },
    "required": ["html"]
  }
}

{
  "name": "extract_css",
  "description": "Extract computed CSS from rendered page",
  "inputSchema": {
    "type": "object",
    "properties": {
      "html": {"type": "string"},
      "selector": {
        "type": "string",
        "description": "CSS selector"
      }
    },
    "required": ["html", "selector"]
  }
}
```

**Example Usage:**
```python
# Agent previews generated component
screenshot = take_screenshot(
    generated_html,
    "/workspace/preview-button-group.png",
    viewport={"width": 1280, "height": 720}
)

# Agent tests responsive behavior
responsive_tests = test_responsive(generated_html)
# Returns screenshots at mobile, tablet, desktop sizes
```

### 7. Component Preview Server

**Purpose:** Live preview server for testing components

```typescript
// Custom MCP Server: preview-server

{
  "name": "start_preview_server",
  "description": "Start local preview server",
  "inputSchema": {
    "type": "object",
    "properties": {
      "directory": {
        "type": "string",
        "description": "Directory to serve"
      },
      "port": {
        "type": "number",
        "default": 3000
      }
    },
    "required": ["directory"]
  }
}

{
  "name": "stop_preview_server",
  "description": "Stop preview server",
  "inputSchema": {
    "type": "object",
    "properties": {}
  }
}

{
  "name": "hot_reload",
  "description": "Trigger hot reload in browser",
  "inputSchema": {
    "type": "object",
    "properties": {
      "file_path": {
        "type": "string",
        "description": "File that changed"
      }
    },
    "required": ["file_path"]
  }
}
```

---

## Advanced Tools (Priority 3)

### 8. Design Token Validation

**Purpose:** Ensure proper use of USWDS design system

```typescript
// Custom MCP Server: design-token-validator

{
  "name": "validate_token_usage",
  "description": "Check if design tokens are used correctly",
  "inputSchema": {
    "type": "object",
    "properties": {
      "code": {
        "type": "string",
        "description": "CSS/SCSS/HTML code"
      },
      "check_contrast": {
        "type": "boolean",
        "default": true,
        "description": "Also check color contrast"
      }
    },
    "required": ["code"]
  }
}

{
  "name": "suggest_token_replacement",
  "description": "Suggest design token for hard-coded value",
  "inputSchema": {
    "type": "object",
    "properties": {
      "value": {
        "type": "string",
        "description": "Hard-coded value (e.g., '#005ea2', '16px')"
      },
      "type": {
        "type": "string",
        "enum": ["color", "spacing", "typography", "auto"],
        "default": "auto"
      }
    },
    "required": ["value"]
  }
}

{
  "name": "get_token_value",
  "description": "Get actual value of design token",
  "inputSchema": {
    "type": "object",
    "properties": {
      "token": {
        "type": "string",
        "description": "Token name (e.g., 'primary', 'units-2')"
      }
    },
    "required": ["token"]
  }
}

{
  "name": "list_tokens_by_category",
  "description": "List all tokens in a category",
  "inputSchema": {
    "type": "object",
    "properties": {
      "category": {
        "type": "string",
        "enum": ["color", "spacing", "font", "all"]
      }
    },
    "required": ["category"]
  }
}
```

**Example Usage:**
```python
# Agent checks for hard-coded colors
issues = validate_token_usage('<div style="color: #005ea2">')
# Returns: {"issues": ["Use design token 'primary' instead of '#005ea2'"]}

# Agent finds correct token for value
token = suggest_token_replacement("#005ea2", type="color")
# Returns: {"token": "primary", "value": "#005ea2", "confidence": 0.95}

# Agent converts hard-coded spacing
token = suggest_token_replacement("16px", type="spacing")
# Returns: {"token": "units-2", "value": "16px", "mixin": "u-padding-2"}
```

### 9. Semantic HTML Checker

**Purpose:** Ensure semantic HTML and proper structure

```typescript
// Custom MCP Server: semantic-html-checker

{
  "name": "check_semantic_html",
  "description": "Check if semantic HTML5 elements are used appropriately",
  "inputSchema": {
    "type": "object",
    "properties": {
      "html": {"type": "string"}
    },
    "required": ["html"]
  }
}

{
  "name": "suggest_semantic_alternative",
  "description": "Suggest semantic HTML for div/span usage",
  "inputSchema": {
    "type": "object",
    "properties": {
      "element": {
        "type": "string",
        "description": "HTML element with context"
      }
    },
    "required": ["element"]
  }
}

{
  "name": "check_heading_hierarchy",
  "description": "Validate heading structure (h1-h6)",
  "inputSchema": {
    "type": "object",
    "properties": {
      "html": {"type": "string"}
    },
    "required": ["html"]
  }
}

{
  "name": "check_landmark_structure",
  "description": "Validate ARIA landmarks and page structure",
  "inputSchema": {
    "type": "object",
    "properties": {
      "html": {"type": "string"}
    },
    "required": ["html"]
  }
}
```

**Example Usage:**
```python
# Agent checks for non-semantic HTML
issues = check_semantic_html('<div class="navigation">...</div>')
# Returns: {"suggestion": "Use <nav> instead of <div> for navigation"}

# Agent validates heading structure
hierarchy = check_heading_hierarchy(generated_page)
# Returns: {"valid": false, "issues": ["h3 used before h2"]}
```

### 10. Performance Analysis

**Purpose:** Check component performance and bundle size

```typescript
// Custom MCP Server: performance-analyzer

{
  "name": "analyze_bundle_size",
  "description": "Check CSS/JS bundle size",
  "inputSchema": {
    "type": "object",
    "properties": {
      "files": {
        "type": "array",
        "items": {"type": "string"}
      }
    },
    "required": ["files"]
  }
}

{
  "name": "check_unused_css",
  "description": "Find unused CSS classes",
  "inputSchema": {
    "type": "object",
    "properties": {
      "html": {"type": "string"},
      "css": {"type": "string"}
    },
    "required": ["html", "css"]
  }
}

{
  "name": "measure_render_time",
  "description": "Measure component render performance",
  "inputSchema": {
    "type": "object",
    "properties": {
      "html": {"type": "string"}
    },
    "required": ["html"]
  }
}
```

### 11. Code Quality Checks

**Purpose:** Linting, formatting, best practices

```typescript
// Custom MCP Server: code-quality-checker

{
  "name": "lint_html",
  "description": "Run HTMLHint linter",
  "inputSchema": {
    "type": "object",
    "properties": {
      "html": {"type": "string"},
      "rules": {
        "type": "object",
        "description": "Custom linting rules"
      }
    },
    "required": ["html"]
  }
}

{
  "name": "format_html",
  "description": "Format HTML with Prettier",
  "inputSchema": {
    "type": "object",
    "properties": {
      "html": {"type": "string"},
      "options": {
        "type": "object",
        "properties": {
          "tabWidth": {"type": "number", "default": 2},
          "useTabs": {"type": "boolean", "default": false}
        }
      }
    },
    "required": ["html"]
  }
}

{
  "name": "check_best_practices",
  "description": "Check against USWDS best practices",
  "inputSchema": {
    "type": "object",
    "properties": {
      "html": {"type": "string"}
    },
    "required": ["html"]
  }
}
```

---

## Integration Tools (Priority 4)

### 12. Figma Integration

**Purpose:** Import designs, sync with design system

```typescript
// Custom MCP Server: figma-integration

{
  "name": "get_figma_component",
  "description": "Fetch component from Figma",
  "inputSchema": {
    "type": "object",
    "properties": {
      "file_key": {"type": "string"},
      "component_id": {"type": "string"}
    },
    "required": ["file_key", "component_id"]
  }
}

{
  "name": "extract_design_tokens",
  "description": "Extract colors/spacing from Figma",
  "inputSchema": {
    "type": "object",
    "properties": {
      "file_key": {"type": "string"}
    },
    "required": ["file_key"]
  }
}
```

### 13. Database/CMS Integration

**Purpose:** Store generated components, track usage

```typescript
// Custom MCP Server: component-library-db

{
  "name": "save_component",
  "description": "Save component to library database",
  "inputSchema": {
    "type": "object",
    "properties": {
      "name": {"type": "string"},
      "category": {"type": "string"},
      "html": {"type": "string"},
      "metadata": {
        "type": "object",
        "properties": {
          "tags": {"type": "array", "items": {"type": "string"}},
          "author": {"type": "string"},
          "accessibility_score": {"type": "number"}
        }
      }
    },
    "required": ["name", "category", "html"]
  }
}

{
  "name": "search_components",
  "description": "Search component library",
  "inputSchema": {
    "type": "object",
    "properties": {
      "query": {"type": "string"},
      "filters": {
        "type": "object",
        "properties": {
          "category": {"type": "string"},
          "tags": {"type": "array"}
        }
      }
    },
    "required": ["query"]
  }
}

{
  "name": "get_component_usage_stats",
  "description": "Get usage statistics for component",
  "inputSchema": {
    "type": "object",
    "properties": {
      "component_id": {"type": "string"}
    },
    "required": ["component_id"]
  }
}
```

### 14. Testing Framework Integration

**Purpose:** Run automated tests, track test results

```typescript
// Custom MCP Server: testing-integration

{
  "name": "run_jest_tests",
  "description": "Run Jest tests for component",
  "inputSchema": {
    "type": "object",
    "properties": {
      "test_file": {"type": "string"}
    },
    "required": ["test_file"]
  }
}

{
  "name": "generate_test_cases",
  "description": "Generate test cases for component",
  "inputSchema": {
    "type": "object",
    "properties": {
      "component_html": {"type": "string"},
      "framework": {
        "type": "string",
        "enum": ["jest", "mocha", "cypress"]
      }
    },
    "required": ["component_html"]
  }
}

{
  "name": "run_visual_regression",
  "description": "Run visual regression tests",
  "inputSchema": {
    "type": "object",
    "properties": {
      "component": {"type": "string"},
      "baseline_path": {"type": "string"}
    },
    "required": ["component", "baseline_path"]
  }
}
```

---

## Example: Complete MCP Configuration

```json
{
  "mcpServers": {
    "filesystem": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-filesystem", "/workspace"]
    },
    "uswds-docs": {
      "command": "node",
      "args": ["./mcp-servers/uswds-docs-server.js"]
    },
    "validator": {
      "command": "node",
      "args": ["./mcp-servers/uswds-validator-server.js"]
    },
    "accessibility": {
      "command": "node",
      "args": ["./mcp-servers/accessibility-testing-server.js"]
    },
    "git": {
      "command": "uvx",
      "args": ["mcp-server-git", "--repository", "/workspace"]
    },
    "browser": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-puppeteer"]
    },
    "preview": {
      "command": "node",
      "args": ["./mcp-servers/preview-server.js"]
    },
    "design-tokens": {
      "command": "node",
      "args": ["./mcp-servers/design-token-validator.js"]
    }
  }
}
```

---

## Implementation Priority

### Week 1: Essential Tools
- [ ] Filesystem operations (read/write/list)
- [ ] Basic USWDS docs access
- [ ] HTML validation
- [ ] USWDS class validation

### Week 2: Core Functionality
- [ ] Accessibility testing (axe-core)
- [ ] Git integration
- [ ] Browser preview
- [ ] ARIA suggestion

### Week 3: Advanced Features
- [ ] Design token validation
- [ ] Semantic HTML checker
- [ ] Responsive testing
- [ ] Performance analysis

### Week 4: Integration & Polish
- [ ] Component library database
- [ ] Test generation
- [ ] Visual regression
- [ ] Monitoring & analytics

---

## Creating Custom MCP Server

### Example: USWDS Validator Server

```javascript
// mcp-servers/uswds-validator-server.js
#!/usr/bin/env node

const { Server } = require('@modelcontextprotocol/sdk/server/index.js');
const { StdioServerTransport } = require('@modelcontextprotocol/sdk/server/stdio.js');
const { z } = require('zod');
const { JSDOM } = require('jsdom');

// Create server
const server = new Server(
  {
    name: 'uswds-validator-server',
    version: '1.0.0',
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// Define tools
server.setRequestHandler('tools/list', async () => {
  return {
    tools: [
      {
        name: 'validate_uswds_classes',
        description: 'Check if USWDS classes are used correctly',
        inputSchema: {
          type: 'object',
          properties: {
            html: {
              type: 'string',
              description: 'HTML code to validate'
            }
          },
          required: ['html']
        }
      },
      {
        name: 'validate_accessibility',
        description: 'Check WCAG 2.1 AA compliance',
        inputSchema: {
          type: 'object',
          properties: {
            html: {
              type: 'string',
              description: 'HTML code to check'
            },
            level: {
              type: 'string',
              enum: ['A', 'AA', 'AAA'],
              default: 'AA'
            }
          },
          required: ['html']
        }
      }
    ]
  };
});

// Implement tool handlers
server.setRequestHandler('tools/call', async (request) => {
  const { name, arguments: args } = request.params;

  if (name === 'validate_uswds_classes') {
    return await validateUSWDSClasses(args.html);
  }
  
  if (name === 'validate_accessibility') {
    return await validateAccessibility(args.html, args.level || 'AA');
  }

  throw new Error(`Unknown tool: ${name}`);
});

// Validation functions
async function validateUSWDSClasses(html) {
  const dom = new JSDOM(html);
  const document = dom.window.document;
  const issues = [];

  // Check for usa- prefix
  const elements = document.querySelectorAll('[class]');
  let hasUSWDSClasses = false;

  elements.forEach(el => {
    const classes = el.className.split(' ');
    classes.forEach(cls => {
      if (cls.startsWith('usa-')) {
        hasUSWDSClasses = true;
      }
    });
  });

  if (!hasUSWDSClasses) {
    issues.push({
      severity: 'warning',
      message: 'No USWDS classes (usa- prefix) found',
      line: 1
    });
  }

  // Check for common mistakes
  const buttons = document.querySelectorAll('button');
  buttons.forEach((btn, idx) => {
    if (!btn.classList.contains('usa-button')) {
      issues.push({
        severity: 'warning',
        message: `Button element should have 'usa-button' class`,
        line: idx + 1,
        element: btn.outerHTML.slice(0, 50)
      });
    }
  });

  // Check for BEM modifier pattern
  elements.forEach(el => {
    const classes = el.className.split(' ');
    classes.forEach(cls => {
      // Check if modifier used without base class
      if (cls.includes('--') && cls.startsWith('usa-')) {
        const baseClass = cls.split('--')[0];
        if (!classes.includes(baseClass)) {
          issues.push({
            severity: 'error',
            message: `Modifier '${cls}' used without base class '${baseClass}'`,
            element: el.outerHTML.slice(0, 50)
          });
        }
      }
    });
  });

  return {
    content: [{
      type: 'text',
      text: JSON.stringify({
        valid: issues.length === 0,
        issues: issues,
        summary: `Found ${issues.length} issues`
      }, null, 2)
    }]
  };
}

async function validateAccessibility(html, level) {
  const dom = new JSDOM(html);
  const document = dom.window.document;
  const issues = [];

  // Check for ARIA labels on interactive elements
  const interactive = document.querySelectorAll('button, a, input, select, textarea');
  interactive.forEach((el, idx) => {
    const hasLabel = el.getAttribute('aria-label') || 
                     el.getAttribute('aria-labelledby') ||
                     el.textContent.trim() ||
                     (el.tagName === 'INPUT' && document.querySelector(`label[for="${el.id}"]`));
    
    if (!hasLabel) {
      issues.push({
        severity: 'error',
        message: `Interactive element missing accessible label`,
        rule: 'WCAG 4.1.2',
        element: el.outerHTML.slice(0, 50)
      });
    }
  });

  // Check for alt text on images
  const images = document.querySelectorAll('img');
  images.forEach((img, idx) => {
    if (!img.hasAttribute('alt')) {
      issues.push({
        severity: 'error',
        message: 'Image missing alt attribute',
        rule: 'WCAG 1.1.1',
        element: img.outerHTML.slice(0, 50)
      });
    }
  });

  // Check for form labels
  const inputs = document.querySelectorAll('input, select, textarea');
  inputs.forEach((input, idx) => {
    if (input.id) {
      const label = document.querySelector(`label[for="${input.id}"]`);
      if (!label && !input.getAttribute('aria-label')) {
        issues.push({
          severity: 'error',
          message: 'Form input missing associated label',
          rule: 'WCAG 3.3.2',
          element: input.outerHTML.slice(0, 50)
        });
      }
    }
  });

  return {
    content: [{
      type: 'text',
      text: JSON.stringify({
        valid: issues.length === 0,
        level: level,
        issues: issues,
        summary: `${issues.length} accessibility issues found`
      }, null, 2)
    }]
  };
}

// Start server
const transport = new StdioServerTransport();
server.connect(transport);

console.error('USWDS Validator MCP server running on stdio');
```

Make it executable:
```bash
chmod +x mcp-servers/uswds-validator-server.js
npm install @modelcontextprotocol/sdk jsdom
```

Test it:
```bash
node mcp-servers/uswds-validator-server.js
```

---

## Tool Call Examples in Agent

```python
from langchain_core.tools import tool

@tool
def validate_uswds_code(html: str) -> dict:
    """Validate USWDS code using MCP server"""
    # MCP call happens automatically via LangGraph
    pass

@tool  
def check_accessibility(html: str, level: str = "AA") -> dict:
    """Check accessibility compliance"""
    pass

@tool
def preview_component(html: str) -> str:
    """Generate preview URL for component"""
    pass

# Agent workflow
agent_prompt = """
When generating a component:
1. Use read_file to see USWDS examples
2. Generate the component code
3. Use validate_uswds_code to check classes
4. Use check_accessibility to verify WCAG compliance
5. If issues found, fix and repeat validation
6. Use preview_component to generate live preview
7. Use write_file to save final version
8. Use git_commit to version control

Always iterate until all validations pass.
"""
```

---

## Summary: Recommended Tool Stack

**Minimum Viable Product (MVP):**
- Filesystem (read/write/list)
- USWDS docs lookup
- HTML validation
- Basic accessibility check

**Production Ready:**
- All MVP tools
- Git version control
- Browser preview
- Axe-core accessibility testing
- Design token validation

**Enterprise Grade:**
- All Production tools
- Component library database
- Visual regression testing
- Performance monitoring
- Figma integration
- Automated test generation

**Start with MVP tools, then gradually add more based on your needs!**
