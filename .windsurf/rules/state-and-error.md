---
trigger: always_on
---

# State and Data Flow
1. Local state with useState for component-specific data
2. Custom hooks for reusable stateful logic
3. Context API for shared state across component trees
4. Props drilling should be avoided - use composition or context
5. Always handle loading, error, and success states
6. Use proper TypeScript typing for all state variables

# Error Management
1. Implement Error Boundaries for component error catching
2. Use try-catch blocks for async operations
3. Provide meaningful error messages to users
4. Log errors appropriately for debugging
5. Always have fallback UI for error states
6. Validate props and data at component boundaries