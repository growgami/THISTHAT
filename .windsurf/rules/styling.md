---
trigger: model_decision
description: when styling the JSX of the components
---

# Tailwind CSS Styling Approach
1. Use inline utility classes directly in JSX for simple, static styling
2. Only use template literal styling variables when there's a genuine need:
   - Complex conditional logic
   - Reusable class combinations across multiple elements
   - Very long class strings that hurt readability
   - Dynamic class composition with multiple variables
3. Don't create unnecessary const variables for simple class strings

# Examples
## Good (simple case):
```javascript
return <div className="bg-black text-white p-4">...</div>;

## Good (complex case with geniune need):
const containerClasses = `
  backdrop-blur-md bg-[#101010]/80
  border border-white/10
  rounded-lg p-4
  ${isActive ? 'shadow-lg' : 'shadow-sm'}
  ${className}
`.trim();

## Bad (unnecessary abstraction): 
const simpleClasses = "bg-black text-white p-4";
return <div className={simpleClasses}>...</div>;