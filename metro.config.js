// Learn more https://docs.expo.io/guides/customizing-metro
const { getDefaultConfig } = require("expo/metro-config");
const path = require("path");
const projectRoot = __dirname;

// Add aliases for file-system import based modules
const ALIASES = {
  "@noble/hashes/crypto": path.resolve(
    projectRoot, // <-- Adjust this as fits your project setup
    "node_modules/@noble/hashes/crypto.js"
  ),
};

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);
// [!code focus:9]
// The following code ensures we have the necessary
// shims for crypto built into our project
config.resolver.extraNodeModules = {
  ...config.resolver.extraNodeModules,
  ...require("node-libs-react-native"),
  crypto: require.resolve("crypto-browserify"),
  stream: require.resolve("stream-browserify"),
};

config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (ALIASES[moduleName]) {
    return {
      filePath: ALIASES[moduleName],
      type: "sourceFile",
    };
  }
  return context.resolveRequest(context, moduleName, platform);
};

// The `account-kit/react-native` and it's supoorting packages leverages package.json `exports` which is not (yet) suported by default in Metro.
// we can enable this support using:
config.resolver.unstable_enablePackageExports = true;
config.resolver.unstable_conditionNames = [
  "browser",
  "require",
  "react-native",
];

module.exports = config;
