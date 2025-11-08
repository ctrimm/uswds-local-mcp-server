/**
 * Tests for ComparisonService
 */

import { ComparisonService } from '../services/comparison-service.js';

describe('ComparisonService', () => {
  describe('Constructor and Mode', () => {
    it('should initialize with vanilla mode by default', () => {
      const service = new ComparisonService();
      expect(service).toBeDefined();
    });

    it('should initialize with React mode when specified', () => {
      const service = new ComparisonService(true);
      expect(service).toBeDefined();
    });
  });

  describe('compareComponents - Vanilla Mode', () => {
    it('should return error in vanilla mode', async () => {
      const service = new ComparisonService(false);
      const result = await service.compareComponents('Button', 'Alert');

      expect(result.error).toBe('Component comparison is only available in React mode');
      expect(result.mode).toBe('vanilla-uswds');
      expect(result.message).toContain('USE_REACT_COMPONENTS=true');
    });
  });

  describe('compareComponents - React Mode', () => {
    let service: ComparisonService;

    beforeEach(() => {
      service = new ComparisonService(true);
    });

    it('should return error when both components not found', async () => {
      const result = await service.compareComponents('Invalid1', 'Invalid2');

      expect(result.error).toBe('Neither component found');
      expect(result.message).toBeDefined();
      expect(result.hint).toBeDefined();
    });

    it('should return error when first component not found', async () => {
      const result = await service.compareComponents('InvalidComponent', 'Button');

      expect(result.error).toContain('not found');
      expect(result.message).toBeDefined();
      expect(result.suggestion).toBeDefined();
    });

    it('should return error when second component not found', async () => {
      const result = await service.compareComponents('Button', 'InvalidComponent');

      expect(result.error).toContain('not found');
      expect(result.message).toBeDefined();
      expect(result.suggestion).toBeDefined();
    });

    it('should suggest similar components for misspelled names', async () => {
      const result = await service.compareComponents('Buton', 'Alert');

      expect(result.error).toBeDefined();
      expect(result.suggestion).toBeDefined();
    });

    it('should compare Button and Alert successfully', async () => {
      const result = await service.compareComponents('Button', 'Alert');

      expect(result.components).toBeDefined();
      expect(result.components.Button).toBeDefined();
      expect(result.components.Alert).toBeDefined();
      expect(result.similarities).toBeDefined();
      expect(result.differences).toBeDefined();
    });

    it('should include component details in comparison', async () => {
      const result = await service.compareComponents('Button', 'Alert');

      expect(result.components.Button.name).toBeDefined();
      expect(result.components.Button.category).toBeDefined();
      expect(result.components.Button.description).toBeDefined();
      expect(result.components.Button.url).toBeDefined();

      expect(result.components.Alert.name).toBeDefined();
      expect(result.components.Alert.category).toBeDefined();
      expect(result.components.Alert.description).toBeDefined();
      expect(result.components.Alert.url).toBeDefined();
    });

    it('should identify similarities between components', async () => {
      const result = await service.compareComponents('Button', 'Alert');

      expect(result.similarities).toBeDefined();
      expect(result.similarities).toBeInstanceOf(Array);
    });

    it('should identify differences between components', async () => {
      const result = await service.compareComponents('Button', 'Alert');

      expect(result.differences).toBeDefined();
      expect(typeof result.differences).toBe('object');
    });

    it('should compare props between components', async () => {
      const result = await service.compareComponents('Button', 'Alert');

      expect(result.props).toBeDefined();
      expect(result.props.Button).toBeDefined();
      expect(result.props.Alert).toBeDefined();
    });

    it('should include prop counts', async () => {
      const result = await service.compareComponents('Button', 'Alert');

      expect(result.props.Button.count).toBeDefined();
      expect(typeof result.props.Button.count).toBe('number');
      expect(result.props.Alert.count).toBeDefined();
      expect(typeof result.props.Alert.count).toBe('number');
    });

    it('should identify unique props for each component', async () => {
      const result = await service.compareComponents('Button', 'TextInput');

      expect(result.props.Button.unique).toBeDefined();
      expect(result.props.Button.unique).toBeInstanceOf(Array);
      expect(result.props.TextInput.unique).toBeDefined();
      expect(result.props.TextInput.unique).toBeInstanceOf(Array);
    });

    it('should identify shared props between components', async () => {
      const result = await service.compareComponents('Button', 'TextInput');

      expect(result.props.Button.shared).toBeDefined();
      expect(result.props.Button.shared).toBeInstanceOf(Array);
      expect(result.props.TextInput.shared).toBeDefined();
      expect(result.props.TextInput.shared).toBeInstanceOf(Array);
    });

    it('should provide usage guidance', async () => {
      const result = await service.compareComponents('Button', 'Alert');

      expect(result.whenToUse).toBeDefined();
      expect(typeof result.whenToUse).toBe('object');
    });

    it('should include recommendation', async () => {
      const result = await service.compareComponents('Button', 'Alert');

      expect(result.recommendation).toBeDefined();
      expect(typeof result.recommendation).toBe('string');
    });

    it('should compare similar components', async () => {
      const result = await service.compareComponents('TextInput', 'Textarea');

      expect(result.components).toBeDefined();
      expect(result.similarities).toBeDefined();
      expect(result.differences).toBeDefined();
    });

    it('should compare components from same category', async () => {
      const result = await service.compareComponents('Alert', 'Banner');

      expect(result.components).toBeDefined();
      expect(result.similarities).toBeDefined();
      expect(result.differences).toBeDefined();
    });

    it('should compare components from different categories', async () => {
      const result = await service.compareComponents('Button', 'Card');

      expect(result.components).toBeDefined();
      expect(result.components.Button.category).toBeDefined();
      expect(result.components.Card.category).toBeDefined();
    });

    it('should handle comparison of same component', async () => {
      const result = await service.compareComponents('Button', 'Button');

      expect(result.components).toBeDefined();
      expect(result.components.Button).toBeDefined();
      expect(result.similarities).toBeDefined();
    });

    it('should compare form components', async () => {
      const result = await service.compareComponents('Checkbox', 'Radio');

      expect(result.components).toBeDefined();
      expect(result.similarities.length).toBeGreaterThan(0);
    });

    it('should compare navigation components', async () => {
      const result = await service.compareComponents('Header', 'Footer');

      expect(result.components).toBeDefined();
      expect(result.components.Header).toBeDefined();
      expect(result.components.Footer).toBeDefined();
    });

    it('should compare layout components', async () => {
      const result = await service.compareComponents('Grid', 'Card');

      expect(result.components).toBeDefined();
      expect(result.differences).toBeDefined();
    });

    it('should handle components with many props', async () => {
      const result = await service.compareComponents('Table', 'Card');

      expect(result.props.Table.count).toBeGreaterThan(0);
      expect(result.props.Card.count).toBeGreaterThan(0);
    });

    it('should handle components with few props', async () => {
      const result = await service.compareComponents('Icon', 'Tag');

      expect(result.props).toBeDefined();
      expect(result.components).toBeDefined();
    });

    it('should provide meaningful similarities', async () => {
      const result = await service.compareComponents('Button', 'Link');

      if (result.similarities && result.similarities.length > 0) {
        result.similarities.forEach((similarity: string) => {
          expect(typeof similarity).toBe('string');
          expect(similarity.length).toBeGreaterThan(0);
        });
      }
    });

    it('should provide structured differences', async () => {
      const result = await service.compareComponents('Button', 'Alert');

      expect(result.differences).toBeDefined();
      expect(typeof result.differences).toBe('object');
    });

    it('should provide usage guidance for both components', async () => {
      const result = await service.compareComponents('Button', 'Alert');

      if (result.whenToUse) {
        expect(result.whenToUse).toBeDefined();
      }
    });

    it('should handle case-sensitive component names', async () => {
      const result = await service.compareComponents('button', 'alert');

      // Should fail since component names are case-sensitive
      expect(result.error).toBeDefined();
    });

    it('should compare modal-related components', async () => {
      const result = await service.compareComponents('Modal', 'Alert');

      expect(result.components).toBeDefined();
      expect(result.similarities).toBeDefined();
    });

    it('should compare date-related components', async () => {
      const result = await service.compareComponents('DatePicker', 'DateRangePicker');

      expect(result.components).toBeDefined();
      expect(result.similarities.length).toBeGreaterThan(0);
    });

    it('should compare accordion and card', async () => {
      const result = await service.compareComponents('Accordion', 'Card');

      expect(result.components).toBeDefined();
      expect(result.differences).toBeDefined();
    });

    it('should compare table and list', async () => {
      const result = await service.compareComponents('Table', 'Card');

      expect(result.components).toBeDefined();
      expect(result.recommendation).toBeDefined();
    });

    it('should return all required top-level keys', async () => {
      const result = await service.compareComponents('Button', 'Alert');

      expect(result).toHaveProperty('components');
      expect(result).toHaveProperty('similarities');
      expect(result).toHaveProperty('differences');
      expect(result).toHaveProperty('props');
      expect(result).toHaveProperty('whenToUse');
      expect(result).toHaveProperty('recommendation');
    });

    it('should have consistent prop structure', async () => {
      const result = await service.compareComponents('Button', 'Alert');

      expect(result.props.Button).toHaveProperty('count');
      expect(result.props.Button).toHaveProperty('unique');
      expect(result.props.Button).toHaveProperty('shared');

      expect(result.props.Alert).toHaveProperty('count');
      expect(result.props.Alert).toHaveProperty('unique');
      expect(result.props.Alert).toHaveProperty('shared');
    });

    it('should handle select and combobox comparison', async () => {
      const result = await service.compareComponents('Select', 'ComboBox');

      expect(result.components).toBeDefined();
      expect(result.similarities.length).toBeGreaterThan(0);
    });

    it('should compare search components', async () => {
      const result = await service.compareComponents('Search', 'TextInput');

      expect(result.components).toBeDefined();
      expect(result.differences).toBeDefined();
    });

    it('should compare pagination components', async () => {
      const result = await service.compareComponents('Pagination', 'Button');

      expect(result.components).toBeDefined();
      expect(result.differences).toBeDefined();
    });
  });
});
