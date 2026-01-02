#!/usr/bin/env node

/**
 * Test script to validate all MCP tools work correctly
 *
 * This script directly imports and tests the MCP server tools
 */

import { ComponentService } from './dist/services/component-service.js';
import { DesignTokenService } from './dist/services/design-token-service.js';
import { ValidationService } from './dist/services/validation-service.js';
import { ColorContrastService } from './dist/services/color-contrast-service.js';
import { IconService } from './dist/services/icon-service.js';
import { LayoutService } from './dist/services/layout-service.js';
import { SuggestionService } from './dist/services/suggestion-service.js';
import { ComparisonService } from './dist/services/comparison-service.js';
import { CodeGeneratorService } from './dist/services/code-generator-service.js';
import { TailwindUSWDSService } from './dist/services/tailwind-uswds-service.js';

const USE_REACT = true;

console.log('🧪 Testing USWDS MCP Server Tools\n');
console.log('Mode:', USE_REACT ? 'React-USWDS' : 'Vanilla USWDS');
console.log('─'.repeat(60));

// Initialize services
const componentService = new ComponentService(USE_REACT);
const designTokenService = new DesignTokenService();
const validationService = new ValidationService();
const colorContrastService = new ColorContrastService();
const iconService = new IconService();
const layoutService = new LayoutService(USE_REACT);
const suggestionService = new SuggestionService(USE_REACT);
const comparisonService = new ComparisonService(USE_REACT);
const codeGeneratorService = new CodeGeneratorService(USE_REACT);
const tailwindUSWDSService = new TailwindUSWDSService();

async function testTool(name, fn) {
  try {
    console.log(`\n✓ Testing: ${name}`);
    const result = await fn();
    const preview = typeof result === 'string'
      ? result.substring(0, 100) + (result.length > 100 ? '...' : '')
      : JSON.stringify(result).substring(0, 100) + '...';
    console.log(`  Result: ${preview}`);
    return true;
  } catch (error) {
    console.log(`  ✗ FAILED: ${error.message}`);
    return false;
  }
}

async function runTests() {
  let passed = 0;
  let failed = 0;

  // Test 1: list_components
  if (await testTool('list_components', () => componentService.listComponents('forms'))) passed++;
  else failed++;

  // Test 2: get_component_info
  if (await testTool('get_component_info', () => componentService.getComponentInfo('Button', true))) passed++;
  else failed++;

  // Test 3: get_design_tokens
  if (await testTool('get_design_tokens', () => designTokenService.getTokens('color'))) passed++;
  else failed++;

  // Test 4: validate_uswds_code
  if (await testTool('validate_uswds_code', () => validationService.validate('<button class="usa-button">Click</button>', false, true))) passed++;
  else failed++;

  // Test 5: check_color_contrast
  if (await testTool('check_color_contrast', () => colorContrastService.checkContrast('#005ea2', '#ffffff'))) passed++;
  else failed++;

  // Test 6: search_icons
  if (await testTool('search_icons', () => iconService.getIcons(undefined, 'arrow'))) passed++;
  else failed++;

  // Test 7: suggest_layout
  if (await testTool('suggest_layout', () => layoutService.suggestLayout('landing'))) passed++;
  else failed++;

  // Test 8: suggest_components
  if (await testTool('suggest_components', () => suggestionService.suggestComponents('user registration form'))) passed++;
  else failed++;

  // Test 9: compare_components
  if (await testTool('compare_components', () => comparisonService.compareComponents('Alert', 'Banner'))) passed++;
  else failed++;

  // Test 10: generate_component_code
  if (await testTool('generate_component_code', () => codeGeneratorService.generateComponent('Button', { type: 'primary' }))) passed++;
  else failed++;

  // Test 11: get_tailwind_uswds_getting_started
  if (await testTool('get_tailwind_uswds_getting_started', () => tailwindUSWDSService.getGettingStarted())) passed++;
  else failed++;

  // Test 12: get_tailwind_uswds_component
  if (await testTool('get_tailwind_uswds_component', () => tailwindUSWDSService.getComponentDocs('Button'))) passed++;
  else failed++;

  // Test 13: get_tailwind_uswds_javascript
  if (await testTool('get_tailwind_uswds_javascript', () => tailwindUSWDSService.getJavaScriptDocs())) passed++;
  else failed++;

  // Test 14: get_tailwind_uswds_colors
  if (await testTool('get_tailwind_uswds_colors', () => tailwindUSWDSService.getColorsDocs())) passed++;
  else failed++;

  // Test 15: get_tailwind_uswds_icons
  if (await testTool('get_tailwind_uswds_icons', () => tailwindUSWDSService.getIconsDocs())) passed++;
  else failed++;

  // Test 16: get_tailwind_uswds_typography
  if (await testTool('get_tailwind_uswds_typography', () => tailwindUSWDSService.getTypographyDocs())) passed++;
  else failed++;

  // Test 17: search_tailwind_uswds_docs
  if (await testTool('search_tailwind_uswds_docs', () => tailwindUSWDSService.searchDocs('spacing'))) passed++;
  else failed++;

  // Summary
  console.log('\n' + '─'.repeat(60));
  console.log(`\n📊 Test Results: ${passed} passed, ${failed} failed (${passed + failed} total)`);

  if (failed === 0) {
    console.log('\n✅ All tools are working correctly!');
    process.exit(0);
  } else {
    console.log('\n❌ Some tools failed. Please review the errors above.');
    process.exit(1);
  }
}

runTests().catch(error => {
  console.error('\n❌ Test suite failed:', error);
  process.exit(1);
});
