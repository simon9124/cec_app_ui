module.exports = {
  root: true,
  parserOptions: {
    parser: 'babel-eslint',
    sourceType: 'module'
  },
  env: {
    browser: true,
    // node: true,
    // es6: true,
  },
  // extends: ['plugin:vue/recommended', 'eslint:recommended'],
  extends: ['plugin:vue/essential'],

  // add your custom rules here
  //it is base on https://github.com/vuejs/eslint-config-vue
  rules: {
    'vue/no-parsing-error': [2, {
      "x-invalid-end-tag": false
    }],
    'semi': ["error", "always"]
  }
}
