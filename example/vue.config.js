const { defineConfig } = require('@vue/cli-service');
const path = require('path');

module.exports = defineConfig({
  configureWebpack: {
    resolve: {
      symlinks: false,
      alias: {
        'vue': path.resolve('./node_modules/vue'),
      },
    },
    module: {
      rules: [
        {
          test: /\.less$/,
          use: [{
            loader: 'less-loader',
            options: {
              lessOptions: {
                javascriptEnabled: true,
              },
            },
          }],
        },
      ],
    },
  },
  transpileDependencies: true,
});
