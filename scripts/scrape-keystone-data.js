#!/usr/bin/env node

/**
 * Keystone Design System Data Scraper
 *
 * This script uses Puppeteer to extract component data, design tokens,
 * and documentation from Pennsylvania's Keystone Design System websites.
 *
 * Usage:
 *   npm run scrape:keystone                    # Interactive menu
 *   npm run scrape:keystone -- docs <path>     # Scrape specific documentation
 *   npm run scrape:keystone -- component <name> # Scrape specific component
 *   npm run scrape:keystone -- all             # Scrape everything
 *
 * Requirements:
 *   - Node.js 18+
 *   - Puppeteer installed (npm install puppeteer)
 */

import puppeteer from 'puppeteer';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const CONFIG = {
  storybookUrl: 'https://components.pa.gov',
  docsUrl: 'https://wcmauthorguide.pa.gov/en/keystone-design-system',
  outputDir: path.join(__dirname, '..', 'data', 'keystone-scraped'),
  headless: true,
  timeout: 30000,
};

// Available documentation paths
const DOC_PATHS = [
  'getting-started',
  'foundations/color',
  'foundations/typography',
  'foundations/spacing',
  'foundations/grid',
  'components/button',
  'components/navbar',
  'components/accordion',
  'components/alert',
  'components/card',
  'patterns/forms',
  'patterns/navigation',
  'utilities/helpers',
];

// Keystone components from Storybook
const COMPONENTS = [
  'Button', 'Text input', 'Textarea', 'Select', 'Checkbox',
  'Radio', 'Search input', 'Navbar', 'Menu list', 'Breadcrumb',
  'Link', 'Alert', 'Tag', 'Card', 'Accordion', 'List group',
  'Footer', 'Typography', 'Table', 'Icon object'
];

/**
 * Initialize output directory
 */
async function initOutputDir() {
  await fs.mkdir(CONFIG.outputDir, { recursive: true });
  console.log(`✓ Output directory ready: ${CONFIG.outputDir}`);
}

/**
 * Launch Puppeteer browser
 */
async function launchBrowser() {
  console.log('🚀 Launching browser...');
  const browser = await puppeteer.launch({
    headless: CONFIG.headless,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });
  return browser;
}

/**
 * Scrape documentation page
 */
async function scrapeDocumentationPage(browser, docPath) {
  const url = `${CONFIG.docsUrl}/${docPath}.html`;
  console.log(`\n📄 Scraping documentation: ${docPath}`);
  console.log(`   URL: ${url}`);

  const page = await browser.newPage();

  try {
    await page.goto(url, { waitUntil: 'networkidle2', timeout: CONFIG.timeout });

    // Extract page content
    const data = await page.evaluate(() => {
      const result = {
        title: '',
        content: '',
        sections: [],
        links: [],
        codeExamples: [],
      };

      // Get page title
      const titleEl = document.querySelector('h1, .page-title, article h1');
      result.title = titleEl?.textContent?.trim() || '';

      // Get main content
      const mainContent = document.querySelector('main, article, .content, .documentation');
      if (mainContent) {
        result.content = mainContent.textContent?.trim() || '';

        // Extract sections
        const headings = mainContent.querySelectorAll('h2, h3');
        headings.forEach(heading => {
          const level = heading.tagName.toLowerCase();
          const text = heading.textContent?.trim() || '';
          const id = heading.id || '';

          result.sections.push({
            level,
            text,
            id,
          });
        });

        // Extract code examples
        const codeBlocks = mainContent.querySelectorAll('pre code, .code-example, .highlight');
        codeBlocks.forEach((block, index) => {
          const code = block.textContent?.trim() || '';
          const language = block.className?.match(/language-(\w+)/)?.[1] || 'html';

          result.codeExamples.push({
            index,
            language,
            code,
          });
        });

        // Extract links
        const links = mainContent.querySelectorAll('a[href]');
        links.forEach(link => {
          const href = link.getAttribute('href');
          const text = link.textContent?.trim() || '';

          if (href && text) {
            result.links.push({ href, text });
          }
        });
      }

      return result;
    });

    // Save to file
    const outputPath = path.join(
      CONFIG.outputDir,
      'docs',
      `${docPath.replace(/\//g, '-')}.json`
    );
    await fs.mkdir(path.dirname(outputPath), { recursive: true });
    await fs.writeFile(outputPath, JSON.stringify(data, null, 2));

    console.log(`   ✓ Saved to: ${outputPath}`);
    console.log(`   ✓ Title: ${data.title}`);
    console.log(`   ✓ Sections: ${data.sections.length}`);
    console.log(`   ✓ Code examples: ${data.codeExamples.length}`);

    return data;
  } catch (error) {
    console.error(`   ✗ Error scraping ${docPath}:`, error.message);
    return null;
  } finally {
    await page.close();
  }
}

/**
 * Scrape Storybook component
 */
async function scrapeStorybookComponent(browser, componentName) {
  // Convert component name to URL format (e.g., "Text input" -> "textinput")
  const urlName = componentName.toLowerCase().replace(/\s+/g, '');
  const url = `${CONFIG.storybookUrl}/?path=/docs/components-${urlName}--docs`;

  console.log(`\n🧩 Scraping component: ${componentName}`);
  console.log(`   URL: ${url}`);

  const page = await browser.newPage();

  try {
    await page.goto(url, { waitUntil: 'networkidle2', timeout: CONFIG.timeout });

    // Wait for Storybook to load
    await page.waitForSelector('#storybook-docs, .docs-story, [id*="story"]', { timeout: 10000 });

    // Extract component data
    const data = await page.evaluate((name) => {
      const result = {
        name,
        description: '',
        props: [],
        examples: [],
        accessibility: {},
      };

      // Get description
      const descEl = document.querySelector('.sbdocs-preview, .docs-description, p');
      result.description = descEl?.textContent?.trim() || '';

      // Extract props table
      const propsTable = document.querySelector('table, .props-table, .docblock-argstable');
      if (propsTable) {
        const rows = propsTable.querySelectorAll('tbody tr');
        rows.forEach(row => {
          const cells = row.querySelectorAll('td, th');
          if (cells.length >= 2) {
            const propName = cells[0]?.textContent?.trim() || '';
            const propType = cells[1]?.textContent?.trim() || '';
            const propDesc = cells[2]?.textContent?.trim() || '';

            if (propName) {
              result.props.push({
                name: propName,
                type: propType,
                description: propDesc,
              });
            }
          }
        });
      }

      // Extract code examples
      const codeBlocks = document.querySelectorAll('pre code, .prismjs');
      codeBlocks.forEach((block, index) => {
        const code = block.textContent?.trim() || '';

        if (code && code.includes('<')) {
          // Find preceding heading for context
          let heading = null;
          let el = block.closest('div');
          while (el && !heading) {
            const h = el.querySelector('h1, h2, h3, h4');
            if (h) heading = h.textContent?.trim();
            el = el.previousElementSibling;
          }

          result.examples.push({
            title: heading || `Example ${index + 1}`,
            code,
          });
        }
      });

      // Extract accessibility info
      const a11ySection = document.querySelector('[id*="accessibility"], .accessibility');
      if (a11ySection) {
        result.accessibility.notes = a11ySection.textContent?.trim() || '';
      }

      return result;
    }, componentName);

    // Save to file
    const outputPath = path.join(
      CONFIG.outputDir,
      'components',
      `${componentName.toLowerCase().replace(/\s+/g, '-')}.json`
    );
    await fs.mkdir(path.dirname(outputPath), { recursive: true });
    await fs.writeFile(outputPath, JSON.stringify(data, null, 2));

    console.log(`   ✓ Saved to: ${outputPath}`);
    console.log(`   ✓ Description: ${data.description.substring(0, 60)}...`);
    console.log(`   ✓ Props: ${data.props.length}`);
    console.log(`   ✓ Examples: ${data.examples.length}`);

    return data;
  } catch (error) {
    console.error(`   ✗ Error scraping ${componentName}:`, error.message);
    return null;
  } finally {
    await page.close();
  }
}

/**
 * Scrape navigation/sitemap from main docs page
 */
async function scrapeNavigation(browser) {
  const url = `${CONFIG.docsUrl}.html`;
  console.log(`\n🗺️  Scraping navigation structure`);
  console.log(`   URL: ${url}`);

  const page = await browser.newPage();

  try {
    await page.goto(url, { waitUntil: 'networkidle2', timeout: CONFIG.timeout });

    const navigation = await page.evaluate(() => {
      const result = {
        sections: [],
        allLinks: [],
      };

      // Find main navigation or sidebar
      const nav = document.querySelector('nav, .sidebar, .navigation, aside');
      if (nav) {
        const links = nav.querySelectorAll('a[href]');
        links.forEach(link => {
          const href = link.getAttribute('href');
          const text = link.textContent?.trim() || '';

          if (href && text) {
            result.allLinks.push({
              text,
              href,
              section: link.closest('section, .section, [role="region"]')?.getAttribute('aria-label') || '',
            });
          }
        });
      }

      // Find sections on main page
      const sections = document.querySelectorAll('section, .section, .category');
      sections.forEach(section => {
        const heading = section.querySelector('h2, h3, .section-title');
        const title = heading?.textContent?.trim() || '';

        const items = Array.from(section.querySelectorAll('a, li')).map(item => ({
          text: item.textContent?.trim() || '',
          href: item.getAttribute('href') || item.querySelector('a')?.getAttribute('href') || '',
        }));

        if (title || items.length > 0) {
          result.sections.push({ title, items });
        }
      });

      return result;
    });

    // Save to file
    const outputPath = path.join(CONFIG.outputDir, 'navigation.json');
    await fs.writeFile(outputPath, JSON.stringify(navigation, null, 2));

    console.log(`   ✓ Saved to: ${outputPath}`);
    console.log(`   ✓ Total links: ${navigation.allLinks.length}`);
    console.log(`   ✓ Sections: ${navigation.sections.length}`);

    return navigation;
  } catch (error) {
    console.error(`   ✗ Error scraping navigation:`, error.message);
    return null;
  } finally {
    await page.close();
  }
}

/**
 * Main scraper function
 */
async function main() {
  const args = process.argv.slice(2);
  const command = args[0] || 'menu';
  const param = args[1];

  console.log('\n🎨 Keystone Design System Data Scraper\n');

  // Initialize
  await initOutputDir();
  const browser = await launchBrowser();

  try {
    if (command === 'docs' && param) {
      // Scrape specific documentation page
      await scrapeDocumentationPage(browser, param);
    } else if (command === 'component' && param) {
      // Scrape specific component
      await scrapeStorybookComponent(browser, param);
    } else if (command === 'navigation') {
      // Scrape navigation structure
      await scrapeNavigation(browser);
    } else if (command === 'all') {
      // Scrape everything
      console.log('\n📦 Scraping all data...\n');

      // 1. Navigation
      await scrapeNavigation(browser);

      // 2. Documentation pages
      console.log('\n📚 Scraping documentation pages...');
      for (const docPath of DOC_PATHS) {
        await scrapeDocumentationPage(browser, docPath);
        await new Promise(resolve => setTimeout(resolve, 1000)); // Rate limiting
      }

      // 3. Components
      console.log('\n🧩 Scraping components...');
      for (const component of COMPONENTS) {
        await scrapeStorybookComponent(browser, component);
        await new Promise(resolve => setTimeout(resolve, 1000)); // Rate limiting
      }

      console.log('\n✅ All data scraped successfully!');
    } else {
      // Interactive menu
      console.log('Usage:');
      console.log('  npm run scrape:keystone -- docs <path>');
      console.log('  npm run scrape:keystone -- component <name>');
      console.log('  npm run scrape:keystone -- navigation');
      console.log('  npm run scrape:keystone -- all');
      console.log('\nExamples:');
      console.log('  npm run scrape:keystone -- docs getting-started');
      console.log('  npm run scrape:keystone -- docs foundations/color');
      console.log('  npm run scrape:keystone -- component Button');
      console.log('  npm run scrape:keystone -- component "Text input"');
      console.log('  npm run scrape:keystone -- all');
      console.log('\nAvailable doc paths:');
      DOC_PATHS.forEach(p => console.log(`  - ${p}`));
      console.log('\nAvailable components:');
      COMPONENTS.forEach(c => console.log(`  - ${c}`));
    }
  } catch (error) {
    console.error('\n❌ Error:', error.message);
    process.exit(1);
  } finally {
    await browser.close();
    console.log('\n✓ Browser closed');
  }

  console.log(`\n📁 Output saved to: ${CONFIG.outputDir}\n`);
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(console.error);
}

export {
  scrapeDocumentationPage,
  scrapeStorybookComponent,
  scrapeNavigation,
  CONFIG,
  DOC_PATHS,
  COMPONENTS,
};
