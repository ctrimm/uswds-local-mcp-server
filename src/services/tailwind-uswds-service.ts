import axios from 'axios';
import * as cheerio from 'cheerio';

interface DocumentationCache {
  [url: string]: {
    data: any;
    timestamp: number;
  };
}

interface TailwindUSWDSDoc {
  url: string;
  title: string;
  content: string;
  sections?: any[];
}

/**
 * Service for fetching USWDS + Tailwind CSS documentation
 * from https://v2.uswds-tailwind.com/
 */
export class TailwindUSWDSService {
  private baseUrl = 'https://v2.uswds-tailwind.com';
  private cache: DocumentationCache = {};
  private cacheTimeout = 3600000; // 1 hour in milliseconds

  /**
   * Fetch URL with caching to reduce repeated requests
   */
  private async fetchWithCache(url: string): Promise<string> {
    const now = Date.now();

    // Return cached data if available and not expired
    if (this.cache[url] && (now - this.cache[url].timestamp) < this.cacheTimeout) {
      return this.cache[url].data;
    }

    try {
      const response = await axios.get(url, {
        headers: {
          'User-Agent': 'USWDS-MCP-Server/0.1.0',
        },
        timeout: 10000,
      });

      this.cache[url] = {
        data: response.data,
        timestamp: now,
      };

      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(`Failed to fetch ${url}: ${error.message}`);
      }
      throw error;
    }
  }

  /**
   * Parse HTML content and extract structured documentation
   */
  private parseDocumentation(html: string, url: string): TailwindUSWDSDoc {
    const $ = cheerio.load(html);

    // Extract title
    const title = $('h1').first().text().trim() ||
                  $('title').text().trim() ||
                  'Untitled';

    // Extract main content
    let content = '';
    const sections: any[] = [];

    // Try to find the main content area
    const mainContent = $('main, article, .content, #content').first();

    if (mainContent.length) {
      // Extract text content
      content = mainContent.text().trim();

      // Extract sections with headings
      mainContent.find('h2, h3').each((i, elem) => {
        const $heading = $(elem);
        const sectionTitle = $heading.text().trim();
        const level = elem.name; // h2, h3, etc.

        // Get content until next heading
        let sectionContent = '';
        $heading.nextUntil('h2, h3').each((j, el) => {
          sectionContent += $(el).text().trim() + '\n';
        });

        sections.push({
          title: sectionTitle,
          level,
          content: sectionContent.trim(),
        });
      });

      // Extract code examples
      mainContent.find('pre code, pre').each((i, elem) => {
        const code = $(elem).text().trim();
        if (code) {
          sections.push({
            type: 'code',
            content: code,
          });
        }
      });
    } else {
      // Fallback to full body text
      content = $('body').text().trim();
    }

    return {
      url,
      title,
      content,
      sections: sections.length > 0 ? sections : undefined,
    };
  }

  /**
   * Get the Getting Started documentation
   */
  async getGettingStarted(): Promise<any> {
    const url = `${this.baseUrl}/getting-started`;

    try {
      const html = await this.fetchWithCache(url);
      const doc = this.parseDocumentation(html, url);

      return {
        source: 'uswds-tailwind',
        type: 'getting-started',
        ...doc,
      };
    } catch (error) {
      throw new Error(`Failed to fetch Getting Started documentation: ${error}`);
    }
  }

  /**
   * List all available Tailwind USWDS components
   */
  async listComponents(category: string = 'all'): Promise<any> {
    // Tailwind USWDS doesn't have categories yet, so we list all components
    // In the future, we could add category filtering
    return this.getComponentDocs();
  }

  /**
   * Get component documentation
   */
  async getComponentDocs(componentName?: string): Promise<any> {
    if (componentName) {
      // Fetch specific component
      const slug = componentName.toLowerCase().replace(/\s+/g, '-');
      const url = `${this.baseUrl}/components/${slug}`;

      try {
        const html = await this.fetchWithCache(url);
        const doc = this.parseDocumentation(html, url);

        return {
          source: 'uswds-tailwind',
          type: 'component',
          componentName,
          ...doc,
        };
      } catch (error) {
        throw new Error(`Failed to fetch component "${componentName}": ${error}`);
      }
    } else {
      // List all components
      const url = `${this.baseUrl}/components`;

      try {
        const html = await this.fetchWithCache(url);
        const $ = cheerio.load(html);

        const components: any[] = [];

        // Try to find component links
        $('a[href^="/components/"]').each((i, elem) => {
          const $link = $(elem);
          const href = $link.attr('href');
          const text = $link.text().trim();

          if (href && text && !href.endsWith('/components')) {
            const slug = href.replace('/components/', '');
            components.push({
              name: text,
              slug,
              url: `${this.baseUrl}${href}`,
            });
          }
        });

        return {
          source: 'uswds-tailwind',
          type: 'component-list',
          url,
          total: components.length,
          components: [...new Map(components.map(c => [c.slug, c])).values()], // Remove duplicates
        };
      } catch (error) {
        throw new Error(`Failed to fetch components list: ${error}`);
      }
    }
  }

  /**
   * Get JavaScript documentation
   */
  async getJavaScriptDocs(): Promise<any> {
    const url = `${this.baseUrl}/javascript`;

    try {
      const html = await this.fetchWithCache(url);
      const doc = this.parseDocumentation(html, url);

      return {
        source: 'uswds-tailwind',
        type: 'javascript',
        ...doc,
      };
    } catch (error) {
      throw new Error(`Failed to fetch JavaScript documentation: ${error}`);
    }
  }

  /**
   * Get colors documentation
   */
  async getColorsDocs(): Promise<any> {
    const url = `${this.baseUrl}/colors`;

    try {
      const html = await this.fetchWithCache(url);
      const doc = this.parseDocumentation(html, url);

      return {
        source: 'uswds-tailwind',
        type: 'colors',
        ...doc,
      };
    } catch (error) {
      throw new Error(`Failed to fetch colors documentation: ${error}`);
    }
  }

  /**
   * Get icons documentation
   */
  async getIconsDocs(): Promise<any> {
    const url = `${this.baseUrl}/icons`;

    try {
      const html = await this.fetchWithCache(url);
      const doc = this.parseDocumentation(html, url);

      return {
        source: 'uswds-tailwind',
        type: 'icons',
        ...doc,
      };
    } catch (error) {
      throw new Error(`Failed to fetch icons documentation: ${error}`);
    }
  }

  /**
   * Get typography documentation
   */
  async getTypographyDocs(): Promise<any> {
    const url = `${this.baseUrl}/typography`;

    try {
      const html = await this.fetchWithCache(url);
      const doc = this.parseDocumentation(html, url);

      return {
        source: 'uswds-tailwind',
        type: 'typography',
        ...doc,
      };
    } catch (error) {
      throw new Error(`Failed to fetch typography documentation: ${error}`);
    }
  }

  /**
   * Search all documentation
   */
  async searchDocs(query: string): Promise<any> {
    // For now, we'll implement a simple search across common pages
    // In the future, this could be enhanced with a proper search index

    const searchResults: any[] = [];
    const queryLower = query.toLowerCase();

    const sections = [
      { name: 'Getting Started', fetcher: () => this.getGettingStarted() },
      { name: 'JavaScript', fetcher: () => this.getJavaScriptDocs() },
      { name: 'Colors', fetcher: () => this.getColorsDocs() },
      { name: 'Icons', fetcher: () => this.getIconsDocs() },
      { name: 'Typography', fetcher: () => this.getTypographyDocs() },
    ];

    for (const section of sections) {
      try {
        const doc = await section.fetcher();

        // Check if query matches title or content
        const titleMatch = doc.title?.toLowerCase().includes(queryLower);
        const contentMatch = doc.content?.toLowerCase().includes(queryLower);

        if (titleMatch || contentMatch) {
          searchResults.push({
            section: section.name,
            title: doc.title,
            url: doc.url,
            relevance: titleMatch ? 'high' : 'medium',
            excerpt: this.extractExcerpt(doc.content, query),
          });
        }
      } catch (error) {
        // Continue searching other sections even if one fails
        console.error(`Error searching ${section.name}:`, error);
      }
    }

    return {
      source: 'uswds-tailwind',
      query,
      total: searchResults.length,
      results: searchResults,
    };
  }

  /**
   * Extract a relevant excerpt from content based on query
   */
  private extractExcerpt(content: string, query: string, contextLength: number = 150): string {
    const queryLower = query.toLowerCase();
    const contentLower = content.toLowerCase();
    const index = contentLower.indexOf(queryLower);

    if (index === -1) {
      return content.substring(0, contextLength) + '...';
    }

    const start = Math.max(0, index - contextLength / 2);
    const end = Math.min(content.length, index + query.length + contextLength / 2);

    let excerpt = content.substring(start, end);
    if (start > 0) excerpt = '...' + excerpt;
    if (end < content.length) excerpt = excerpt + '...';

    return excerpt;
  }
}
