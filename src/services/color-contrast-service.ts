/**
 * Color Contrast Service
 * Validates color contrast ratios for WCAG compliance
 */

interface ContrastResult {
  ratio: number;
  wcag: {
    aa: {
      normalText: boolean;
      largeText: boolean;
    };
    aaa: {
      normalText: boolean;
      largeText: boolean;
    };
  };
  passes: string[];
  fails: string[];
  recommendation?: string;
}

export class ColorContrastService {
  /**
   * Check color contrast between two colors
   */
  async checkContrast(
    foreground: string,
    background: string,
    fontSize?: number,
    fontWeight?: string | number
  ): Promise<any> {
    // Parse colors to RGB
    const fg = this.parseColor(foreground);
    const bg = this.parseColor(background);

    if (!fg || !bg) {
      return {
        error: 'Invalid color format',
        message: 'Colors must be in hex (#RRGGBB), rgb(r,g,b), or named color format',
        examples: ['#FF0000', 'rgb(255, 0, 0)', 'red']
      };
    }

    // Calculate contrast ratio
    const ratio = this.calculateContrastRatio(fg, bg);

    // Determine text size category
    const isLargeText = this.isLargeText(fontSize, fontWeight);

    // Check WCAG compliance
    const wcagAA = {
      normalText: ratio >= 4.5,
      largeText: ratio >= 3.0
    };

    const wcagAAA = {
      normalText: ratio >= 7.0,
      largeText: ratio >= 4.5
    };

    const passes: string[] = [];
    const fails: string[] = [];

    // Determine what passes/fails
    if (wcagAAA.normalText) {
      passes.push('WCAG AAA (normal text)', 'WCAG AA (normal text)', 'WCAG AAA (large text)', 'WCAG AA (large text)');
    } else if (wcagAA.normalText) {
      passes.push('WCAG AA (normal text)', 'WCAG AAA (large text)', 'WCAG AA (large text)');
      fails.push('WCAG AAA (normal text)');
    } else if (wcagAAA.largeText) {
      passes.push('WCAG AAA (large text)', 'WCAG AA (large text)');
      fails.push('WCAG AAA (normal text)', 'WCAG AA (normal text)');
    } else if (wcagAA.largeText) {
      passes.push('WCAG AA (large text)');
      fails.push('WCAG AAA (normal text)', 'WCAG AA (normal text)', 'WCAG AAA (large text)');
    } else {
      fails.push('WCAG AAA (normal text)', 'WCAG AA (normal text)', 'WCAG AAA (large text)', 'WCAG AA (large text)');
    }

    // Provide recommendations
    let recommendation = '';
    if (ratio < 3.0) {
      recommendation = 'Contrast ratio is too low. Consider using darker/lighter colors or only for decorative elements.';
    } else if (ratio < 4.5) {
      recommendation = 'Use only for large text (18pt+ or 14pt+ bold). For normal text, increase contrast.';
    } else if (ratio < 7.0) {
      recommendation = 'Meets WCAG AA for all text sizes. Consider higher contrast for AAA compliance.';
    } else {
      recommendation = 'Excellent contrast! Meets WCAG AAA for all text sizes.';
    }

    return {
      foreground: {
        input: foreground,
        rgb: fg,
        hex: this.rgbToHex(fg),
        luminance: this.getLuminance(fg)
      },
      background: {
        input: background,
        rgb: bg,
        hex: this.rgbToHex(bg),
        luminance: this.getLuminance(bg)
      },
      contrastRatio: parseFloat(ratio.toFixed(2)),
      textSize: {
        fontSize: fontSize || 'not specified',
        fontWeight: fontWeight || 'normal',
        category: isLargeText ? 'large text' : 'normal text'
      },
      wcag: {
        aa: wcagAA,
        aaa: wcagAAA
      },
      passes,
      fails,
      recommendation,
      resources: [
        { title: 'WCAG Contrast Guidelines', url: 'https://www.w3.org/WAI/WCAG21/Understanding/contrast-minimum.html' },
        { title: 'USWDS Color Tokens', url: 'https://designsystem.digital.gov/design-tokens/color/' }
      ]
    };
  }

  /**
   * Parse color string to RGB object
   */
  private parseColor(color: string): { r: number; g: number; b: number } | null {
    color = color.trim();

    // Hex format (#RGB or #RRGGBB)
    if (color.startsWith('#')) {
      const hex = color.substring(1);
      if (hex.length === 3) {
        return {
          r: parseInt(hex[0] + hex[0], 16),
          g: parseInt(hex[1] + hex[1], 16),
          b: parseInt(hex[2] + hex[2], 16)
        };
      } else if (hex.length === 6) {
        return {
          r: parseInt(hex.substring(0, 2), 16),
          g: parseInt(hex.substring(2, 4), 16),
          b: parseInt(hex.substring(4, 6), 16)
        };
      }
    }

    // RGB format
    const rgbMatch = color.match(/rgb\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)/i);
    if (rgbMatch) {
      return {
        r: parseInt(rgbMatch[1]),
        g: parseInt(rgbMatch[2]),
        b: parseInt(rgbMatch[3])
      };
    }

    // Named colors (common USWDS colors)
    const namedColors: Record<string, string> = {
      'white': '#ffffff',
      'black': '#000000',
      'red': '#ff0000',
      'blue': '#0000ff',
      'green': '#008000',
      'yellow': '#ffff00',
      'gray': '#808080',
      'primary': '#005ea2',
      'secondary': '#d83933',
      'accent-cool': '#00bde3',
      'accent-warm': '#fa9441'
    };

    if (namedColors[color.toLowerCase()]) {
      return this.parseColor(namedColors[color.toLowerCase()]);
    }

    return null;
  }

  /**
   * Convert RGB to hex
   */
  private rgbToHex(rgb: { r: number; g: number; b: number }): string {
    const toHex = (n: number) => {
      const hex = n.toString(16);
      return hex.length === 1 ? '0' + hex : hex;
    };
    return `#${toHex(rgb.r)}${toHex(rgb.g)}${toHex(rgb.b)}`;
  }

  /**
   * Calculate relative luminance
   */
  private getLuminance(rgb: { r: number; g: number; b: number }): number {
    const rsRGB = rgb.r / 255;
    const gsRGB = rgb.g / 255;
    const bsRGB = rgb.b / 255;

    const r = rsRGB <= 0.03928 ? rsRGB / 12.92 : Math.pow((rsRGB + 0.055) / 1.055, 2.4);
    const g = gsRGB <= 0.03928 ? gsRGB / 12.92 : Math.pow((gsRGB + 0.055) / 1.055, 2.4);
    const b = bsRGB <= 0.03928 ? bsRGB / 12.92 : Math.pow((bsRGB + 0.055) / 1.055, 2.4);

    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  }

  /**
   * Calculate contrast ratio between two colors
   */
  private calculateContrastRatio(
    rgb1: { r: number; g: number; b: number },
    rgb2: { r: number; g: number; b: number }
  ): number {
    const lum1 = this.getLuminance(rgb1);
    const lum2 = this.getLuminance(rgb2);

    const lighter = Math.max(lum1, lum2);
    const darker = Math.min(lum1, lum2);

    return (lighter + 0.05) / (darker + 0.05);
  }

  /**
   * Determine if text is considered "large" by WCAG
   */
  private isLargeText(fontSize?: number, fontWeight?: string | number): boolean {
    if (!fontSize) return false;

    // 18pt (24px) or larger
    if (fontSize >= 24) return true;

    // 14pt (18.66px) or larger AND bold
    if (fontSize >= 18.66) {
      if (typeof fontWeight === 'number') {
        return fontWeight >= 700;
      }
      if (typeof fontWeight === 'string') {
        return fontWeight === 'bold' || fontWeight === '700' || parseInt(fontWeight) >= 700;
      }
    }

    return false;
  }
}
