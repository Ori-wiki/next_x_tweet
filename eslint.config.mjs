import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: [
                "@/entities/*/model/*",
                "@/entities/*/ui/*",
                "@/entities/*/config/*",
              ],
              message: "Import entity slices through their public API.",
            },
            {
              group: ["@/features/*/model/*", "@/features/*/ui/*"],
              message: "Import feature slices through their public API.",
            },
            {
              group: ["@/widgets/*/model/*", "@/widgets/*/ui/*"],
              message: "Import widget slices through their public API.",
            },
            {
              group: ["@/pages/*/model/*", "@/pages/*/ui/*"],
              message: "Import page slices through their public API.",
            },
          ],
        },
      ],
    },
  },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;
