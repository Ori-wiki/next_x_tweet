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
              group: ["@/src/entities/tweet/model/selectors"],
              message: "Use the public API: @/src/entities/tweet.",
            },
            {
              group: ["@/src/features/create-tweet/ui/*"],
              message: "Use the public API: @/src/features/create-tweet.",
            },
            {
              group: ["@/src/widgets/header/ui/*"],
              message: "Use the public API: @/src/widgets/header.",
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
