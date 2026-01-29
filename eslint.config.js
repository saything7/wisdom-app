import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import pluginReact from "eslint-plugin-react";

export default tseslint.config(
    { ignores: ["**/dist/**", "**/node_modules/**", "**/build/**", "**/coverage/**"] },
    js.configs.recommended,
    ...tseslint.configs.recommended,
    {
        ...pluginReact.configs.flat.recommended,
        settings: { react: { version: "detect" } }
    },
    {
        rules: {
            "@typescript-eslint/no-explicit-any": "warn",
            "no-console": ["warn", { allow: ["warn", "error"] }],
            "react/react-in-jsx-scope": "off",
            "react/display-name": "off",
        }
    },
    {
        files: ["**/*.spec.{js,ts,jsx,tsx}", "**/*.test.{js,ts,jsx,tsx}"],
        rules: {
            "@typescript-eslint/no-explicit-any": "off",
            "@typescript-eslint/no-unused-vars": "off",
            "@typescript-eslint/no-require-imports": "off",
            "no-console": "off",
        }
    },
    {
        files: ["client/**/*"],
        languageOptions: { globals: { ...globals.browser, ...globals.jest } }
    },
    {
        files: ["server/**/*"],
        languageOptions: { globals: { ...globals.node, ...globals.jest } }
    },
    {
        files: ["**/webpack.*", "**/*.config.*"],
        rules: {
            "@typescript-eslint/no-require-imports": "off",
            "@typescript-eslint/no-explicit-any": "off",
        }
    }

);
