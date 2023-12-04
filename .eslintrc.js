module.exports = {
    root: true,
    extends: ["@react-native", "plugin:prettier/recommended"],
    plugins: ["prettier"],
    rules: {
        semi: ["error", "always"],
        quotes: ["error", "double"],
        "prettier/prettier": "error",
        "react-native/no-inline-styles": "off",
        "react/no-unstable-nested-components": "off"
    }
};
