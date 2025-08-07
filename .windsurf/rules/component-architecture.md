---
trigger: always_on
---

# React Component Architecture
1. Modular component structure:
   - Main orchestrator components in `src/features/[feature-name]/containers`
   - Feature-specific components in `src/features/[feature-name]/components`
   - Shared/reusable components in `src/components/shared`
2. File organization:
   - One component per file, named after the component
   - Hooks in separate files: `src/features/[feature-name]/hooks/`
   - Types and interfaces in: `src/types/` or co-located with components
   - Utils and helpers in: `src/utils/` or feature-specific utils
3. Import conventions:
   - Use `@/` alias for imports from src directory
   - Group imports: React imports first, then third-party, then local imports
   - Use named imports when possible for better tree-shaking
   - DO NOT use barrel exports (index.ts files) - import directly from individual files
4. Component patterns:
   - Always export components as default
   - Use TypeScript interfaces for all props
   - Implement proper prop validation and default values
   - Follow the container/presentational component pattern when appropriate