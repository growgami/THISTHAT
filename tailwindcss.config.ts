/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,html}",
    "./public/index.html"
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        surface: "var(--surface)",
        "surface-hover": "var(--surface-hover)",
        "surface-pressed": "var(--surface-pressed)",
        border: "var(--border)",
        "border-hover": "var(--border-hover)",
        "text-primary": "var(--text-primary)",
        "text-secondary": "var(--text-secondary)",
        "text-tertiary": "var(--text-tertiary)",
        "text-inverse": "var(--text-inverse)",
        primary: "var(--primary)",
        "primary-hover": "var(--primary-hover)",
        "primary-pressed": "var(--primary-pressed)",
        "primary-light": "var(--primary-light)",
        accent: "var(--accent)",
        "accent-hover": "var(--accent-hover)",
        "accent-light": "var(--accent-light)",
        success: "var(--success)",
        "success-light": "var(--success-light)",
        error: "var(--error)",
        "error-light": "var(--error-light)",
        warning: "var(--warning)",
        "warning-light": "var(--warning-light)",
      },
      fontFamily: {
        sans: "var(--font-sans)",
        mono: "var(--font-mono)",
        pixel: "var(--font-pixel)",
        retro: "var(--font-retro)",
      },
      borderRadius: {
        sm: "var(--radius-sm)",
        md: "var(--radius-md)",
        lg: "var(--radius-lg)",
        xl: "var(--radius-xl)",
        "2xl": "var(--radius-2xl)",
      },
      spacing: {
        xs: "var(--space-xs)",
        sm: "var(--space-sm)",
        md: "var(--space-md)",
        lg: "var(--space-lg)",
        xl: "var(--space-xl)",
        "2xl": "var(--space-2xl)",
      },
      boxShadow: {
        sm: "var(--shadow-sm)",
        md: "var(--shadow-md)",
        lg: "var(--shadow-lg)",
        xl: "var(--shadow-xl)",
        card: "var(--card-shadow)",
        "card-hover": "var(--card-shadow-hover)",
      },
      transitionDuration: {
        fast: "var(--transition-fast)",
        normal: "var(--transition-normal)",
        slow: "var(--transition-slow)",
      }
    }
  },
};
 