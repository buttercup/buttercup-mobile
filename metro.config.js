const { getDefaultConfig, mergeConfig } = require("@react-native/metro-config");

/**
 * Metro configuration
 * https://facebook.github.io/metro/docs/configuration
 *
 * @type {import("metro-config").MetroConfig}
 */

// const config = {};
const defaultConfig = getDefaultConfig(__dirname);
const {
    resolver: { assetExts }
} = defaultConfig;

module.exports = mergeConfig(defaultConfig, {
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
        // alias: {
        //     webdav: require.resolve("webdav/dist/node/index.js")
        // },
        assetExts: assetExts.filter(ext => ext !== "svg"),
        extraNodeModules: {
            crypto: require.resolve("crypto-browserify"),
            path: require.resolve("path-browserify"),
            stream: require.resolve("stream-browserify")
        },
        sourceExts: ["jsx", "js", "ts", "tsx", "svg", "cjs", "json"]
    }
});
