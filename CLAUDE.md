# CLAUDE.md - AI Assistant Guide

**Repository:** uswds-local-mcp-server
**Purpose:** Local MCP (Model Context Protocol) server toolkit for USWDS (U.S. Web Design System) code generation and validation
**Last Updated:** 2025-11-18

---

## Table of Contents

1. [Repository Overview](#repository-overview)
2. [Codebase Structure](#codebase-structure)
3. [Key Concepts](#key-concepts)
4. [Development Workflow](#development-workflow)
5. [Coding Conventions](#coding-conventions)
6. [Testing Guidelines](#testing-guidelines)
7. [Common Tasks](#common-tasks)
8. [Troubleshooting](#troubleshooting)
9. [AI Assistant Guidelines](#ai-assistant-guidelines)

---

## Repository Overview

### What is This Project?

This is a **local MCP server toolkit** designed to enable AI agents (like Claude) to generate accessible, WCAG-compliant USWDS (U.S. Web Design System) components. The project combines:

- **MCP Servers**: Modular context providers that give AI access to filesystem, documentation, validation, and browser testing
- **USWDS Coding Agent**: Fine-tuned LLM specialized in generating USWDS-compliant HTML/CSS components
- **Validation Pipeline**: Multi-layer validation ensuring accessibility, semantic HTML, and design system compliance

### Project Goals

1. **Automate USWDS component generation** with AI assistance
2. **Ensure accessibility compliance** (WCAG 2.1 AA minimum)
3. **Maintain design system consistency** using USWDS design tokens
4. **Provide local-first development** without cloud dependencies
5. **Enable agentic workflows** through MCP protocol integration

### Current State

**Status:** Early development / Documentation phase

The repository currently contains:
- ✅ Comprehensive setup documentation (SETUP.md)
- ✅ Technical implementation guide (USWDS_AGENT_IMPLEMENTATION.md)
- ✅ MCP tools specification (MCP_TOOLS_GUIDE.md)
- ⏳ Source code (to be implemented)
- ⏳ MCP server implementations (to be implemented)
- ⏳ Agent scripts (to be implemented)

---

## Codebase Structure

### Current Directory Layout

```
uswds-local-mcp-server/
├── .git/                          # Git repository
├── CLAUDE.md                      # This file - AI assistant guide
├── SETUP.md                       # Installation and setup instructions
├── USWDS_AGENT_IMPLEMENTATION.md  # Technical implementation guide
├── MCP_TOOLS_GUIDE.md            # MCP server tools specification
└── README.md                      # (to be created) Project overview
```

### Planned Directory Structure

Based on the documentation, the final structure will be:

```
uswds-local-mcp-server/
├── .git/
├── .gitignore
├── README.md                      # Project overview
├── CLAUDE.md                      # AI assistant guide (this file)
├── SETUP.md                       # Setup instructions
├── USWDS_AGENT_IMPLEMENTATION.md  # Implementation guide
├── MCP_TOOLS_GUIDE.md            # MCP tools spec
│
├── config/                        # Configuration files
│   ├── mcp-config.json           # MCP server configuration
│   └── validation-rules.json     # USWDS validation rules
│
├── servers/                       # MCP server implementations
│   ├── filesystem/               # File operations server
│   ├── uswds-docs/              # USWDS documentation server
│   ├── validator/                # Code validation server
│   ├── accessibility/            # Accessibility testing server
│   ├── design-tokens/            # Design token validator
│   ├── browser/                  # Browser testing server (Puppeteer)
│   ├── git/                      # Git operations server
│   └── preview/                  # Live preview server
│
├── agent/                         # USWDS coding agent
│   ├── requirements.txt          # Python dependencies
│   ├── uswds_agent.py           # Main agent script (LangGraph)
│   ├── tools.py                  # Agent tool definitions
│   └── prompts.py                # System prompts and templates
│
├── scripts/                       # Utility scripts
│   ├── download_uswds_docs.sh   # Download USWDS documentation
│   ├── extract_components.py     # Extract component examples
│   ├── generate_synthetic_data.py # Synthetic training data generation
│   ├── format_training_data.py   # Format data for fine-tuning
│   ├── finetune_model.py        # Model fine-tuning script
│   ├── test_model.sh            # Model testing
│   └── health-check.js          # System health check
│
├── data/                          # Data directory
│   ├── uswds-repo/              # Cloned USWDS repository
│   ├── cache/                    # Cached documentation
│   ├── uswds_components.json    # Extracted components
│   ├── training/                 # Training data
│   │   └── uswds_training.jsonl
│   └── components.db            # Component library database (SQLite)
│
├── workspace/                     # User workspace for generated components
│
├── models/                        # Fine-tuned models
│   ├── uswds-coder-lora/        # LoRA adapters
│   ├── uswds-coder-gguf/        # GGUF quantized models
│   └── Modelfile                 # OLLAMA Modelfile
│
├── tests/                         # Test suites
│   ├── fixtures/                 # Test fixtures
│   ├── test_agent.py            # Agent tests
│   └── test_mcp_servers.py      # MCP server tests
│
├── logs/                          # Log files
│   └── uswds-agent.log
│
└── package.json                   # Node.js dependencies (for MCP servers)
```

---

## Key Concepts

### 1. USWDS (U.S. Web Design System)

**What it is:** A design system for the U.S. federal government providing reusable, accessible components.

**Key Features:**
- Component library (buttons, forms, alerts, etc.)
- Design tokens (colors, spacing, typography)
- Accessibility-first approach (WCAG 2.1 AA+)
- Responsive, mobile-first patterns
- Semantic HTML with ARIA attributes

**Class Naming Convention:**
- Base classes: `usa-{component}` (e.g., `usa-button`, `usa-input`)
- Modifiers: `usa-{component}--{modifier}` (e.g., `usa-button--outline`)
- Utilities: `usa-{utility}` (e.g., `usa-sr-only`)

**Resources:**
- Official site: https://designsystem.digital.gov
- Repository: https://github.com/uswds/uswds
- Documentation: Referenced via MCP servers

### 2. MCP (Model Context Protocol)

**What it is:** A standardized protocol for AI models to interact with external tools and data sources.

**Architecture:**
- **Client:** AI agent (e.g., Claude via LangGraph)
- **Server:** Specialized tool provider (filesystem, docs, validation)
- **Transport:** stdio or HTTP communication
- **Tools:** Functions the AI can call with structured inputs/outputs

**Example Tool Call:**
```json
{
  "tool": "validate_uswds_classes",
  "arguments": {
    "html": "<button class=\"usa-button\">Click me</button>"
  },
  "response": {
    "valid": true,
    "issues": [],
    "score": 10.0
  }
}
```

**MCP Servers in This Project:**
1. **filesystem** - Read/write USWDS templates and generated components
2. **uswds-docs** - Fetch component documentation and examples
3. **validator** - Validate HTML, USWDS classes, design tokens
4. **accessibility** - Run axe-core, pa11y, check WCAG compliance
5. **design-tokens** - Validate token usage, suggest replacements
6. **browser** - Render components, take screenshots, test responsive
7. **git** - Version control operations
8. **preview** - Live preview server with hot reload

### 3. Agent Architecture (LangGraph + OLLAMA)

**Components:**
- **LLM:** Fine-tuned Llama 3.1 8B (via OLLAMA) specialized in USWDS
- **Framework:** LangGraph for agentic workflows
- **Tools:** MCP servers exposed as LangChain tools
- **Workflow:** ReAct pattern (Reasoning + Acting)

**Agent Loop:**
```
1. User Request: "Create an accessible USWDS button group"
2. Agent Reasoning: "I need to see USWDS button examples first"
3. Tool Call: read_uswds_component("usa-button")
4. Agent Reasoning: "Now I'll generate code based on these examples"
5. Code Generation: <generates HTML>
6. Tool Call: validate_uswds_classes(generated_code)
7. Validation: Issues found → Agent fixes → Re-validates
8. Tool Call: write_component("button-group.html", final_code)
9. Response: "Created accessible button group at workspace/button-group.html"
```

### 4. Fine-tuning Pipeline

**Process:**
1. **Data Collection:** Extract USWDS docs and component examples
2. **Synthetic Generation:** Use Llama 3.1 70B + synthetic-data-kit
3. **Formatting:** Convert to Llama 3.1 chat format with USWDS-specific system prompts
4. **Fine-tuning:** Use Unsloth + LoRA on Llama 3.1 8B
5. **Export:** Convert to GGUF and import to OLLAMA
6. **Testing:** Validate against USWDS examples

**Training Data Format:**
```
<|begin_of_text|><|start_header_id|>system<|end_header_id|>
You are an expert in USWDS. Generate accessible code following WCAG 2.1 AA standards.
<|eot_id|><|start_header_id|>user<|end_header_id|>
Create a USWDS primary button
<|eot_id|><|start_header_id|>assistant<|end_header_id|>
Here's an accessible USWDS primary button:

```html
<button class="usa-button" type="button">
  Click me
</button>
```

This uses the base `usa-button` class which provides primary button styling...
<|eot_id|>
```

---

## Development Workflow

### Initial Setup

**Prerequisites:**
- Ubuntu 20.04+ or macOS
- Node.js 18+
- Python 3.10+
- OLLAMA installed
- (Optional) NVIDIA GPU for fine-tuning

**Setup Steps:**
1. Clone repository
2. Install dependencies: `npm install && pip install -r requirements.txt`
3. Clone USWDS repo: `git clone https://github.com/uswds/uswds.git data/uswds-repo`
4. Configure MCP servers: Edit `config/mcp-config.json`
5. Start MCP servers: `npm run start:servers`
6. Test connectivity: `npm run test:connectivity`

See [SETUP.md](SETUP.md) for detailed instructions.

### Implementing a New MCP Server

**Step 1:** Create server directory
```bash
mkdir -p servers/my-server
cd servers/my-server
npm init -y
npm install @modelcontextprotocol/sdk
```

**Step 2:** Implement server (see MCP_TOOLS_GUIDE.md for examples)

**Step 3:** Add to config
```json
{
  "mcpServers": {
    "my-server": {
      "command": "node",
      "args": ["./servers/my-server/index.js"]
    }
  }
}
```

**Step 4:** Create agent tool wrapper
```python
@tool
def my_tool(arg: str) -> dict:
    """Tool description for agent"""
    # MCP call handled by LangGraph
    pass
```

### Implementing Agent Workflows

**Pattern:** Use LangGraph's ReAct agent with MCP tools

**Example:**
```python
from langgraph.prebuilt import create_react_agent
from langchain_ollama import ChatOllama

# Define tools
tools = [
    read_uswds_component,
    write_component,
    validate_html,
    validate_accessibility
]

# Create agent
agent = create_react_agent(
    ChatOllama(model="uswds-coder"),
    tools,
    state_modifier=SystemMessage(content="""
    When generating USWDS components:
    1. Read official examples first
    2. Generate complete, accessible code
    3. Validate with tools
    4. Fix issues iteratively
    5. Save final version
    """)
)

# Run
result = agent.invoke({
    "messages": [HumanMessage(content="Create a form with validation")]
})
```

### Testing Workflow

**Unit Tests:**
```bash
npm test                    # Test MCP servers
python -m pytest tests/     # Test agent
```

**Integration Tests:**
```bash
npm run test:integration    # Full workflow test
```

**Manual Testing:**
```bash
python scripts/uswds_agent.py "Create a USWDS alert"
cat workspace/*.html        # Verify output
```

### Committing Changes

**Branch Naming:**
- Feature: `claude/feature-name-{session-id}`
- Fix: `claude/fix-name-{session-id}`
- Current: `claude/claude-md-mi51upgjpkzof7sp-01AUNbbJo4f7HP2HKcuRYzUV`

**Commit Message Format:**
```
feat: Add accessibility testing MCP server

- Implement axe-core integration
- Add WCAG 2.1 AA validation
- Include color contrast checking
```

**Git Commands:**
```bash
git add .
git commit -m "feat: Your descriptive message"
git push -u origin claude/branch-name-{session-id}
```

---

## Coding Conventions

### JavaScript/TypeScript (MCP Servers)

**Style:**
- Use ES6+ features
- Async/await for async operations
- JSDoc comments for functions
- 2-space indentation

**Example:**
```javascript
/**
 * Validate USWDS class usage in HTML
 * @param {string} html - HTML code to validate
 * @returns {Promise<ValidationResult>}
 */
async function validateUSWDSClasses(html) {
  const dom = new JSDOM(html);
  const issues = [];

  // Check for usa- prefix
  const elements = dom.window.document.querySelectorAll('[class]');
  // ... validation logic

  return {
    valid: issues.length === 0,
    issues
  };
}
```

**Error Handling:**
```javascript
try {
  const result = await someOperation();
  return { success: true, data: result };
} catch (error) {
  console.error('Operation failed:', error);
  return { success: false, error: error.message };
}
```

### Python (Agent Scripts)

**Style:**
- PEP 8 compliance
- Type hints
- Docstrings (Google style)
- 4-space indentation

**Example:**
```python
def validate_component(html: str, level: str = "AA") -> dict:
    """Validate USWDS component for accessibility.

    Args:
        html: HTML code to validate
        level: WCAG level (A, AA, or AAA)

    Returns:
        Dictionary with validation results

    Raises:
        ValueError: If html is empty
    """
    if not html:
        raise ValueError("HTML cannot be empty")

    issues = []
    # ... validation logic

    return {
        "valid": len(issues) == 0,
        "issues": issues,
        "level": level
    }
```

**Tool Definitions:**
```python
from langchain_core.tools import tool

@tool
def read_uswds_component(component_name: str) -> str:
    """Read USWDS component template from packages directory.

    Args:
        component_name: Name like 'usa-button', 'usa-input'
    """
    # Implementation
    pass
```

### HTML/CSS (USWDS Components)

**Critical Rules:**
1. **Always use USWDS classes** - Never hard-code styles
2. **Design tokens only** - No hex colors or pixel values
3. **Semantic HTML** - Use proper elements (button, nav, article, etc.)
4. **ARIA attributes** - Required for interactive elements
5. **Complete code** - No placeholders or "..."

**Good Example:**
```html
<button class="usa-button usa-button--outline"
        type="button"
        aria-label="Submit form">
  Submit
</button>
```

**Bad Example:**
```html
<!-- Missing ARIA, hard-coded style, wrong element -->
<div class="button" style="color: #005ea2" onclick="...">
  Submit
</div>
```

### Configuration Files

**JSON:** Use 2-space indentation
```json
{
  "servers": {
    "filesystem": {
      "enabled": true,
      "port": 3001
    }
  }
}
```

**YAML:** Use 2-space indentation
```yaml
generation:
  type: cot
  num_pairs: 100
  temperature: 0.7
```

---

## Testing Guidelines

### MCP Server Testing

**Test Structure:**
```javascript
describe('USWDS Validator Server', () => {
  let server;

  beforeAll(async () => {
    server = await startServer();
  });

  afterAll(async () => {
    await server.stop();
  });

  test('should validate USWDS classes', async () => {
    const html = '<button class="usa-button">Click</button>';
    const result = await server.call('validate_uswds_classes', { html });

    expect(result.valid).toBe(true);
    expect(result.issues).toHaveLength(0);
  });

  test('should detect missing usa- prefix', async () => {
    const html = '<button class="button">Click</button>';
    const result = await server.call('validate_uswds_classes', { html });

    expect(result.valid).toBe(false);
    expect(result.issues).toContainEqual(
      expect.objectContaining({
        message: expect.stringContaining('usa-')
      })
    );
  });
});
```

### Agent Testing

**Test Cases:**
```python
def test_agent_generates_button():
    """Test agent can generate USWDS button"""
    result = agent.invoke({
        "messages": [HumanMessage(content="Create a USWDS primary button")]
    })

    final_message = result["messages"][-1].content
    assert "usa-button" in final_message
    assert "<button" in final_message
    assert "class=" in final_message

def test_agent_validates_before_saving():
    """Test agent validates code before writing"""
    result = agent.invoke({
        "messages": [HumanMessage(content="Create a button")]
    })

    # Check that validate_html was called
    tool_calls = [m for m in result["messages"] if hasattr(m, 'tool_calls')]
    assert any('validate' in str(tc) for tc in tool_calls)
```

### Accessibility Testing

**Automated:**
```javascript
const { test } = require('@axe-core/playwright');

test('USWDS button is accessible', async ({ page }) => {
  await page.setContent(`
    <button class="usa-button">Click me</button>
  `);

  await expect(page).toPassAxeTests();
});
```

**Manual Checklist:**
- [ ] Keyboard navigation works
- [ ] Screen reader announcements correct
- [ ] Color contrast passes (4.5:1 minimum)
- [ ] Focus indicators visible
- [ ] ARIA attributes present and correct

---

## Common Tasks

### Task 1: Generate a Component

```bash
# Interactive mode
python scripts/uswds_agent.py

# Direct command
python scripts/uswds_agent.py "Create a USWDS form with name and email inputs"

# Check output
ls workspace/
cat workspace/form-component.html
```

### Task 2: Validate Existing Code

```python
from agent.tools import validate_html, validate_accessibility

html = open('workspace/my-component.html').read()

# Validate HTML
html_result = validate_html(html)
print(f"HTML Valid: {html_result['valid']}")

# Validate accessibility
a11y_result = validate_accessibility(html, level="AA")
print(f"Accessibility: {a11y_result['score']}/10")
```

### Task 3: Add a New MCP Server

1. Create server directory: `mkdir -p servers/my-server`
2. Implement using template from MCP_TOOLS_GUIDE.md
3. Add to `config/mcp-config.json`
4. Create agent tool wrapper in `agent/tools.py`
5. Test: `node servers/my-server/index.js`
6. Integrate: Update agent to use new tool

### Task 4: Fine-tune Model with New Data

```bash
# 1. Generate synthetic data
python scripts/generate_synthetic_data.py

# 2. Format for training
python scripts/format_training_data.py

# 3. Fine-tune
python scripts/finetune_model.py

# 4. Import to OLLAMA
cd models
ollama create uswds-coder-v2 -f Modelfile

# 5. Test
ollama run uswds-coder-v2 "Create a USWDS alert"
```

### Task 5: Debug Agent Issues

**Enable verbose logging:**
```bash
export LOG_LEVEL=debug
python scripts/uswds_agent.py
```

**Check MCP server logs:**
```bash
tail -f logs/mcp-servers.log
```

**Test MCP servers individually:**
```bash
node servers/validator/index.js
# Then send test request via stdio
```

---

## Troubleshooting

### Issue: MCP Server Not Responding

**Symptoms:** Agent hangs or times out on tool calls

**Solutions:**
1. Check server is running: `ps aux | grep mcp`
2. Test server directly: `node servers/my-server/index.js`
3. Check server logs: `cat logs/mcp-servers.log`
4. Verify config: `cat config/mcp-config.json`
5. Restart servers: `npm run restart:servers`

### Issue: Agent Generates Invalid USWDS Code

**Symptoms:** Missing usa- prefix, hard-coded styles, no ARIA

**Solutions:**
1. Check fine-tuning data quality
2. Verify system prompt emphasizes USWDS
3. Add validation tools to agent workflow
4. Increase temperature for creativity (0.7-0.9)
5. Re-fine-tune with better examples

### Issue: OLLAMA Model Not Found

**Symptoms:** "model 'uswds-coder' not found"

**Solutions:**
```bash
# List models
ollama list

# Create model
cd models
ollama create uswds-coder -f Modelfile

# Test
ollama run uswds-coder "test"
```

### Issue: Validation Failing

**Symptoms:** Generated code fails accessibility or USWDS validation

**Check:**
1. Is validation too strict? Review `config/validation-rules.json`
2. Are design tokens loaded? Check `data/uswds-repo/dist/json/`
3. Test validator independently: `npm run test:validator`
4. Review validation rules in MCP_TOOLS_GUIDE.md

### Issue: GPU Out of Memory (Fine-tuning)

**Solutions:**
```python
# Reduce batch size in scripts/finetune_model.py
per_device_train_batch_size=1  # Instead of 2

# Use gradient accumulation
gradient_accumulation_steps=8  # Instead of 4

# Use smaller model
MODEL_NAME = "unsloth/Llama-3.2-3B-Instruct-bnb-4bit"
```

---

## AI Assistant Guidelines

### When Working on This Repository

**DO:**
- ✅ Read SETUP.md first to understand system architecture
- ✅ Review MCP_TOOLS_GUIDE.md before implementing tools
- ✅ Follow USWDS best practices from official documentation
- ✅ Always validate generated USWDS code for accessibility
- ✅ Use design tokens instead of hard-coded values
- ✅ Provide complete, working code (no placeholders)
- ✅ Test MCP servers before integrating with agent
- ✅ Document new tools with clear schemas
- ✅ Commit with descriptive messages
- ✅ Push to correct branch (claude/*)

**DON'T:**
- ❌ Hard-code colors, spacing, or typography
- ❌ Skip accessibility attributes (ARIA, labels, roles)
- ❌ Use non-semantic HTML (divs instead of buttons/nav/etc)
- ❌ Generate incomplete code with "..." placeholders
- ❌ Modify USWDS core files (read-only reference)
- ❌ Skip validation steps
- ❌ Push to main/master directly
- ❌ Use deprecated USWDS patterns

### Response Format for Code Generation

When generating USWDS components:

```markdown
Here's an accessible USWDS [component] with [features]:

​```html
<button class="usa-button usa-button--outline"
        type="button"
        aria-label="Descriptive label">
  Button Text
</button>
​```

**Accessibility Features:**
- Semantic `<button>` element for proper keyboard navigation
- ARIA label for screen readers
- USWDS class for consistent styling
- Outline modifier for secondary action

**USWDS Design Tokens Used:**
- Button styling: `usa-button` class
- Modifier: `usa-button--outline`

**Testing:**
✅ WCAG 2.1 AA compliant
✅ Keyboard accessible (Tab, Enter/Space)
✅ Screen reader friendly
```

### Priority When Implementing Features

**Phase 1 (MVP):**
1. Filesystem MCP server
2. USWDS docs MCP server
3. Basic validator (HTML + USWDS classes)
4. Agent with ReAct workflow

**Phase 2 (Core Functionality):**
1. Accessibility testing (axe-core)
2. Git integration
3. Browser preview server
4. Design token validation

**Phase 3 (Advanced):**
1. Synthetic data generation
2. Model fine-tuning pipeline
3. Component library database
4. Visual regression testing

### Code Review Checklist

Before committing code:

**MCP Servers:**
- [ ] Tool schemas clearly documented
- [ ] Error handling implemented
- [ ] Input validation present
- [ ] Tests passing
- [ ] Logs useful for debugging

**Agent Code:**
- [ ] Tools properly decorated (@tool)
- [ ] Type hints present
- [ ] Docstrings complete
- [ ] Validates before writing files
- [ ] Handles errors gracefully

**USWDS Components:**
- [ ] Uses USWDS classes (usa-*)
- [ ] Design tokens only (no hard-coded values)
- [ ] Semantic HTML elements
- [ ] ARIA attributes present
- [ ] Complete code (no placeholders)
- [ ] Accessibility validated

---

## Quick Reference

### Essential Commands

```bash
# Setup
npm install
pip install -r requirements.txt

# Start MCP servers
npm run start:servers

# Run agent
python scripts/uswds_agent.py

# Test
npm test
python -m pytest tests/

# Validate component
python -c "from agent.tools import validate_html; print(validate_html(open('workspace/component.html').read()))"

# Git workflow
git add .
git commit -m "feat: Your message"
git push -u origin claude/branch-name-{session-id}
```

### Key Files to Reference

- **SETUP.md** - Installation and configuration
- **USWDS_AGENT_IMPLEMENTATION.md** - Implementation details
- **MCP_TOOLS_GUIDE.md** - Tool specifications
- **config/mcp-config.json** - MCP server config
- **config/validation-rules.json** - Validation rules

### Important Links

- USWDS Docs: https://designsystem.digital.gov
- USWDS GitHub: https://github.com/uswds/uswds
- MCP Protocol: https://modelcontextprotocol.io
- LangGraph: https://python.langchain.com/docs/langgraph
- OLLAMA: https://ollama.com

---

## Version History

- **2025-11-18** - Initial CLAUDE.md creation
- Documentation phase - repository structure and guidelines established

---

**For more detailed information:**
- Setup: See [SETUP.md](SETUP.md)
- Implementation: See [USWDS_AGENT_IMPLEMENTATION.md](USWDS_AGENT_IMPLEMENTATION.md)
- MCP Tools: See [MCP_TOOLS_GUIDE.md](MCP_TOOLS_GUIDE.md)

**Questions or Issues?** Refer to the Troubleshooting section above or review the detailed documentation files.
