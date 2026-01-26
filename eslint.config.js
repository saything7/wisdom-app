import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import pluginReact from "eslint-plugin-react";

export default tseslint.config(
    {
        ignores: ["**/dist/**", "**/node_modules/**", "**/build/**"]
    },

    // Базовые правила
    js.configs.recommended,

    // TypeScript правила
    ...tseslint.configs.recommended,

    // React правила С НАСТРОЙКАМИ
    {
        ...pluginReact.configs.flat.recommended,
        settings: {
            react: {
                version: "detect" // или "18.3.1"
            }
        }
    },

    // Клиент (браузер)
    {
        files: ["client/**/*.{js,ts,jsx,tsx}"],
        languageOptions: {
            globals: globals.browser
        },
        rules: {
            "react/no-unescaped-entities": "off",
            "@typescript-eslint/no-explicit-any": "off"
        }
    },

    // Сервер (Node.js)
    {
        files: ["server/**/*.{js,ts}"],
        languageOptions: {
            globals: globals.node
        },
        rules: {
            "@typescript-eslint/no-unused-vars": ["error", {
                "argsIgnorePattern": "^_",
                "varsIgnorePattern": "^_"
            }]
        }
    },

    // Конфигурационные файлы
    {
        files: ["**/*.config.*", "**/webpack.*"],
        rules: {
            "@typescript-eslint/no-require-imports": "off",
            "@typescript-eslint/no-explicit-any": "off"
        }
    }
);