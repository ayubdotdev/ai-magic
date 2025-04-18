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

  // Custom rules
  {
    files: ["**/*.ts", "**/*.tsx"],
    rules: {
      // Disable or modify this rule
      "react/no-unescaped-entities": "off", // or "warn" if you want it soft
    },
  },
];

export default eslintConfig;
