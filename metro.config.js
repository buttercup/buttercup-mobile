/**
 * Metro configuration for React Native
 * https://github.com/facebook/react-native
 *
 * @format
 */

module.exports = {
    transformer: {
        getTransformOptions: async () => ({
            transform: {
                experimentalImportSupport: false,
                inlineRequires: true
            }
        })
    },
    resolver: {
        extraNodeModules: {
            crypto: require.resolve("crypto-browserify"),
            path: require.resolve("path-browserify"),
            stream: require.resolve("stream-browserify")
        },
        sourceExts: ["jsx", "js", "ts", "tsx"]
    }
};
