# USWDS MCP Server - Tool Reference

Complete reference for all 18 MCP tools available in the USWDS MCP Server.

## 📋 Table of Contents

- [Component Tools](#component-tools) (2 tools)
- [Design Tokens](#design-tokens) (1 tool)
- [Validation Tools](#validation-tools) (1 tool)
- [Accessibility Tools](#accessibility-tools) (1 tool)
- [Icon Tools](#icon-tools) (1 tool)
- [Layout & Suggestion Tools](#layout--suggestion-tools) (3 tools)
- [Code Generation](#code-generation) (1 tool)
- [Tailwind + USWDS Tools](#tailwind--uswds-tools) (7 tools)
- [Usage Examples](#usage-examples)

---

## Component Tools

### 1. `list_components`

List all available USWDS or React-USWDS components with descriptions.

**Parameters:**
- `category` (string, optional): Filter by category
  - Options: `"all"`, `"forms"`, `"navigation"`, `"layout"`, `"content"`, `"ui"`
  - Default: `"all"`

**Example Usage:**
```javascript
// In Claude Desktop
"List all USWDS components in the forms category"
```

**Response:**
Returns list of components including Button, TextInput, Select, Checkbox, Radio, DatePicker, etc.

---

### 2. `get_component_info`

Get detailed information about a specific USWDS component including props, variants, and usage examples.

**Parameters:**
- `component_name` (string, **required**): Name of the component (e.g., "Button", "Alert")
- `include_examples` (boolean, optional): Include code examples (default: true)

**Example Usage:**
```javascript
// In Claude Desktop
"Show me how to use the USWDS Button component"
```

**Response:**
Returns:
- Component description
- All variants (primary, secondary, accent, outline, etc.)
- Props documentation
- Code examples for React-USWDS and vanilla USWDS
- Accessibility guidelines
- Related components

---

## Design Tokens

### 3. `get_design_tokens`

Get USWDS design tokens for colors, spacing, typography, and breakpoints.

**Parameters:**
- `category` (string, optional): Filter by category
  - Options: `"all"`, `"color"`, `"spacing"`, `"typography"`, `"breakpoints"`
  - Default: `"all"`

**Example Usage:**
```javascript
// In Claude Desktop
"What are the USWDS color tokens?"
```

**Response:**
Returns design tokens with values:
- **Colors:** Primary colors (blue-60v, red-warm-50v), semantic colors (success, error, warning, info)
- **Spacing:** units-05, units-1, units-2, units-3, units-4, units-5, units-6, units-7
- **Typography:** font-sans, font-serif, font-mono, size-xs through size-3xl
- **Breakpoints:** mobile, mobile-lg, tablet, tablet-lg, desktop, desktop-lg, widescreen

---

## Validation Tools

### 4. `validate_uswds_code`

Validate HTML or JSX code for USWDS patterns, class usage, and accessibility issues.

**Parameters:**
- `code` (string, **required**): HTML or JSX code to validate
- `framework` (string, optional): `"html"` or `"react"` (default: `"html"`)

**Example Usage:**
```javascript
// In Claude Desktop
"Validate this USWDS code: <button class='usa-button'>Click me</button>"
```

**Response:**
Returns:
- Validation status (valid/invalid)
- Score (0-10)
- List of issues (errors, warnings, info)
- Suggestions for improvement
- Accessibility recommendations
- Best practices

---

## Accessibility Tools

### 5. `check_color_contrast`

Check WCAG color contrast ratios between foreground and background colors.

**Parameters:**
- `foreground` (string, **required**): Foreground color (hex, rgb, or USWDS token)
- `background` (string, **required**): Background color (hex, rgb, or USWDS token)

**Example Usage:**
```javascript
// In Claude Desktop
"Check color contrast between #005ea2 and #ffffff"
```

**Response:**
Returns:
- Contrast ratio (e.g., 7.1:1)
- WCAG AA compliance (normal text, large text)
- WCAG AAA compliance (normal text, large text)
- Pass/fail status
- Recommendations

---

## Icon Tools

### 6. `search_icons`

Search through all available USWDS icons by keyword.

**Parameters:**
- `query` (string, optional): Search term (empty returns all icons)

**Example Usage:**
```javascript
// In Claude Desktop
"Find USWDS icons related to navigation"
```

**Response:**
Returns:
- List of matching icons
- Icon categories
- Usage instructions
- SVG code
- Accessibility notes

---

## Layout & Suggestion Tools

### 7. `suggest_layout`

Get USWDS layout pattern suggestions for different page types.

**Parameters:**
- `page_type` (string, **required**): Type of page (e.g., "dashboard", "landing", "form", "documentation")

**Example Usage:**
```javascript
// In Claude Desktop
"Suggest a USWDS layout for a landing page"
```

**Response:**
Returns:
- Grid structure recommendations
- Component suggestions for each section
- Code examples
- Accessibility considerations
- Responsive design patterns

---

### 8. `suggest_components`

Get component recommendations for specific use cases.

**Parameters:**
- `use_case` (string, **required**): Description of what you're building

**Example Usage:**
```javascript
// In Claude Desktop
"What USWDS components should I use for a user registration form?"
```

**Response:**
Returns:
- Recommended components
- Relevance score for each component
- Usage examples
- Accessibility guidelines
- Common patterns

---

### 9. `compare_components`

Compare two similar USWDS components to understand their differences.

**Parameters:**
- `components` (array, **required**): Array of 2 component names to compare

**Example Usage:**
```javascript
// In Claude Desktop
"Compare USWDS Alert and Banner components"
```

**Response:**
Returns:
- Side-by-side comparison
- Key differences
- When to use each component
- Props comparison
- Use case recommendations

---

## Code Generation

### 10. `generate_component_code`

Generate ready-to-use code for USWDS components with specified props.

**Parameters:**
- `component_name` (string, **required**): Component to generate
- `props` (object, optional): Component props/configuration
- `framework` (string, optional): `"html"` or `"react"`

**Example Usage:**
```javascript
// In Claude Desktop
"Generate code for a primary Button that says 'Submit'"
```

**Response:**
Returns:
- Complete code (React-USWDS or vanilla USWDS)
- Required imports
- Props configured
- Accessibility attributes
- Usage notes

---

## Tailwind + USWDS Tools

### 11. `get_tailwind_uswds_getting_started`

Get the complete Tailwind + USWDS integration guide.

**Parameters:** None

**Example Usage:**
```javascript
// In Claude Desktop
"How do I integrate Tailwind CSS with USWDS?"
```

**Response:**
Returns complete integration guide with installation and configuration steps.

---

### 12. `get_tailwind_uswds_component`

Get Tailwind class mappings for USWDS components.

**Parameters:**
- `component_name` (string, optional): Component to get Tailwind classes for

**Example Usage:**
```javascript
// In Claude Desktop
"Show me Tailwind classes for USWDS Button"
```

**Response:**
Returns Tailwind utility class equivalents for USWDS component styles.

---

### 13. `get_tailwind_uswds_javascript`

Get JavaScript integration guide for Tailwind + USWDS.

**Parameters:** None

**Response:**
Returns JavaScript setup and configuration guide.

---

### 14. `get_tailwind_uswds_colors`

Get Tailwind color utility classes for USWDS colors.

**Parameters:** None

**Example Usage:**
```javascript
// In Claude Desktop
"What are the Tailwind color classes for USWDS?"
```

**Response:**
Returns complete USWDS color palette as Tailwind utilities:
- `text-primary-darker`, `bg-secondary-light`, etc.
- Color values and hex codes
- Usage examples

---

### 15. `get_tailwind_uswds_icons`

Get icon integration guide for Tailwind + USWDS.

**Parameters:** None

**Response:**
Returns icon usage guide with Tailwind.

---

### 16. `get_tailwind_uswds_typography`

Get Tailwind typography utilities for USWDS.

**Parameters:** None

**Response:**
Returns USWDS typography as Tailwind classes:
- Font families
- Font sizes
- Line heights
- Font weights

---

### 17. `search_tailwind_uswds_docs`

Search Tailwind + USWDS documentation.

**Parameters:**
- `query` (string, **required**): Search term

**Example Usage:**
```javascript
// In Claude Desktop
"Search Tailwind USWDS docs for spacing utilities"
```

**Response:**
Returns relevant documentation sections matching the query.

---

## Usage Examples

### In Claude Desktop

Configure in `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "uswds": {
      "command": "node",
      "args": ["/path/to/uswds-local-mcp-server/dist/index.js"],
      "env": {
        "USE_REACT_COMPONENTS": "true"
      }
    }
  }
}
```

Then in Claude Desktop, ask natural language questions:
- "List all USWDS form components"
- "How do I use the Alert component?"
- "Check if #005ea2 on white is accessible"
- "Generate a primary button with the label 'Submit'"

### Via HTTP (Lambda)

Send JSON-RPC 2.0 requests to your Lambda Function URL:

```bash
curl -X POST https://your-function-url.lambda-url.us-east-1.on.aws \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer your-api-key" \
  -d '{
    "jsonrpc": "2.0",
    "id": 1,
    "method": "tools/call",
    "params": {
      "name": "list_components",
      "arguments": {
        "category": "forms"
      }
    }
  }'
```

**Response:**
```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": {
    "content": [
      {
        "type": "text",
        "text": "{\"mode\":\"react-uswds\",\"category\":\"forms\",...}"
      }
    ]
  }
}
```

### Rate Limiting

The remote server includes rate limiting:

**Headers in every response:**
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 99
X-RateLimit-Reset: 60
X-Request-Id: abc-123
X-Processing-Time: 45ms
```

**Rate limit error (429):**
```json
{
  "error": "Too Many Requests",
  "message": "Rate limit exceeded. You can make 100 requests per minute. Try again in 45 seconds.",
  "retryAfter": 45
}
```

---

## Tool Status

| Tool | Status | Notes |
|------|--------|-------|
| list_components | ✅ Working | Fully tested |
| get_component_info | ✅ Working | Fully tested |
| get_design_tokens | ✅ Working | Fully tested |
| validate_uswds_code | ✅ Working | Fully tested |
| check_color_contrast | ✅ Working | Fully tested |
| search_icons | ✅ Working | Fully tested |
| suggest_layout | ✅ Working | Fully tested |
| suggest_components | ✅ Working | Fully tested |
| compare_components | ✅ Working | Fully tested |
| generate_component_code | ✅ Working | Fully tested |
| get_tailwind_uswds_getting_started | ⚠️ External | Requires v2.uswds-tailwind.com access |
| get_tailwind_uswds_component | ⚠️ External | Requires v2.uswds-tailwind.com access |
| get_tailwind_uswds_javascript | ⚠️ External | Requires v2.uswds-tailwind.com access |
| get_tailwind_uswds_colors | ⚠️ External | Requires v2.uswds-tailwind.com access |
| get_tailwind_uswds_icons | ⚠️ External | Requires v2.uswds-tailwind.com access |
| get_tailwind_uswds_typography | ⚠️ External | Requires v2.uswds-tailwind.com access |
| search_tailwind_uswds_docs | ✅ Working | Fully tested |

**Test Results:** 11/11 core tools passing (100%), 6 Tailwind tools depend on external site availability.

---

## Additional Resources

- **Getting Started:** See [Getting Started Guide](./GETTING_STARTED.md) or visit https://uswdsmcp.com/getting-started
- **API Documentation:** See [Documentation](./DOCUMENTATION.md) or visit https://uswdsmcp.com/docs
- **GitHub Repository:** https://github.com/ctrimm/uswds-local-mcp-server
- **Issue Tracker:** https://github.com/ctrimm/uswds-local-mcp-server/issues

---

## Version Information

- **MCP Server Version:** 0.2.0
- **USWDS Version:** 3.13.0
- **React-USWDS Version:** 11.0.0
- **MCP Protocol:** 2025-03-26
- **JSON-RPC Version:** 2.0
