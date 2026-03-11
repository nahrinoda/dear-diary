const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");

function initCanisterEnv() {
  let localCanisters, prodCanisters;
  try {
    localCanisters = require(path.resolve(
      ".dfx",
      "local",
      "canister_ids.json"
    ));
  } catch (error) {
    console.log("No local canister_ids.json found. Continuing production");
  }
  try {
    prodCanisters = require(path.resolve("canister_ids.json"));
  } catch (error) {
    console.log("No production canister_ids.json found. Continuing with local");
  }

  const network =
    process.env.DFX_NETWORK ||
    (process.env.NODE_ENV === "production" ? "ic" : "local");

  const canisterConfig = network === "local" ? localCanisters : prodCanisters;

  // Seed from process.env so Vercel / CI env vars work without canister_ids.json
  const envVars = Object.keys(process.env)
    .filter((k) => k.startsWith("CANISTER_ID_"))
    .reduce((acc, k) => ({ ...acc, [k]: process.env[k] }), {});

  if (!canisterConfig) return envVars;

  const fileVars = Object.entries(canisterConfig).reduce((prev, current) => {
    const [canisterName, canisterDetails] = current;
    prev["CANISTER_ID_" + canisterName.toUpperCase()] =
      canisterDetails[network];
    return prev;
  }, {});

  // File takes precedence over env, but env fills gaps (e.g. no canister_ids.json)
  return { ...envVars, ...fileVars };
}
const canisterEnvVariables = initCanisterEnv();

const isDevelopment = process.env.NODE_ENV !== "production";

const frontendDirectory = "deardiary_assets";

const asset_entry = path.join("src", frontendDirectory, "src", "index.html");

module.exports = {
  target: "web",
  mode: isDevelopment ? "development" : "production",
  entry: {
    index: path.join(__dirname, asset_entry).replace(/\.html$/, ".jsx"),
  },
  devtool: isDevelopment ? "source-map" : false,
  optimization: {
    minimize: !isDevelopment,
    minimizer: [new TerserPlugin()],
  },
  resolve: {
    extensions: [".js", ".ts", ".jsx", ".tsx"],
    alias: {
      "react/jsx-runtime": require.resolve("react/jsx-runtime"),
    },
    fallback: {
      assert: require.resolve("assert/"),
      buffer: require.resolve("buffer/"),
      events: require.resolve("events/"),
      stream: require.resolve("stream-browserify/"),
      util: require.resolve("util/"),
    },
  },
  output: {
    filename: "index.js",
    path: path.join(__dirname, "dist", frontendDirectory),
    // publicPath controls how asset URLs are emitted in the HTML.
    // Set PUBLIC_PATH env var to an absolute URL (e.g. https://dear-diary-eight-ochre.vercel.app/)
    // when the app is proxied via navox.tech/dear-diary so assets bypass the proxy.
    // Defaults to "auto" (relative paths) for local dev and standalone Vercel deployments.
    publicPath: process.env.PUBLIC_PATH || "auto",
    // Always clean dist before building so stale production-copied files
    // don't conflict with DFX's asset serving in local dev.
    clean: true,
  },
  module: {
    rules: [
      { test: /\.(ts|tsx|jsx)$/, loader: "ts-loader" },
      { test: /\.css$/, use: ['style-loader', 'css-loader'] },
      {
        test: /\.(jpe?g|png|gif|svg)$/i,
        type: "asset",
      },
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.join(__dirname, asset_entry),
      cache: false,
    }),
    // CopyPlugin removed — DFX serves assets directly from src/deardiary_assets/assets
    new webpack.EnvironmentPlugin({
      NODE_ENV: "development",
      DFX_NETWORK: "local",
      // PUBLIC_BASENAME controls React Router's base path.
      // Set to "/dear-diary" when serving from navox.tech/dear-diary.
      // Defaults to "/" for local dev and standalone deployments.
      PUBLIC_BASENAME: "/",
      ...canisterEnvVariables,
    }),
    // In production (Vercel), copy static assets so dist/ is self-contained.
    // DFX serves these directly from src/deardiary_assets/assets/ in local dev.
    ...(!isDevelopment ? [new CopyPlugin({
      patterns: [{ from: "src/deardiary_assets/assets", to: "." }],
    })] : []),
    new webpack.ProvidePlugin({
      Buffer: [require.resolve("buffer/"), "Buffer"],
      process: require.resolve("process/browser"),
    }),
  ],
  devServer: {
    proxy: {
      "/api": {
        target: "http://localhost:8000",
        changeOrigin: true,
        pathRewrite: {
          "^/api": "/api",
        },
      },
    },
    hot: true,
    watchFiles: [path.resolve(__dirname, "src", frontendDirectory)],
    liveReload: true,
    historyApiFallback: true
  },
};
