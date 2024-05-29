module.exports = {
  root: true,
  extends: '@react-native',
  plugins: ['import'],
  rules: {
    'react-native/no-inline-styles': 0,
    'import/no-unused-modules': [1, {unusedExports: true}],
    'import/no-unresolved': 'error',
  },
};
