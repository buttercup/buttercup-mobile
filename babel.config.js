module.exports = {
    presets: ["module:metro-react-native-babel-preset"],
    plugins: [
        [
            "module-resolver",
            {
                alias: {
                    buttercup: process.env.NODE_ENV === "test"
                        ? "buttercup"
                        : "buttercup/web"
                }
            }
        ]
    ]
};
