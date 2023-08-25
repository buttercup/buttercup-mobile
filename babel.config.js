module.exports = {
    presets: ["module:metro-react-native-babel-preset"],
    plugins: [
        [
            "module-resolver",
            {
                alias: {
                    // buttercup: "buttercup/web"
                },
                extensions: [".tsx", ".ts", ".js", ".jsx", ".json"]
            },
            "react-native-reanimated/plugin" // keep last
        ]
    ]
};
