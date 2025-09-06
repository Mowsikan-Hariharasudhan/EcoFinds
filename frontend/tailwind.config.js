/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: [
    './pages/**/*.{js,jsx}',
    './components/**/*.{js,jsx}',
    './app/**/*.{js,jsx}',
    './src/**/*.{js,jsx}',
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "var(--color-border)", // sage-green-12
        input: "var(--color-input)", // warm-gray
        ring: "var(--color-ring)", // sage-green
        background: "var(--color-background)", // off-white
        foreground: "var(--color-foreground)", // deep-forest-green
        primary: {
          DEFAULT: "var(--color-primary)", // sage-green
          foreground: "var(--color-primary-foreground)", // off-white
        },
        secondary: {
          DEFAULT: "var(--color-secondary)", // light-sage
          foreground: "var(--color-secondary-foreground)", // deep-forest-green
        },
        destructive: {
          DEFAULT: "var(--color-destructive)", // muted-sienna
          foreground: "var(--color-destructive-foreground)", // off-white
        },
        muted: {
          DEFAULT: "var(--color-muted)", // warm-gray
          foreground: "var(--color-muted-foreground)", // muted-gray-green
        },
        accent: {
          DEFAULT: "var(--color-accent)", // warm-terracotta
          foreground: "var(--color-accent-foreground)", // deep-forest-green
        },
        popover: {
          DEFAULT: "var(--color-popover)", // off-white
          foreground: "var(--color-popover-foreground)", // deep-forest-green
        },
        card: {
          DEFAULT: "var(--color-card)", // warm-gray
          foreground: "var(--color-card-foreground)", // deep-forest-green
        },
        success: {
          DEFAULT: "var(--color-success)", // natural-green
          foreground: "var(--color-success-foreground)", // off-white
        },
        warning: {
          DEFAULT: "var(--color-warning)", // earthy-gold
          foreground: "var(--color-warning-foreground)", // deep-forest-green
        },
        error: {
          DEFAULT: "var(--color-error)", // muted-sienna
          foreground: "var(--color-error-foreground)", // off-white
        },
      },
      borderRadius: {
        lg: "8px",
        md: "6px",
        sm: "4px",
      },
      fontFamily: {
        sans: ['Source Sans 3', 'sans-serif'],
        heading: ['Inter', 'sans-serif'],
        data: ['JetBrains Mono', 'monospace'],
        caption: ['Inter', 'sans-serif'],
      },
      fontSize: {
        'xs': ['0.75rem', { lineHeight: '1rem' }],
        'sm': ['0.875rem', { lineHeight: '1.25rem' }],
        'base': ['1rem', { lineHeight: '1.5rem' }],
        'lg': ['1.125rem', { lineHeight: '1.75rem' }],
        'xl': ['1.25rem', { lineHeight: '1.75rem' }],
        '2xl': ['1.5rem', { lineHeight: '2rem' }],
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
        '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
      },
      boxShadow: {
        'soft': '0 1px 3px rgba(0, 0, 0, 0.06), 0 4px 12px rgba(0, 0, 0, 0.04)',
        'medium': '0 2px 6px rgba(0, 0, 0, 0.08), 0 8px 24px rgba(0, 0, 0, 0.06)',
        'prominent': '0 4px 12px rgba(0, 0, 0, 0.1), 0 16px 48px rgba(0, 0, 0, 0.08)',
      },
      backdropBlur: {
        'glass': '10px',
      },
      transitionTimingFunction: {
        'smooth': 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
      transitionDuration: {
        '150': '150ms',
        '200': '200ms',
        '300': '300ms',
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "fade-in": {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        "slide-in": {
          from: { transform: "translateY(-10px)", opacity: "0" },
          to: { transform: "translateY(0)", opacity: "1" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-in": "fade-in 0.2s ease-out",
        "slide-in": "slide-in 0.3s ease-out",
      },
    },
  },
  plugins: [
    require("tailwindcss-animate"),
  ],
}