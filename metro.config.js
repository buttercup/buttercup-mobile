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
        assetExts: assetExts.filter(ext => ext !== "svg"),
        extraNodeModules: {
            crypto: require.resolve("crypto-browserify"),
            path: require.resolve("path-browserify"),
            stream: require.resolve("stream-browserify")
        },
        // resolveRequest: (context, moduleName, platform) => {
        //     if (/react-obstate/.test(moduleName)) {
        //         console.log("CHECK", moduleName, context);
        //     }
        //     return context.resolveRequest(context, moduleName, platform);
        // },
        sourceExts: ["jsx", "js", "ts", "tsx", "svg", "cjs", "json"]
    }
});
