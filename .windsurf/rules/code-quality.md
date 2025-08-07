---
trigger: always_on
---

# Code Quality Standards
1. NEVER be lazy with the types - always use explicit TypeScript interfaces and types
2. Always make functions as modular as possible - create separate files for distinct functionality
3. Follow security best practices:
   - Never hardcode sensitive data (API keys, passwords)
   - Validate all inputs and props
   - Use proper error handling and boundaries
4. Optimize for performance:
   - Use React.memo, useCallback, useMemo when appropriate
   - Avoid unnecessary re-renders
   - Implement proper loading states and error handling
5. Write self-documenting code with clear variable names
6. Add JSDoc comments for complex functions
7. Follow consistent naming conventions (camelCase for variables, PascalCase for components)
8. Keep functions small and focused on single responsibility
9. Always test critical paths and edge cases