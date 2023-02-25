process.env.ESLINT_TSCONFIG = 'tsconfig.json'

module.exports = {
  extends: [
    '@antfu',
    'plugin:tailwindcss/recommended',
  ],
  plugins: [
    'only-warn',
  ]
}
