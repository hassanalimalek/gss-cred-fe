import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    rules: {
      // Enable rules to catch potential issues
      "@typescript-eslint/no-explicit-any": "warn", // Warn about 'any' usage but don't break the build
      "@typescript-eslint/no-unused-vars": ["warn", { "argsIgnorePattern": "^_" }], // Warn about unused variables

      // Keep these rules disabled for compatibility
      "react/no-unescaped-entities": "off", // Allow apostrophes in text
      "@typescript-eslint/ban-ts-comment": "off" // Allow TS comments for edge cases
    }
  }
];

export default eslintConfig;
