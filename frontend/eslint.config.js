import js from "@eslint/js";
import eslintConfigPrettier from "eslint-config-prettier";
import tseslint from "typescript-eslint";
import onlyWarn from "eslint-plugin-only-warn";
import reactPlugin from "eslint-plugin-react";
import reactHooksPlugin from "eslint-plugin-react-hooks";
import importPlugin from "eslint-plugin-import";
import jsxA11yPlugin from "eslint-plugin-jsx-a11y";
import eslintPluginPrettier from "eslint-plugin-prettier";

export default defineConfig(
  js.configs.recommended,
  eslintConfigPrettier,
  ...tseslint.configs.recommended,

  // Плагины
  {
    plugins: {
      react: reactPlugin,
      "react-hooks": reactHooksPlugin,
      import: importPlugin,
      "jsx-a11y": jsxA11yPlugin,
      "only-warn": onlyWarn,
      prettier: eslintPluginPrettier,
    },
  },

  // Общие настройки
  {
    ignores: ["dist/**", "**/*.d.ts", "**/*.test.*", "**/*.spec.*"],
  },
  {
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        project: true,
        warnOnUnsupportedTypeScriptVersion: false,
      },
      globals: {
        ApplePaySession: true,
        google: true,
      },
      ecmaVersion: 2022,
    },
    linterOptions: {
      reportUnusedDisableDirectives: true,
    },
    settings: {
      react: {
        pragma: "React",
        version: "detect",
      },
      "import/resolver": {
        typescript: {
          alwaysTryTypes: true,
        },
      },
    },

    // Правила
    rules: {
      // Основные правила
      semi: ["error", "never"],
      curly: "error",
      "no-unreachable": "error",
      "no-void": "off",
      "no-bitwise": "off",
      "no-plusplus": "off",
      "consistent-return": "off",
      "no-param-reassign": "off",
      "newline-after-var": ["error", "always"],
      "newline-before-return": "error",
      "arrow-body-style": ["error", "as-needed"],

      // Импорты
      "import/prefer-default-export": "off",
      "import/no-unresolved": "off",
      "import/extensions": "off",
      "import/no-extraneous-dependencies": "off",
      "import/order": [
        "warn",
        {
          "newlines-between": "always",
          pathGroups: [
            { pattern: "@public/**", group: "external", position: "after" },
            { pattern: "@views/**", group: "internal", position: "after" },
            { pattern: "@widgets/**", group: "internal", position: "after" },
          ],
          pathGroupsExcludedImportTypes: [],
          groups: [
            "builtin",
            ["external", "type"],
            "unknown",
            ["internal", "sibling", "parent"],
            "index",
            "object",
          ],
        },
      ],

      // React
      "react/prop-types": "off",
      "react/require-default-props": "off",
      "react/static-property-placement": "off",
      "react/destructuring-assignment": [
        "error",
        "always",
        { ignoreClassFields: true },
      ],
      "react/jsx-props-no-spreading": "off",
      "react/jsx-sort-props": [
        "error",
        { shorthandFirst: true, noSortAlphabetically: true },
      ],
      "react/jsx-no-useless-fragment": ["error", { allowExpressions: true }],
      "react/no-unstable-nested-components": ["error", { allowAsProps: true }],
      "react/no-array-index-key": "off",
      "react/function-component-definition": [
        "error",
        {
          namedComponents: "arrow-function",
          unnamedComponents: "arrow-function",
        },
      ], // React Hooks
      "react-hooks/exhaustive-deps": "off",
      "react-hooks/rules-of-hooks": "error",

      // Доступность
      "jsx-a11y/click-events-have-key-events": "off",
      "jsx-a11y/no-static-element-interactions": "off",

      // TypeScript
      "@typescript-eslint/no-shadow": "off",
      "@typescript-eslint/explicit-module-boundary-types": "off",
      "@typescript-eslint/no-floating-promises": "off",
      "@typescript-eslint/no-unsafe-member-access": "off",
      "@typescript-eslint/no-unsafe-assignment": "off",
      "@typescript-eslint/no-unsafe-call": "off",
      "@typescript-eslint/restrict-template-expressions": "off",
      "@typescript-eslint/no-unsafe-return": "off",
      "@typescript-eslint/no-use-before-define": "off",
      "@typescript-eslint/naming-convention": "off",
      "@typescript-eslint/no-misused-promises": [
        "error",
        { checksVoidReturn: false },
      ],
      "@typescript-eslint/no-unsafe-argument": "error",
      "@typescript-eslint/semi": "off",
      "comma-dangle": [
        "error",
        {
          arrays: "always-multiline",
          objects: "always-multiline",
          imports: "only-multiline",
          exports: "only-multiline",
          functions: "never",
        },
      ],

      "prettier/prettier": [
        "error",
        {
          printWidth: 100,
          tabWidth: 2,
          useTabs: false,
          semi: false,
          singleQuote: true,
          bracketSpacing: true,
          jsxBracketSameLine: false,
          arrowParens: "avoid",
          endOfLine: "lf",
          trailingComma: "es5",
          "comma-dangle": ["error", "never"],
        },
      ],
    },
  },
  {
    languageOptions: {
      parserOptions: {
        project: "./tsconfig.json",
        tsConfigRootDir: new URL(".", import.meta.url).pathname,
      },
    },
  },
);
