# Keystone Data Scraper - Usage Guide

This guide explains how to use the Puppeteer-based scraper to extract component data, design tokens, and documentation from Pennsylvania's Keystone Design System.

## Why Use the Scraper?

The official Keystone websites (components.pa.gov and wcmauthorguide.pa.gov) block programmatic access with 403 errors. The Puppeteer scraper bypasses these restrictions by using a real browser to access and extract data.

## Prerequisites

### 1. Node.js 18+

```bash
node --version  # Should be 18.0.0 or higher
```

### 2. Install Puppeteer

Add Puppeteer to the project dependencies:

```bash
npm install puppeteer --save-dev
```

Or install globally:

```bash
npm install -g puppeteer
```

### 3. Update package.json

Add scraper scripts to `package.json`:

```json
{
  "scripts": {
    "scrape:keystone": "node scripts/scrape-keystone-data.js",
    "scrape:docs": "node scripts/scrape-keystone-data.js docs",
    "scrape:component": "node scripts/scrape-keystone-data.js component",
    "scrape:all": "node scripts/scrape-keystone-data.js all"
  }
}
```

## Usage

### Basic Commands

```bash
# Show usage help
npm run scrape:keystone

# Scrape specific documentation page
npm run scrape:keystone -- docs <path>

# Scrape specific component
npm run scrape:keystone -- component <name>

# Scrape navigation structure
npm run scrape:keystone -- navigation

# Scrape everything (all docs + all components)
npm run scrape:keystone -- all
```

## Examples

### 1. Scrape Getting Started Documentation

```bash
npm run scrape:keystone -- docs getting-started
```

**Output:**
```
🎨 Keystone Design System Data Scraper

✓ Output directory ready: /path/to/data/keystone-scraped
🚀 Launching browser...

📄 Scraping documentation: getting-started
   URL: https://wcmauthorguide.pa.gov/en/keystone-design-system/getting-started.html
   ✓ Saved to: data/keystone-scraped/docs/getting-started.json
   ✓ Title: Getting Started with Keystone
   ✓ Sections: 5
   ✓ Code examples: 3

✓ Browser closed
📁 Output saved to: data/keystone-scraped
```

### 2. Scrape Color Documentation

```bash
npm run scrape:keystone -- docs foundations/color
```

This extracts:
- Color token names and values
- Color categories (primary, secondary, tertiary, error)
- Light/dark mode variants
- WCAG compliance information

### 3. Scrape Button Component

```bash
npm run scrape:keystone -- component Button
```

This extracts:
- Component description
- Available props (variant, size, disabled, etc.)
- Code examples (primary, secondary, disabled states)
- Accessibility guidelines

### 4. Scrape Component with Spaces in Name

```bash
npm run scrape:keystone -- component "Text input"
```

**Note:** Use quotes for component names with spaces.

### 5. Scrape All Available Data

```bash
npm run scrape:keystone -- all
```

This scrapes:
- Navigation structure (1 file)
- All documentation pages (13 files)
- All components (19 files)

**Total time:** ~3-5 minutes
**Total files:** ~33 JSON files

## Available Documentation Paths

```
getting-started
foundations/color
foundations/typography
foundations/spacing
foundations/grid
components/button
components/navbar
components/accordion
components/alert
components/card
patterns/forms
patterns/navigation
utilities/helpers
```

## Available Components

```
Button
Text input
Textarea
Select
Checkbox
Radio
Search input
Navbar
Menu list
Breadcrumb
Link
Alert
Tag
Card
Accordion
List group
Footer
Typography
Table
Icon object
```

## Output Structure

All scraped data is saved to `data/keystone-scraped/`:

```
data/
└── keystone-scraped/
    ├── navigation.json              # Site navigation structure
    ├── docs/
    │   ├── getting-started.json
    │   ├── foundations-color.json
    │   ├── foundations-typography.json
    │   └── ...
    └── components/
        ├── button.json
        ├── text-input.json
        ├── navbar.json
        └── ...
```

### Documentation JSON Format

```json
{
  "title": "Getting Started with Keystone",
  "content": "Full page text content...",
  "sections": [
    {
      "level": "h2",
      "text": "Installation",
      "id": "installation"
    }
  ],
  "codeExamples": [
    {
      "index": 0,
      "language": "html",
      "code": "<button class=\"btn\">Click me</button>"
    }
  ],
  "links": [
    {
      "href": "/en/keystone-design-system/foundations/color.html",
      "text": "Color Tokens"
    }
  ]
}
```

### Component JSON Format

```json
{
  "name": "Button",
  "description": "Interactive button component with multiple variants",
  "props": [
    {
      "name": "variant",
      "type": "'primary' | 'secondary' | 'tertiary'",
      "description": "Button style variant"
    }
  ],
  "examples": [
    {
      "title": "Primary Button",
      "code": "<button class=\"btn btn-primary\">Click me</button>"
    }
  ],
  "accessibility": {
    "notes": "Buttons must be keyboard accessible..."
  }
}
```

## Using Scraped Data

### 1. Update Component Definitions

Copy extracted component data to `src/keystone/components.ts`:

```bash
# View scraped button data
cat data/keystone-scraped/components/button.json

# Manually add to components.ts or use a script
```

### 2. Extract Color Tokens

Copy color data to `src/keystone/color-tokens.ts`:

```bash
# View color documentation
cat data/keystone-scraped/docs/foundations-color.json
```

### 3. Enhance Validation Rules

Use scraped patterns to improve validation in `keystone-service.ts`.

## Automation Scripts

### Create a Data Importer

Create `scripts/import-scraped-data.js` to automatically update TypeScript files:

```javascript
import fs from 'fs/promises';
import path from 'path';

async function importComponents() {
  const componentFiles = await fs.readdir('data/keystone-scraped/components');

  for (const file of componentFiles) {
    const data = JSON.parse(
      await fs.readFile(`data/keystone-scraped/components/${file}`, 'utf-8')
    );

    // Transform to TypeScript format
    const component = {
      name: data.name,
      category: guessCategory(data.name),
      description: data.description,
      props: data.props,
      examples: data.examples,
      // ... etc
    };

    console.log(component);
  }
}

function guessCategory(name) {
  const categories = {
    forms: ['Button', 'Text input', 'Checkbox', 'Radio', 'Select'],
    navigation: ['Navbar', 'Breadcrumb', 'Link', 'Menu list'],
    feedback: ['Alert', 'Tag'],
    content: ['Card', 'Accordion', 'Typography', 'List group'],
  };

  for (const [category, components] of Object.entries(categories)) {
    if (components.includes(name)) return category;
  }

  return 'other';
}

importComponents();
```

## Troubleshooting

### Error: Puppeteer not found

```bash
# Install Puppeteer
npm install puppeteer

# Or install dependencies
npm install
```

### Error: Browser failed to launch

```bash
# Install system dependencies (Linux)
sudo apt-get install -y \
  chromium-browser \
  libx11-xcb1 \
  libxcomposite1 \
  libxcursor1 \
  libxdamage1 \
  libxi6 \
  libxtst6 \
  libnss3 \
  libcups2 \
  libxss1 \
  libxrandr2 \
  libasound2 \
  libpangocairo-1.0-0 \
  libatk1.0-0 \
  libatk-bridge2.0-0 \
  libgtk-3-0
```

### Error: Timeout waiting for page

Increase timeout in `scripts/scrape-keystone-data.js`:

```javascript
const CONFIG = {
  timeout: 60000, // Increase to 60 seconds
};
```

### Error: Element not found

The site structure may have changed. Update selectors in the scraper script.

### 403 Errors Still Occurring

Puppeteer should bypass 403 errors by using a real browser. If issues persist:

1. **Try headless: false** to see what's happening:
   ```javascript
   const CONFIG = {
     headless: false, // Show browser window
   };
   ```

2. **Add user agent:**
   ```javascript
   await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36');
   ```

3. **Add delays:**
   ```javascript
   await new Promise(resolve => setTimeout(resolve, 2000)); // Wait 2 seconds
   ```

## Rate Limiting

To be respectful of Pennsylvania's servers:

1. **Use delays between requests** (already implemented with 1-second delays)
2. **Run during off-peak hours** when possible
3. **Cache results** - don't re-scrape unnecessarily
4. **Only scrape what you need** - use targeted commands instead of `all`

## Best Practices

1. **Version control scraped data:**
   ```bash
   git add data/keystone-scraped/
   git commit -m "data: Update scraped Keystone components"
   ```

2. **Document scrape date:**
   Add metadata to scraped files:
   ```javascript
   const data = {
     scrapedAt: new Date().toISOString(),
     version: 'KDS v2.0.1',
     // ... rest of data
   };
   ```

3. **Validate scraped data:**
   ```bash
   # Check for empty files
   find data/keystone-scraped -type f -size 0

   # Validate JSON syntax
   for file in data/keystone-scraped/**/*.json; do
     node -e "require('$file')" || echo "Invalid: $file"
   done
   ```

4. **Regular updates:**
   Set a reminder to re-scrape quarterly to catch updates:
   ```bash
   # Add to crontab (run first day of each quarter)
   0 0 1 1,4,7,10 * cd /path/to/repo && npm run scrape:all
   ```

## Integration with MCP Server

Once data is scraped, integrate it with the MCP server:

### 1. Update Component Definitions

```bash
# After scraping Button component
npm run scrape:keystone -- component Button

# Then manually add to src/keystone/components.ts
# Or use an import script
```

### 2. Test with MCP Inspector

```bash
# Rebuild server
npm run build

# Test with inspector
npm run inspector:keystone

# Use the tool to verify data
get_keystone_component { component_name: "Button" }
```

### 3. Verify in Claude Desktop

Configure Claude Desktop to use the server, then test:

```
Using the Keystone MCP server, get details about the Button component.
```

## Example Workflow

### Complete workflow for adding a new component:

```bash
# 1. Scrape the component
npm run scrape:keystone -- component "Text input"

# 2. View the scraped data
cat data/keystone-scraped/components/text-input.json

# 3. Add to components.ts (manually or via script)
# Edit src/keystone/components.ts

# 4. Rebuild
npm run build

# 5. Test
npm run inspector:keystone

# 6. Commit
git add data/keystone-scraped/components/text-input.json
git add src/keystone/components.ts
git commit -m "feat: Add Text Input component with scraped data"
```

## Future Enhancements

Ideas for improving the scraper:

1. **Screenshot capture** - Save visual examples
2. **Diff detection** - Alert when components change
3. **Automatic TypeScript generation** - Generate components.ts from scraped data
4. **Validation** - Check WCAG compliance programmatically
5. **Interactive mode** - CLI menu for selecting what to scrape
6. **Scheduling** - Automatic periodic updates
7. **Notifications** - Alert when new components are added

## Support

If you encounter issues:

1. Check the error message and troubleshooting section above
2. Verify Puppeteer is installed: `npm list puppeteer`
3. Try running with `headless: false` to see browser behavior
4. Review the scraper source: `scripts/scrape-keystone-data.js`

## Resources

- **Puppeteer Docs**: https://pptr.dev/
- **Keystone Storybook**: https://components.pa.gov
- **Keystone Docs**: https://wcmauthorguide.pa.gov/en/keystone-design-system/
- **Implementation Guide**: See KEYSTONE_IMPLEMENTATION_GUIDE.md

---

**Happy Scraping!** 🎨

Use this tool responsibly to keep the Keystone MCP server up-to-date with the latest Pennsylvania Design System components and patterns.
