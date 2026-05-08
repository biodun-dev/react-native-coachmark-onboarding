const { FlatCompat } = require("@eslint/eslintrc");
const js = require("@eslint/js");

const compat = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: js.configs.recommended,
});

module.exports = [
    ...compat.extends("eslint-config-universe/native"),
    ...compat.extends("eslint-config-universe/web"),
    {
        ignores: ["build/**", "example/**", "node_modules/**"],
    },
    {
        files: ["**/*.{js,jsx,ts,tsx}"],
        rules: {
            // Add custom rules here if needed
        },
        settings: {
            react: {
                version: "detect",
            },
        },
    },
];
