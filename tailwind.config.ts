import type { Config } from 'tailwindcss'
import colors from 'tailwindcss/colors'
import Theme from 'tailwindcss/defaultTheme'

const config = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
	],
  prefix: "",
  theme: {
    extend: {
      colors: {
        primary: colors.zinc,
        alert: colors.red
      },
      borderRadius: {
        primary: Theme.borderRadius.xl
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config

export default config