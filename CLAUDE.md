# Notifications Frontend

A React-based frontend application for Red Hat Console notification management.

## Project Overview

This application provides a user interface for managing notifications in the Red Hat Hybrid Cloud Console. Built with PatternFly React components and TypeScript.

## Architecture

- **Framework**: React 18 with TypeScript
- **UI Components**: PatternFly 6 (v6.4.0)
- **State Management**: React Context + Hooks
- **Build Tool**: Webpack
- **Testing**: Jest + React Testing Library
- **Storybook**: Component documentation and testing

## Development Commands

```bash
# Install dependencies
npm install

# Start development server
npm start

# Run tests
npm test

# Build for production
npm run build

# Run Storybook
npm run storybook

# Lint
npm run lint
```

## Project Structure

```
src/
├── components/       # React components
├── generated/        # Auto-generated API client (OpenapiNotifications.ts)
├── pages/           # Page-level components
├── services/        # API and business logic
├── types/           # TypeScript type definitions
└── utils/           # Utility functions
```

## Coding Standards

- **TypeScript**: Strict mode enabled, use explicit types
- **React**: Functional components with hooks (no class components)
- **Styling**: Use PatternFly components and utilities
- **Testing**: Test all components with React Testing Library
- **Linting**: ESLint configuration in `.eslintrc.js`

## Key Patterns

- **API Integration**: Auto-generated client in `src/generated/OpenapiNotifications.ts`
- **Component Library**: PatternFly React components
- **Testing**: Co-located test files (\*.test.tsx)
- **Storybook**: Stories in `.storybook/` directory

## Agent Guidelines

1. **Generated Code**: Never manually edit `src/generated/OpenapiNotifications.ts` - it's auto-generated from OpenAPI spec
2. **PatternFly First**: Use PatternFly components instead of custom CSS when possible
3. **Type Safety**: Maintain strict TypeScript types, avoid `any`
4. **Test Coverage**: Write tests for new components
5. **Storybook**: Add stories for new UI components

## PatternFly Skills

The following PatternFly React skills are available via the `pf-react` plugin:

### Component Development

- **/patternfly-component-structure** - Audit component hierarchy, fix nesting violations, debug layout issues
- **/pf-project-scaffolder** - Bootstrap new PatternFly projects with PF6-safe dependencies
- **/pf-import-checker** - Fix PatternFly import path issues (charts, chatbot, component-groups)

### Code Quality

- **/pf-unit-test-generator** - Generate comprehensive unit tests for PatternFly components
- **/pf-library-test-writer** - Write unit tests for PatternFly library contributors (not for consumers)
- **/pf-class-migration-scanner** - Scan for legacy PatternFly classes and suggest PF6 replacements

### Documentation

- **/write-example-description** - Write/refine example descriptions for PatternFly.org
- **/icon-finder** - Find Red Hat Design System icons by use case with visual preview

### Maintenance

- **/pf-bug-triage** - Triage bug reports, suggest fixes, tag maintainers

### When to Use These Skills

- **After adding PatternFly imports**: Run `/pf-import-checker` to verify import paths
- **When building new components**: Use `/patternfly-component-structure` to audit hierarchy
- **When writing tests**: Use `/pf-unit-test-generator` for comprehensive test coverage
- **When migrating code**: Use `/pf-class-migration-scanner` to find legacy patterns
- **When searching for icons**: Use `/icon-finder` to browse Red Hat Design System icons

## CI/CD

- **Platform**: GitHub Actions + Travis CI
- **Build Pipeline**: `.github/workflows/` and `.travis.yml`
- **Deployment**: Automated via Konflux/Tekton (`.tekton/`)

## Known Issues

- `tsconfig.json` has JSON syntax errors (line 19) - needs fixing for proper type checking
- Large generated file (`src/generated/OpenapiNotifications.ts` - 1466 lines) - consider splitting if manually maintained
