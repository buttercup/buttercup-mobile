/**
 * Metro configuration for React Native
 * https://github.com/facebook/react-native
 *
 * @format
 */

 const { getDefaultConfig } = require("metro-config");

module.exports = (async () => {
    const {
        resolver: { assetExts }
    } = await getDefaultConfig();
    return {
        transformer: {
            babelTransformerPath: require.resolve("react-native-svg-transformer"),
            getTransformOptions: async () => ({
                transform: {
                    experimentalImportSupport: false,
                    inlineRequires: true
                }
            })
        },
        resolver: {
            assetExts: assetExts.filter(ext => ext !== "svg"),
            extraNodeModules: {
                crypto: require.resolve("crypto-browserify"),
                path: require.resolve("path-browserify"),
                stream: require.resolve("stream-browserify")
            },
            sourceExts: ["jsx", "js", "ts", "tsx", "svg"]
        }
    };
})();
