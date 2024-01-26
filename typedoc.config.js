/** @type {import('typedoc').TypeDocOptions} */
module.exports = {
    plugin: [
        "typedoc-plugin-missing-exports",
        "typedoc-plugin-mdn-links",
        "typedoc-plugin-rename-defaults",
    ],
    entryPoints: ["./src/index.ts"],
    out: "docs",
    lightHighlightTheme: "material-theme-darker",
    darkHighlightTheme: "material-theme-darker",
};