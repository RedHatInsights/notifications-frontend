module.exports = {
  extends: [
    '@redhat-cloud-services/eslint-config-redhat-cloud-services',
    'plugin:@typescript-eslint/recommended',
    'plugin:jest/recommended',
    'plugin:jest-dom/recommended',
    'plugin:react-hooks/recommended',
    'plugin:testing-library/react',
  ],
  globals: {
    insights: 'readonly',
    shallow: 'readonly',
    render: 'readonly',
    mount: 'readonly',
  },
  overrides: [
    {
      files: ['src/**/*.ts', 'src/**/*.tsx'],
      parser: '@typescript-eslint/parser',
      plugins: ['@typescript-eslint'],
      extends: ['plugin:@typescript-eslint/recommended'],
      rules: {
        'react/prop-types': 'off',
      },
    },
    {
      files: ['cypress/**/*.ts', 'cypress/**/*.tsx'],
      parser: '@typescript-eslint/parser',
      plugins: ['jest'],
      rules: {
        'jest/expect-expect': 'off',
      },
    },
  ],
  rules: {
    'sort-imports': [
      'error',
      {
        ignoreDeclarationSort: true,
      },
    ],
  },
};
