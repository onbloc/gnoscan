module.exports = {
  env: {
    browser: true,
    es6: true,
    node: true
  },
  overrides: [],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaFeatures: {
      jsx: true
    },
    ecmaVersion: 12,
    sourceType: "module"
  },
  plugins: ["react", "@typescript-eslint"],
  rules: {
    indent: ["error", 2, {
      SwitchCase: 1
    }],
    quotes: ["error", "single", {
      avoidEscape: true
    }],
    semi: ["error", "always"],
    "linebreak-style": 0
  },
  settings: {
    react: {
      version: "detect"
    }
  },
  extends: ["plugin:storybook/recommended"]
};