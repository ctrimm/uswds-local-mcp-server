import axios from 'axios';
import * as cheerio from 'cheerio';
import { REACT_COMPONENTS, COMPONENT_CATEGORIES } from '../data/react-components.js';
import { PAGE_TEMPLATES, TEMPLATE_CATEGORIES } from '../data/page-templates.js';

interface ComponentInfo {
  name: string;
  description: string;
  category: string;
  props?: any[];
  examples?: any[];
  accessibility?: any;
  url: string;
}

interface DocumentationCache {
  [url: string]: {
    data: any;
    timestamp: number;
  };
}

export class ComponentService {
  private useReact: boolean;
  private baseUrl: string;
  private reactBaseUrl = 'https://trussworks.github.io/react-uswds';
  private uswdsBaseUrl = 'https://designsystem.digital.gov';
  private cache: DocumentationCache = {};
  private cacheTimeout = 3600000; // 1 hour in milliseconds

  constructor(useReact: boolean = false) {
    this.useReact = useReact;
    this.baseUrl = useReact ? this.reactBaseUrl : this.uswdsBaseUrl;
  }

  async listComponents(category: string = 'all'): Promise<any> {
    if (this.useReact) {
      return this.listReactComponents(category);
    } else {
      return this.listUSWDSComponents(category);
    }
  }

  private async listReactComponents(category: string): Promise<any> {
    const allComponents = Object.values(REACT_COMPONENTS);

    if (category === 'all') {
      const groupedByCategory: any = {};
      Object.entries(COMPONENT_CATEGORIES).forEach(([key, label]) => {
        groupedByCategory[key] = allComponents
          .filter(c => c.category === key)
          .map(c => ({
            name: c.name,
            description: c.description,
            url: c.url
          }));
      });

      return {
        mode: 'react-uswds',
        total: allComponents.length,
        categories: COMPONENT_CATEGORIES,
        components: groupedByCategory
      };
    }

    const filtered = allComponents.filter(c => c.category === category);
    return {
      mode: 'react-uswds',
      category,
      categoryLabel: COMPONENT_CATEGORIES[category as keyof typeof COMPONENT_CATEGORIES],
      total: filtered.length,
      components: filtered.map(c => ({
        name: c.name,
        description: c.description,
        url: c.url
      }))
    };
  }

  private async listUSWDSComponents(category: string): Promise<any> {
    // Try to fetch live component list from USWDS docs
    try {
      const componentsUrl = `${this.uswdsBaseUrl}/components/`;
      const html = await this.fetchWithCache(componentsUrl);
      const $ = cheerio.load(html);

      const components: ComponentInfo[] = [];

      // Parse component list from USWDS documentation sidebar
      $('.usa-sidenav a, .sidenav a, nav a').each((i, elem) => {
        const $elem = $(elem);
        const href = $elem.attr('href');
        const text = $elem.text().trim();

        if (href && href.startsWith('/components/') && text && !href.includes('#')) {
          const name = text;
          const slug = href.replace('/components/', '').replace('/', '');

          // Categorize based on common patterns
          let cat = 'ui';
          if (['button', 'input', 'text-input', 'checkbox', 'radio', 'select', 'textarea', 'date-picker', 'time-picker', 'combo-box', 'file-input'].some(f => slug.includes(f))) {
            cat = 'forms';
          } else if (['header', 'footer', 'navigation', 'breadcrumb', 'step-indicator', 'side-navigation'].some(n => slug.includes(n))) {
            cat = 'navigation';
          }

          components.push({
            name,
            description: '',
            category: cat,
            url: `${this.uswdsBaseUrl}${href}`,
          });
        }
      });

      // If scraping returns few results, use fallback
      if (components.length < 10) {
        return this.getFallbackUSWDSComponents(category);
      }

      if (category === 'all') {
        return {
          mode: 'vanilla-uswds',
          total: components.length,
          source: 'live',
          components: components.map(c => ({
            name: c.name,
            category: c.category,
            url: c.url
          }))
        };
      }

      const filtered = components.filter(c => c.category === category);
      return {
        mode: 'vanilla-uswds',
        category,
        total: filtered.length,
        source: 'live',
        components: filtered.map(c => ({
          name: c.name,
          url: c.url
        }))
      };
    } catch (error) {
      console.error('Error fetching USWDS components:', error);
      return this.getFallbackUSWDSComponents(category);
    }
  }

  private getFallbackUSWDSComponents(category: string): any {
    // Fallback static list of USWDS components
    const components: ComponentInfo[] = [
      // Forms
      { name: 'Button', category: 'forms', description: 'Clickable button element', url: `${this.uswdsBaseUrl}/components/button/` },
      { name: 'Text input', category: 'forms', description: 'Single-line text input', url: `${this.uswdsBaseUrl}/components/text-input/` },
      { name: 'Checkbox', category: 'forms', description: 'Checkbox selection', url: `${this.uswdsBaseUrl}/components/checkbox/` },
      { name: 'Radio buttons', category: 'forms', description: 'Radio button selection', url: `${this.uswdsBaseUrl}/components/radio-buttons/` },
      { name: 'Select', category: 'forms', description: 'Dropdown menu', url: `${this.uswdsBaseUrl}/components/select/` },
      { name: 'Textarea', category: 'forms', description: 'Multi-line text input', url: `${this.uswdsBaseUrl}/components/textarea/` },
      { name: 'Date picker', category: 'forms', description: 'Date selection input', url: `${this.uswdsBaseUrl}/components/date-picker/` },
      { name: 'Date range picker', category: 'forms', description: 'Date range selection', url: `${this.uswdsBaseUrl}/components/date-range-picker/` },
      { name: 'Time picker', category: 'forms', description: 'Time selection input', url: `${this.uswdsBaseUrl}/components/time-picker/` },
      { name: 'Combo box', category: 'forms', description: 'Autocomplete dropdown', url: `${this.uswdsBaseUrl}/components/combo-box/` },
      { name: 'File input', category: 'forms', description: 'File upload', url: `${this.uswdsBaseUrl}/components/file-input/` },

      // Navigation
      { name: 'Header', category: 'navigation', description: 'Site header', url: `${this.uswdsBaseUrl}/components/header/` },
      { name: 'Footer', category: 'navigation', description: 'Site footer', url: `${this.uswdsBaseUrl}/components/footer/` },
      { name: 'Navigation', category: 'navigation', description: 'Primary navigation', url: `${this.uswdsBaseUrl}/components/navigation/` },
      { name: 'Side navigation', category: 'navigation', description: 'Sidebar navigation', url: `${this.uswdsBaseUrl}/components/side-navigation/` },
      { name: 'Breadcrumb', category: 'navigation', description: 'Navigation breadcrumb', url: `${this.uswdsBaseUrl}/components/breadcrumb/` },
      { name: 'Step indicator', category: 'navigation', description: 'Process steps', url: `${this.uswdsBaseUrl}/components/step-indicator/` },

      // UI
      { name: 'Alert', category: 'ui', description: 'Alert notification', url: `${this.uswdsBaseUrl}/components/alert/` },
      { name: 'Modal', category: 'ui', description: 'Modal dialog', url: `${this.uswdsBaseUrl}/components/modal/` },
      { name: 'Accordion', category: 'ui', description: 'Expandable sections', url: `${this.uswdsBaseUrl}/components/accordion/` },
      { name: 'Banner', category: 'ui', description: 'Government banner', url: `${this.uswdsBaseUrl}/components/banner/` },
      { name: 'Card', category: 'ui', description: 'Content card', url: `${this.uswdsBaseUrl}/components/card/` },
      { name: 'Tag', category: 'ui', description: 'Tag label', url: `${this.uswdsBaseUrl}/components/tag/` },
      { name: 'Table', category: 'ui', description: 'Data table', url: `${this.uswdsBaseUrl}/components/table/` },
    ];

    if (category === 'all') {
      return {
        mode: 'vanilla-uswds',
        total: components.length,
        source: 'fallback',
        categories: ['forms', 'navigation', 'ui'],
        components: components.map(c => ({
          name: c.name,
          category: c.category,
          description: c.description,
          url: c.url
        }))
      };
    }

    const filtered = components.filter(c => c.category === category);
    return {
      mode: 'vanilla-uswds',
      category,
      total: filtered.length,
      source: 'fallback',
      components: filtered.map(c => ({
        name: c.name,
        description: c.description,
        url: c.url
      }))
    };
  }

  async getComponentInfo(componentName: string, includeExamples: boolean = true): Promise<any> {
    if (this.useReact) {
      return this.getReactComponentInfo(componentName, includeExamples);
    } else {
      return this.getUSWDSComponentInfo(componentName, includeExamples);
    }
  }

  private async getReactComponentInfo(componentName: string, includeExamples: boolean): Promise<any> {
    // Use comprehensive component database
    const component = REACT_COMPONENTS[componentName];

    if (!component) {
      return {
        error: `Component "${componentName}" not found`,
        mode: 'react-uswds',
        suggestion: `Available components: ${Object.keys(REACT_COMPONENTS).slice(0, 10).join(', ')}...`,
        message: 'Check component name spelling and capitalization',
        searchUrl: `${this.reactBaseUrl}/?path=/docs/`
      };
    }

    return {
      mode: 'react-uswds',
      name: component.name,
      description: component.description,
      category: component.category,
      importPath: component.importPath,
      props: component.props,
      examples: includeExamples ? component.examples : [],
      accessibility: component.accessibility,
      relatedComponents: component.relatedComponents || [],
      url: component.url,
      documentation: {
        officialDocs: component.url,
        repository: 'https://github.com/trussworks/react-uswds',
        storybook: this.reactBaseUrl
      }
    };
  }

  private async getUSWDSComponentInfo(componentName: string, includeExamples: boolean): Promise<any> {
    // Fetch live documentation from USWDS
    try {
      const slug = componentName.toLowerCase().replace(/\s+/g, '-');
      const url = `${this.uswdsBaseUrl}/components/${slug}/`;
      const html = await this.fetchWithCache(url);
      const $ = cheerio.load(html);

      // Extract component information from the page
      const heading = $('h1.usa-prose-h1, h1').first().text().trim();
      const description = $('.usa-intro').first().text().trim() ||
                         $('p').first().text().trim();

      // Extract code examples
      const examples: any[] = [];
      if (includeExamples) {
        $('.site-component-section, .usa-accordion__content').each((i, section) => {
          const $section = $(section);
          const codeBlock = $section.find('pre code, .highlight code').first();
          if (codeBlock.length) {
            const code = codeBlock.text().trim();
            const title = $section.find('h2, h3, h4').first().text().trim() || `Example ${i + 1}`;

            if (code) {
              examples.push({
                title,
                code,
                description: $section.find('p').first().text().trim()
              });
            }
          }
        });
      }

      // Extract guidance/when to use
      const guidance: string[] = [];
      $('.usa-content ul li, .site-guidance li').each((i, li) => {
        const text = $(li).text().trim();
        if (text && text.length < 200) {
          guidance.push(text);
        }
      });

      return {
        mode: 'vanilla-uswds',
        name: heading || componentName,
        description: description || `USWDS ${componentName} component`,
        url,
        source: 'live',
        examples: examples.slice(0, 3), // Limit to first 3 examples
        guidance: guidance.length > 0 ? guidance : undefined,
        accessibility: {
          message: 'See component documentation for specific accessibility requirements',
          wcagCompliant: true,
          documentation: `${url}#accessibility`
        },
        documentation: {
          fullDocs: url,
          codeExamples: examples.length > 0,
          repository: 'https://github.com/uswds/uswds'
        }
      };
    } catch (error) {
      // Fallback if fetching fails
      return {
        mode: 'vanilla-uswds',
        name: componentName,
        message: 'Unable to fetch live documentation. Please visit the URL for details.',
        error: error instanceof Error ? error.message : 'Unknown error',
        url: `${this.uswdsBaseUrl}/components/${componentName.toLowerCase().replace(/\s+/g, '-')}/`,
        source: 'fallback',
        guidance: {
          classes: `Use "usa-${componentName.toLowerCase().replace(/\s+/g, '-')}" as the base class`,
          accessibility: 'Refer to USWDS documentation for specific accessibility requirements',
          examples: 'Visit the URL above for complete HTML examples'
        },
        documentation: {
          repository: 'https://github.com/uswds/uswds',
          designSystem: this.uswdsBaseUrl
        }
      };
    }
  }

  async searchDocs(query: string, docType: string = 'all'): Promise<any> {
    if (this.useReact) {
      return this.searchReactDocs(query, docType);
    } else {
      return this.searchUSWDSDocs(query, docType);
    }
  }

  private async searchReactDocs(query: string, docType: string): Promise<any> {
    // Search through React components database
    const lowerQuery = query.toLowerCase();
    const results: any[] = [];

    Object.values(REACT_COMPONENTS).forEach(component => {
      const nameMatch = component.name.toLowerCase().includes(lowerQuery);
      const descMatch = component.description.toLowerCase().includes(lowerQuery);
      const categoryMatch = component.category.toLowerCase().includes(lowerQuery);

      if (nameMatch || descMatch || categoryMatch) {
        results.push({
          type: 'component',
          name: component.name,
          description: component.description,
          category: component.category,
          url: component.url,
          relevance: nameMatch ? 'high' : descMatch ? 'medium' : 'low'
        });
      }
    });

    // Sort by relevance
    results.sort((a, b) => {
      const order = { high: 3, medium: 2, low: 1 };
      return order[b.relevance as keyof typeof order] - order[a.relevance as keyof typeof order];
    });

    return {
      query,
      docType,
      mode: 'react-uswds',
      totalResults: results.length,
      results: results.slice(0, 10), // Top 10 results
      searchUrl: `${this.reactBaseUrl}/?path=/docs/`,
      message: results.length === 0 ? 'No results found. Try different keywords.' : undefined
    };
  }

  private async searchUSWDSDocs(query: string, docType: string): Promise<any> {
    // Use USWDS search functionality
    const searchUrl = `${this.uswdsBaseUrl}/search/?query=${encodeURIComponent(query)}`;

    try {
      const html = await this.fetchWithCache(searchUrl);
      const $ = cheerio.load(html);

      const results: any[] = [];
      $('.search-result, .usa-search__results li, article').each((i, elem) => {
        const $elem = $(elem);
        const titleElem = $elem.find('h2, h3, .usa-search__title a, a').first();
        const title = titleElem.text().trim();
        const url = titleElem.attr('href');
        const description = $elem.find('p, .usa-search__description').first().text().trim();

        if (title && url) {
          results.push({
            title,
            url: url.startsWith('http') ? url : `${this.uswdsBaseUrl}${url}`,
            description,
            type: url.includes('/components/') ? 'component' :
                  url.includes('/utilities/') ? 'utility' :
                  url.includes('/design-tokens/') ? 'design-token' : 'documentation'
          });
        }
      });

      return {
        query,
        docType,
        mode: 'vanilla-uswds',
        source: 'live',
        totalResults: results.length,
        results: results.slice(0, 10),
        searchUrl
      };
    } catch (error) {
      return {
        query,
        docType,
        mode: 'vanilla-uswds',
        source: 'fallback',
        message: 'Unable to perform live search. Use the search URL below.',
        searchUrl,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  async getAccessibilityGuidance(componentOrPattern: string): Promise<any> {
    if (this.useReact) {
      // Check if component exists in database
      const component = REACT_COMPONENTS[componentOrPattern];
      if (component && component.accessibility) {
        return {
          component: componentOrPattern,
          mode: 'react-uswds',
          ...component.accessibility,
          wcagLevel: 'AA',
          resources: [
            { title: 'WCAG 2.1 Guidelines', url: 'https://www.w3.org/WAI/WCAG21/quickref/' },
            { title: 'Component Documentation', url: component.url },
            { title: 'React-USWDS Accessibility', url: 'https://github.com/trussworks/react-uswds#accessibility' }
          ]
        };
      }
    }

    // Generic accessibility guidance
    return {
      component: componentOrPattern,
      mode: this.useReact ? 'react-uswds' : 'vanilla-uswds',
      wcagLevel: 'AA',
      guidelines: [
        'All interactive elements must be keyboard accessible',
        'Maintain 4.5:1 color contrast ratio for normal text, 3:1 for large text',
        'Provide clear focus indicators for all interactive elements',
        'Use semantic HTML elements appropriate for content',
        'Include appropriate ARIA labels and roles where needed',
        'Ensure components work with screen readers',
        'Support zoom up to 200% without loss of functionality',
        'Provide text alternatives for non-text content'
      ],
      resources: [
        { title: 'WCAG 2.1 Guidelines', url: 'https://www.w3.org/WAI/WCAG21/quickref/' },
        { title: 'USWDS Accessibility', url: `${this.uswdsBaseUrl}/documentation/accessibility/` },
        { title: 'WebAIM Resources', url: 'https://webaim.org/resources/' }
      ],
      testing: {
        automated: ['axe DevTools', 'WAVE', 'Lighthouse'],
        manual: ['Keyboard navigation', 'Screen reader testing', 'Color contrast verification'],
        wcag: 'Test against WCAG 2.1 Level AA success criteria'
      }
    };
  }

  async listPageTemplates(category: string = 'all'): Promise<any> {
    // Page templates are only available for React-USWDS
    if (!this.useReact) {
      return {
        error: 'Page templates are only available in React mode',
        mode: 'vanilla-uswds',
        message: 'Set USE_REACT_COMPONENTS=true to access page templates',
        availableInReactMode: true
      };
    }

    const allTemplates = Object.values(PAGE_TEMPLATES);

    if (category === 'all') {
      const groupedByCategory: any = {};
      Object.entries(TEMPLATE_CATEGORIES).forEach(([key, label]) => {
        groupedByCategory[key] = allTemplates
          .filter(t => t.category === key)
          .map(t => ({
            name: t.name,
            slug: t.slug,
            description: t.description,
            url: t.url,
            componentsUsed: t.componentsUsed
          }));
      });

      return {
        mode: 'react-uswds',
        total: allTemplates.length,
        categories: TEMPLATE_CATEGORIES,
        templates: groupedByCategory
      };
    }

    const filtered = allTemplates.filter(t => t.category === category);
    return {
      mode: 'react-uswds',
      category,
      categoryLabel: TEMPLATE_CATEGORIES[category as keyof typeof TEMPLATE_CATEGORIES],
      total: filtered.length,
      templates: filtered.map(t => ({
        name: t.name,
        slug: t.slug,
        description: t.description,
        url: t.url,
        componentsUsed: t.componentsUsed
      }))
    };
  }

  async getPageTemplate(templateName: string): Promise<any> {
    // Page templates are only available for React-USWDS
    if (!this.useReact) {
      return {
        error: 'Page templates are only available in React mode',
        mode: 'vanilla-uswds',
        message: 'Set USE_REACT_COMPONENTS=true to access page templates',
        availableInReactMode: true
      };
    }

    // Find template by name or slug
    const template = Object.values(PAGE_TEMPLATES).find(
      t => t.name.toLowerCase() === templateName.toLowerCase() ||
           t.slug.toLowerCase() === templateName.toLowerCase()
    );

    if (!template) {
      return {
        error: `Page template "${templateName}" not found`,
        mode: 'react-uswds',
        suggestion: `Available templates: ${Object.keys(PAGE_TEMPLATES).join(', ')}`,
        message: 'Check template name spelling',
        searchUrl: `${this.reactBaseUrl}/?path=/docs/page-templates-`
      };
    }

    return {
      mode: 'react-uswds',
      name: template.name,
      slug: template.slug,
      description: template.description,
      category: template.category,
      categoryLabel: TEMPLATE_CATEGORIES[template.category as keyof typeof TEMPLATE_CATEGORIES],
      componentsUsed: template.componentsUsed,
      useCase: template.useCase,
      code: template.code,
      url: template.url,
      documentation: {
        officialDocs: template.url,
        repository: 'https://github.com/trussworks/react-uswds',
        storybook: this.reactBaseUrl
      }
    };
  }

  /**
   * Fetch URL with caching to avoid repeated requests
   */
  private async fetchWithCache(url: string): Promise<string> {
    const now = Date.now();
    const cached = this.cache[url];

    if (cached && (now - cached.timestamp) < this.cacheTimeout) {
      return cached.data;
    }

    try {
      const response = await axios.get(url, {
        timeout: 10000,
        headers: {
          'User-Agent': 'USWDS-MCP-Server/0.1.0'
        }
      });

      this.cache[url] = {
        data: response.data,
        timestamp: now
      };

      return response.data;
    } catch (error) {
      if (cached) {
        // Return stale cache if fetch fails
        console.error(`Fetch failed for ${url}, using stale cache`);
        return cached.data;
      }
      throw error;
    }
  }
}
