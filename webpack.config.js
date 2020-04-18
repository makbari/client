// webpack config is from https://github.com/vladilenm/webpack-2020
const path = require("path");
const HTMLWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const OptimizeCssAssetWebpackPlugin = require("optimize-css-assets-webpack-plugin");
const TerserWebpackPlugin = require("terser-webpack-plugin");
const { BundleAnalyzerPlugin } = require("webpack-bundle-analyzer");
const webpack = require("webpack");
const isDev = process.env.NODE_ENV === "development";
const isProd = !isDev;

function filename(ext) {
  return (isDev ? `[name].${ext}` : `[name].[hash].${ext}`);
}

const optimization = () => {
  const config = {
    splitChunks: {
      chunks: 'all'
    }
  };

  if (isProd) {
    config.minimizer = [
      new OptimizeCssAssetWebpackPlugin(),
      new TerserWebpackPlugin()
    ]
  }

  return config
};

const cssLoaders = extra => {
  const loaders = [
    {
      loader: MiniCssExtractPlugin.loader,
      options: {
        hmr: isDev,
        reloadAll: true
      }
    },
    "css-loader"
  ];

  if (extra) {
    loaders.push(extra);
  }

  return loaders;
};
const plugins = () => {
  const base = [
    new HTMLWebpackPlugin({
      template: "./index.html",
      minify: {
        collapseWhitespace: isProd
      }
    }),
    new CleanWebpackPlugin(),
    new CopyWebpackPlugin([
      {
        from: path.resolve(__dirname, "src/favicon.ico"),
        to: path.resolve(__dirname, "dist")
      }
    ]),
    new MiniCssExtractPlugin({
      filename: filename("css")
    }),

    new webpack.DefinePlugin({
      __DEV__: isDev
    })
  ];

  if (isProd) {
    base.push(new BundleAnalyzerPlugin({
      analyzerMode: 'static',
      reportFilename: '../report/bundleSize.html',
      openAnalyzer: false
    }));
  }

  return base;
};
module.exports = {
  context: path.resolve(__dirname, "src"),
  entry: "./index.ts",
  output: {
    filename: filename("js"),
    path: path.join(__dirname, "dist")
  },
  mode: "development",

  optimization: optimization(),
  devServer: {
    contentBase: path.resolve(__dirname, "public"),
    liveReload: true,
    port: 3000,
    historyApiFallback: true,
    writeToDisk: true,
    hot: true
  },
  devtool: isDev ? "source-map" : "",
  plugins: plugins(),
  module: {
    rules: [
      {
        enforce: "pre",
        test: /\.ts|\.tsx$/,
        use: ["babel-loader", "ts-loader"],
        exclude: /node_modules/
      },
      {
        test: /\.css$/,
        use: cssLoaders()
      },
      {
        test: /\.less$/,
        use: cssLoaders("less-loader")
      },
      {
        test: /\.s[ac]ss$/,
        use: cssLoaders("sass-loader")
      },
      {
        test: /\.(png|jpg|svg|gif)$/,
        use: ["file-loader"]
      },
      {
        test: /\.(ttf|woff|woff2|eot)$/,
        use: ["file-loader"]
      }
    ]
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"]
  }
};
