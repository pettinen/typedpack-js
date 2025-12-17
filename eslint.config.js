import js from "@eslint/js";
import { defineConfig, globalIgnores } from "eslint/config";
import ts from "typescript-eslint";

export default defineConfig(
    globalIgnores(["build/", "dist/"]),
    js.configs.recommended,
    ts.configs.recommended,
);
