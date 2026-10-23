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
      // i18n instrumentation (RHCLOUD-52237): flags user-facing literal strings
      // so they get wrapped with defineMessages before translation.
      // mode 'jsx-only' = JSX text children + JSX attributes.
      // ERROR — cleared by the wrap in this same PR; from now on new user-facing
      // strings must land wrapped.
      files: ['src/**/*.tsx', 'src/**/*.ts'],
      excludedFiles: ['**/*.test.*', '**/*.stories.*', 'test/**', 'cypress/**'],
      plugins: ['i18next'],
      rules: {
        'i18next/no-literal-string': [
          'error',
          {
            mode: 'jsx-only',
            words: {
              exclude: [
                // PatternFly flex/layout modifier enums
                /^alignItems[A-Z]/, /^alignContent[A-Z]/, /^spaceItems[A-Z]/, /^justifyContent[A-Z]/,
                /^flexWrap[A-Z]/, /^inset[A-Z]/, /^spacer[A-Z]/, /^gap[A-Z]/,
                /^flex_[0-9]+$/, /^flexDefault$/, /^flexNone$/,
                /^grow$/, /^shrink$/, /^noPadding$/, /^nowrap$/, /^compact$/, /^fitContent$/,
                /^alignSelf[A-Z]/,
                // CSS values
                /^100%$/, /^calc\(/, /^var\(/, /^\d+px$/, /^off$/,
                // PatternFly positional/interaction enums
                /^right$/, /^left$/, /^center$/, /^top$/, /^bottom$/,
                /^hover$/, /^click$/, /^single$/, /^multiple$/,
                // PatternFly status/severity/color enums
                /^danger$/, /^success$/, /^warning$/, /^info$/, /^default$/, /^error$/,
                /^outline$/, /^filled$/,
                /^purple$/, /^red$/, /^grey$/, /^gray$/, /^green$/, /^blue$/, /^orange$/, /^cyan$/, /^teal$/,
                // Provider identifiers
                /^openshift$/, /^aws$/, /^azure$/, /^google$/,
                // HTML attribute values
                /^_blank$/, /^noopener\snoreferrer$/,
                // Workflow state enums
                /^pending$/, /^approved$/, /^denied$/, /^create$/, /^edit$/, /^cancel$/,
                // Structural
                /^,\s$/, /^:\s$/, /^a$/, /^#$/, /^2xl$/, /^wrap$/, /^inset2xl$/,
                /^loading$/, /^vertical$/, /^empty$/, /^expanded$/, /^collapsed$/,
                /^selected$/, /^not selected$/, /^none$/, /^polite$/,
                /^Non expandable row$/, /^composable-expandable-example$/,
              ],
            },
            'jsx-attributes': {
              include: [],
              exclude: [
                'className', 'styleName', 'style', 'type', 'key', 'id', 'width', 'height',
                'name', 'href', 'to', 'path', 'target', 'variant', 'component', 'form',
                'fieldId', 'filterId', 'widgetId', 'ouiaId', 'data-testid', 'testId',
                'autoFocus', 'headingLevel', 'size', 'sx', 'direction', 'position',
                'align', 'icon', 'variantPrefix', 'isCompact', 'ouiaId.*',
                'locale', 'defaultLocale', 'aria-describedby', 'aria-labelledby',
                'titleIconVariant', 'iconVariant', 'placeholder',
                'eventKey', 'labelId', 'serviceName', 'toLandingPageUrl', 'buttonLink',
                'sortableColumns', 'triggerAction', 'iconPosition', 'color', 'status',
                'validated', 'rel', 'role', 'popperProps', 'appendTo',
                'dataLabel', 'expandId', 'titleId', 'apiPath', 'data-ouia-component-id', 'wrapModifier',
                'data-ouia-component-type', 'aria-controls', 'autoComplete', 'breakpoint',
              ],
            },
            callees: {
              exclude: ['getOuiaProps'],
            },
          },
        ],
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
    // Playwright uses page.getBy* — not React Testing Library; RTL rules false-positive here
    {
      files: ['playwright/**/*.ts'],
      rules: {
        'testing-library/prefer-screen-queries': 'off',
      },
    },
  ],
  rules: {
    'react-hooks/exhaustive-deps': 'error',
    'sort-imports': [
      'error',
      {
        ignoreDeclarationSort: true,
      },
    ],
  },
};
