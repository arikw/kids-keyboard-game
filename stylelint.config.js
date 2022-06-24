module.exports = {
  extends: [
    'stylelint-config-standard',
    'stylelint-config-standard-scss',
    'stylelint-config-recommended-vue/scss'
  ],
  // add your custom config here
  // https://stylelint.io/user-guide/configuration
  rules: {
    'selector-pseudo-element-no-unknown': [
      true,
      {
        ignorePseudoElements: ['v-deep']
      }
    ],

    // migratiion to stylelint v14:
    // these rules are temporary disabled until errors are fixed
    'no-empty-first-line': null,
    'string-quotes': null,
    'alpha-value-notation': null,
    'color-function-notation': null,
    'selector-class-pattern': null,
    'font-family-name-quotes': null,
    'keyframes-name-pattern': null,
    'shorthand-property-no-redundant-values': null,
    'declaration-block-no-redundant-longhand-properties': null,
    'max-line-length': null,
    'scss/double-slash-comment-empty-line-before': null,
    'scss/at-import-partial-extension': null,
    'scss/no-global-function-names': null,
    'scss/at-import-no-partial-leading-underscore': null
  },
  ignoreFiles: [
    '**/node_modules/**/*',
    'assets/fonts/*'
  ]
};
