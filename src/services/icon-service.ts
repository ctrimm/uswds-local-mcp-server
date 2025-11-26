/**
 * Icon Service
 * Browse and search USWDS icons
 */

import { USWDS_ICONS, ICON_CATEGORIES } from '../data/uswds-icons.js';

export class IconService {
  /**
   * Get all icons or filter by category/search
   */
  async getIcons(category?: string, search?: string): Promise<any> {
    const allIcons = Object.values(USWDS_ICONS);

    // Filter by category
    let filtered = category && category !== 'all'
      ? allIcons.filter(icon => icon.category === category)
      : allIcons;

    // Filter by search
    if (search) {
      const searchLower = search.toLowerCase();
      filtered = filtered.filter(icon =>
        icon.name.toLowerCase().includes(searchLower) ||
        icon.keywords.some(k => k.toLowerCase().includes(searchLower)) ||
        icon.usage.toLowerCase().includes(searchLower)
      );
    }

    // Group by category
    const grouped: any = {};
    Object.entries(ICON_CATEGORIES).forEach(([key, label]) => {
      const icons = filtered.filter(i => i.category === key);
      if (icons.length > 0) {
        grouped[key] = {
          label,
          count: icons.length,
          icons: icons.map(i => ({
            name: i.name,
            usage: i.usage,
            keywords: i.keywords
          }))
        };
      }
    });

    return {
      total: filtered.length,
      categories: ICON_CATEGORIES,
      filters: {
        category: category || 'all',
        search: search || null
      },
      icons: grouped,
      usage: {
        react: 'import { Icon } from \'@trussworks/react-uswds\'\n\n<Icon>icon_name</Icon>',
        html: '<svg class="usa-icon" aria-hidden="true" role="img"><use xlink:href="/path/to/sprite.svg#icon_name"></use></svg>'
      },
      resources: [
        { title: 'USWDS Icons', url: 'https://designsystem.digital.gov/components/icon/' },
        { title: 'Material Icons', url: 'https://fonts.google.com/icons' }
      ]
    };
  }

  /**
   * Get detailed info for a specific icon
   */
  async getIconInfo(iconName: string): Promise<any> {
    const icon = USWDS_ICONS[iconName];

    if (!icon) {
      // Try to find similar icons
      const similar = Object.values(USWDS_ICONS)
        .filter(i =>
          i.name.includes(iconName.toLowerCase()) ||
          i.keywords.some(k => k.includes(iconName.toLowerCase()))
        )
        .slice(0, 5)
        .map(i => i.name);

      return {
        error: `Icon "${iconName}" not found`,
        suggestion: similar.length > 0
          ? `Did you mean: ${similar.join(', ')}?`
          : 'Browse available icons with the get_icons tool',
        availableIcons: Object.keys(USWDS_ICONS).length
      };
    }

    return {
      name: icon.name,
      category: icon.category,
      categoryLabel: ICON_CATEGORIES[icon.category as keyof typeof ICON_CATEGORIES],
      usage: icon.usage,
      keywords: icon.keywords,
      examples: {
        react: {
          basic: `import { Icon } from '@trussworks/react-uswds'\n\n<Icon>${icon.name}</Icon>`,
          withSize: `<Icon size="5">${icon.name}</Icon>`,
          withLabel: `<Icon aria-label="${icon.usage}">${icon.name}</Icon>`,
          inButton: `<Button>\n  <Icon>${icon.name}</Icon>\n  Button Text\n</Button>`
        },
        html: {
          basic: `<svg class="usa-icon" aria-hidden="true" role="img">\n  <use xlink:href="/assets/img/sprite.svg#${icon.name}"></use>\n</svg>`,
          withSize: `<svg class="usa-icon usa-icon--size-5" aria-hidden="true" role="img">\n  <use xlink:href="/assets/img/sprite.svg#${icon.name}"></use>\n</svg>`
        }
      },
      accessibility: {
        decorative: 'Use aria-hidden="true" for decorative icons',
        meaningful: `Use aria-label="${icon.usage}" for meaningful icons`,
        inButton: 'Include visible text or aria-label on the button',
        guidelines: [
          'Icons should not be the only means of conveying information',
          'Provide text alternatives for screen readers',
          'Use appropriate aria-hidden or aria-label attributes'
        ]
      },
      relatedIcons: Object.values(USWDS_ICONS)
        .filter(i =>
          i.category === icon.category &&
          i.name !== icon.name
        )
        .slice(0, 5)
        .map(i => i.name)
    };
  }
}
