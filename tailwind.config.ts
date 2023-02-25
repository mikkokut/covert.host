import { Config } from 'tailwindcss';

export default <Config> {
  content: [
    './app.vue',
    './layouts/**/*.vue',
    './pages/**/*.vue',
    './components/**/*.vue',
  ],
  // prefix: 'tw-',
  theme: {
    extend: {},
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
  ],
}
