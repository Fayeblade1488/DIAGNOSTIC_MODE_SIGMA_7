// @ts-check

import eslint from "@eslint/js";
import tseslint from "typescript-eslint/dist/index.js";

export default tseslint.config({
  files: ["**/*.ts"],
  extends: [eslint.configs.recommended, ...tseslint.configs.recommended],
  languageOptions: {
    parserOptions: {
      project: "./tsconfig.json",
    },
  },
});
