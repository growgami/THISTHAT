# THISTHAT Design System

This document outlines the comprehensive design system for the THISTHAT social content curation app, a Tinder-style interface for rating tweets.

## Design Philosophy

### Core Principles
- **Clean & Minimal**: Uncluttered interface focusing on content
- **Light & Pleasing**: Soft colors that are easy on the eyes
- **Elegant & Modern**: Contemporary design patterns with smooth animations
- **Mobile-First**: Optimized for touch interactions and small screens
- **Accessible**: High contrast ratios and keyboard navigation support

### Visual Style
- Soft gradients and subtle shadows
- Rounded corners for friendliness
- Ample whitespace for breathing room
- Consistent spacing scale
- Smooth micro-interactions

## Color Palette

### Primary Colors
```css
--background: #fefefe;           /* Main app background */
--surface: #ffffff;              /* Card and component backgrounds */
--surface-hover: #f8fafc;        /* Hover states */
--surface-pressed: #f1f5f9;      /* Active/pressed states */
--border: #e2e8f0;               /* Default borders */
--border-hover: #cbd5e1;         /* Hover border states */
```

### Text Colors
```css
--text-primary: #1e293b;         /* Primary text */
--text-secondary: #64748b;       /* Secondary text */
--text-tertiary: #94a3b8;        /* Tertiary/muted text */
--text-inverse: #ffffff;         /* Text on dark backgrounds */
```

### Brand Colors
```css
--primary: #3b82f6;              /* Brand blue */
--primary-hover: #2563eb;        /* Hover state */
--primary-pressed: #1d4ed8;      /* Active state */
--primary-light: #dbeafe;        /* Light tint */
```

### Action Colors (Swipe Interactions)
```css
--like: #22c55e;                 /* Like/positive action */
--like-light: #dcfce7;           /* Like background */
--dislike: #ef4444;              /* Dislike/negative action */
--dislike-light: #fee2e2;        /* Dislike background */
--super-like: #8b5cf6;           /* Super like action */
--super-like-light: #ede9fe;     /* Super like background */
```

### Semantic Colors
```css
--success: #10b981;              /* Success states */
--success-light: #d1fae5;        /* Success backgrounds */
--error: #ef4444;                /* Error states */
--error-light: #fee2e2;          /* Error backgrounds */
--warning: #f59e0b;              /* Warning states */
--warning-light: #fef3c7;        /* Warning backgrounds */
```

## Typography

### Font Stack
- **Primary**: Geist Sans (modern, clean, highly legible)
- **Mono**: Geist Mono (for code/technical content)
- **Fallback**: system-ui, -apple-system, sans-serif

### Text Scales
```css
.text-display    { font-size: 2.25rem; font-weight: 700; } /* 36px, headlines */
.text-headline   { font-size: 1.875rem; font-weight: 600; } /* 30px, section headers */
.text-title      { font-size: 1.25rem; font-weight: 600; }  /* 20px, card titles */
.text-body       { font-size: 1rem; font-weight: 400; }     /* 16px, body text */
.text-caption    { font-size: 0.875rem; font-weight: 400; } /* 14px, captions */
.text-label      { font-size: 0.75rem; font-weight: 500; }  /* 12px, labels */
```

## Spacing System

### Scale
```css
--space-xs: 0.25rem;   /* 4px */
--space-sm: 0.5rem;    /* 8px */
--space-md: 1rem;      /* 16px */
--space-lg: 1.5rem;    /* 24px */
--space-xl: 2rem;      /* 32px */
--space-2xl: 3rem;     /* 48px */
```

### Usage Guidelines
- Use consistent spacing throughout the interface
- Prefer larger spacing for better mobile touch targets
- Maintain consistent margins between sections
- Use smaller spacing for related elements

## Border Radius

### Scale
```css
--radius-sm: 0.375rem;  /* 6px - small elements */
--radius-md: 0.5rem;    /* 8px - buttons, inputs */
--radius-lg: 0.75rem;   /* 12px - cards */
--radius-xl: 1rem;      /* 16px - large cards */
--radius-full: 9999px;  /* circular elements */
```

## Shadows

### Elevation System
```css
--shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);           /* Subtle elevation */
--shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1);         /* Card elevation */
--shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1);       /* Modal elevation */
--shadow-xl: 0 20px 25px -5px rgb(0 0 0 / 0.1);       /* Floating elevation */
```

## Component Patterns

### Cards
```css
.card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-sm);
  transition: all var(--transition-normal);
}
```

### Buttons
```css
.btn {
  padding: var(--space-sm) var(--space-md);
  border-radius: var(--radius-md);
  font-weight: 500;
  transition: all var(--transition-fast);
}
```

### Avatars
```css
.avatar {
  border-radius: var(--radius-full);
  border: 2px solid var(--border);
  overflow: hidden;
}
```

## Animation & Transitions

### Timing
```css
--transition-fast: 150ms ease-out;     /* Quick interactions */
--transition-normal: 250ms ease-out;   /* Standard transitions */
--transition-slow: 350ms ease-out;     /* Complex animations */
```

### Swipe Animations
- **Rotation**: Cards rotate slightly when swiped
- **Translation**: Smooth movement in swipe direction
- **Opacity**: Fade effect during swipe
- **Scale**: Subtle scaling for depth perception

## Swipe Interaction Design

### Visual Feedback
- **Like (Right)**: Green overlay with heart icon
- **Dislike (Left)**: Red overlay with thumbs down icon
- **Super Like (Up)**: Purple overlay with star icon

### Thresholds
- **Visual Feedback**: 50px movement
- **Action Trigger**: 100px movement
- **Rotation**: 0.1 degree per pixel moved

## Scoring System Design

### Point Values
- **Like**: +2 points (encouraging positive engagement)
- **Dislike**: -1 point (small penalty)
- **Super Like**: +5 points (premium action)

### Visual Indicators
- **Positive Scores**: Green color scheme
- **Negative Scores**: Red color scheme
- **Streaks**: Orange accent with fire emoji

## Leaderboard Design

### Ranking Visual Hierarchy
1. **Gold Medal** (🥇): Gradient gold background
2. **Silver Medal** (🥈): Gradient silver background
3. **Bronze Medal** (🥉): Gradient bronze background
4. **Other Ranks**: Neutral background with rank number

### Information Display
- Username with avatar
- Total score with color coding
- Streak indicators for hot streaks (>5)
- Last activity timestamp
- Number of tweets reviewed

## Responsive Design

### Breakpoints
- **Mobile**: < 640px (primary target)
- **Tablet**: 640px - 1024px
- **Desktop**: > 1024px

### Mobile-First Approach
- Touch-friendly button sizes (minimum 44px)
- Optimized spacing for thumb navigation
- Swipe gestures as primary interaction
- Simplified navigation patterns

## Accessibility

### Color Contrast
- All text meets WCAG AA standards (4.5:1 ratio)
- Interactive elements have sufficient contrast
- Color is not the only way to convey information

### Keyboard Navigation
- All interactive elements are focusable
- Visible focus indicators
- Logical tab order
- Skip links for screen readers

### Motion Preferences
- Respects `prefers-reduced-motion`
- Essential animations only when motion is reduced
- Alternative static feedback for important interactions

## Implementation Notes

### CSS Custom Properties
All design tokens are implemented as CSS custom properties (variables) for:
- Easy theming and customization
- Consistent values across components
- Runtime theme switching capability
- Better maintainability

### Component Classes
Utility classes are provided for common patterns:
- `.card` - Standard card styling
- `.btn` - Button base styles
- `.score-badge` - Score indicators
- `.avatar` - Profile pictures
- `.skeleton` - Loading states

### Performance Considerations
- Minimal CSS bundle size
- Efficient animations using transform and opacity
- Optimized images with proper sizing
- Lazy loading for non-critical content

## Future Considerations

### Dark Mode
Design system is prepared for dark mode with:
- CSS custom properties for easy switching
- Semantic color naming
- Contrast-aware color selection

### Theming
System supports multiple themes through:
- CSS custom property overrides
- Modular color palette structure
- Component-agnostic styling

### Scaling
Design scales to support:
- Additional swipe actions
- More complex scoring systems
- Extended leaderboard features
- User profile customization 