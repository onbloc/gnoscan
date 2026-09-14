import tsPlugin from "@typescript-eslint/eslint-plugin";
import nextConfig from "eslint-config-next";
import globals from "globals";

export default [
  ...nextConfig,
  {
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      globals: {
        ...globals.jest,
      },
    },
    rules: {
      ...tsPlugin.configs.recommended.rules,
      "linebreak-style": ["error", "unix"],
      quotes: ["error", "double"],
      semi: ["error", "always"],
      "array-element-newline": [
        "warn",
        {
          ArrayExpression: "consistent",
          ArrayPattern: { multiline: true },
        },
      ],
      "@typescript-eslint/no-explicit-any": "error",
      "@typescript-eslint/no-unused-vars": "warn",
      "@typescript-eslint/no-empty-function": "warn",
      "@typescript-eslint/no-empty-interface": "warn",
      // Codebase relies on `cond && fn()` as a statement; default disallows it.
      "@typescript-eslint/no-unused-expressions": ["warn", { allowShortCircuit: true, allowTernary: true }],
      // Successors to the old (removed) `ban-types` rule, which this repo had off.
      "@typescript-eslint/no-unsafe-function-type": "off",
      "@typescript-eslint/no-wrapper-object-types": "off",
      "@typescript-eslint/no-empty-object-type": "off",
      // React Compiler rules new in eslint-plugin-react-hooks v7 (via eslint-config-next
      // 16) - codebase predates them, so warn instead of blocking every commit.
      "react-hooks/static-components": "warn",
      "react-hooks/use-memo": "warn",
      "react-hooks/preserve-manual-memoization": "warn",
      "react-hooks/immutability": "warn",
      "react-hooks/globals": "warn",
      "react-hooks/refs": "warn",
      "react-hooks/set-state-in-effect": "warn",
      "react-hooks/error-boundaries": "warn",
      "react-hooks/purity": "warn",
      "react-hooks/set-state-in-render": "warn",
      "react-hooks/config": "warn",
      "react-hooks/gating": "warn",
    },
  },
];
