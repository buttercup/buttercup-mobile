module.exports = {
    presets: [],
    plugins: ["jsx-control-statements"],
    env: {
        development: {
            presets: ["metro-react-native-babel-preset"]
        },
        production: {
            presets: ["metro-react-native-babel-preset"]
        },
        test: {
            presets: ["react-native"]
        }
    }
};
