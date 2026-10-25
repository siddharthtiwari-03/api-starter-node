// eslint.config.js
import js from "@eslint/js"
import globals from "globals"
import { defineConfig } from "eslint/config"

export default defineConfig([
  // 1. Load the recommended configuration globally for all JS variations
  js.configs.recommended,

  // 2. Configure language settings, scope, and global variables
  {
    files: ["**/*.{js,mjs,cjs}"],
    languageOptions: {
      sourceType: "module", // Safe default for Node.js CommonJS setups
      globals: {
        ...globals.node, // Securely loads all Node.js global variables
      },
    },
    // 3. Define project-wide custom rule configurations
    rules: {
      "no-unused-vars": ["error", { argsIgnorePattern: "^_", varsIgnorePattern: "^_", ignoreRestSiblings: true }],  // Disables the rule completely as requested
    },
  },
])
