# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Jest testing framework with 37 unit tests for core services
- CONTRIBUTING.md with comprehensive contribution guidelines
- CHANGELOG.md for tracking project history
- GitHub Actions CI/CD pipeline for automated testing and building
- Test scripts: `npm test`, `npm run test:watch`, `npm run test:coverage`
- Lint script: `npm run lint` for TypeScript type checking

### Changed
- Updated tsconfig.json to include `isolatedModules: true` for better compatibility
- Excluded test files from TypeScript build output

## [0.1.0] - 2025-01-08

### Added
- **20 MCP Tools** for USWDS development:
  - Component information and browsing (list_components, get_component_info)
  - Page templates for React (list_page_templates, get_page_template)
  - Design tokens for colors, spacing, typography (get_design_tokens)
  - Code validation (validate_uswds_code)
  - Documentation search (search_docs)
  - Accessibility guidance (get_accessibility_guidance)
  - Color contrast checking (check_color_contrast)
  - Icon browsing (get_icons)
  - Layout patterns (get_layout_patterns)
  - AI-powered suggestions and comparisons (suggest_components, compare_components)
  - Code generation (generate_component_code, generate_form)
  - Advanced generators (generate_multi_step_form, generate_data_table, generate_modal_dialog)
  - Project scaffolding (scaffold_project)
  - HTML to React conversion (convert_html_to_react)

### Features
- **Dual Mode Support**: Toggle between vanilla USWDS and React-USWDS via environment variable
- **46 React-USWDS Components**: Complete component database with props, examples, and accessibility info
- **Page Templates**: 7 pre-built templates (Dashboard, Landing Page, Sign In, Settings, etc.)
- **Design Tokens**: Complete token system for colors, spacing, typography, breakpoints
- **90+ USWDS Icons**: Searchable icon database
- **Color Contrast Checker**: WCAG AA/AAA compliance validation
- **Code Generation**: Generate components, forms, tables, modals from specifications
- **Project Scaffolding**: Create complete Next.js, CRA, or Vite projects
- **HTML Converter**: Convert vanilla USWDS HTML to React-USWDS components

### Technical
- TypeScript with strict type checking
- ES Module (ESM) support
- Model Context Protocol (MCP) v0.6.0
- Node.js 18+ support
- Axios for HTTP requests
- Cheerio for HTML parsing

### Documentation
- Comprehensive README.md with all 20 tools documented
- QUICK_START.md for fast setup
- SETUP.md with detailed configuration
- MCP_TOOLS_GUIDE.md for deep dive into MCP
- USWDS_AGENT_IMPLEMENTATION.md for advanced usage
- FUTURE_TOOLS.md with roadmap of potential enhancements
- Example configurations and usage scenarios

## Version History

### Version 0.1.0 - Initial Release
- First public release of USWDS MCP Server
- Core functionality for USWDS and React-USWDS development
- 20 MCP tools covering components, generation, validation, and accessibility
- Comprehensive documentation and examples

---

## Types of Changes

- `Added` for new features
- `Changed` for changes in existing functionality
- `Deprecated` for soon-to-be removed features
- `Removed` for now removed features
- `Fixed` for any bug fixes
- `Security` for vulnerability fixes

## Commit Message Format

We use conventional commits:
- `feat:` - New features
- `fix:` - Bug fixes
- `docs:` - Documentation changes
- `test:` - Test additions or changes
- `refactor:` - Code refactoring
- `perf:` - Performance improvements
- `chore:` - Build process or auxiliary tool changes

## Release Process

1. Update CHANGELOG.md with new version and changes
2. Update package.json version
3. Create git tag: `git tag v0.2.0`
4. Push tag: `git push origin v0.2.0`
5. GitHub Actions will automatically build and test
6. Create GitHub Release with changelog notes
