module.exports = {
  webpack: {
    configure: (webpackConfig, { env }) => {
      const scopePluginIndex = webpackConfig.resolve.plugins.findIndex(
        ({ constructor }) =>
          constructor && constructor.name === "ModuleScopePlugin"
      );

      webpackConfig.resolve.plugins.splice(scopePluginIndex, 1);

      webpackConfig.module = {
        rules: [
          {
            test: /\.(jsx?|tsx?|css)$/,
            exclude: /node_modules/,
            use: [
              {
                loader: "esbuild-loader",
                options:
                  env === "development"
                    ? {
                        loader: "tsx",
                        target: "es2015",
                      }
                    : {
                        loader: "tsx",
                      },
              },
            ],
          },
          {
            test: /\.css$/,
            use: ["style-loader", "css-loader"],
          },
          {
            test: /\.(png|jpe?g|gif|svg)$/i,
            use: [
              {
                loader: "file-loader",
              },
            ],
          },
        ],
      };

      return webpackConfig;
    },
  },
};
