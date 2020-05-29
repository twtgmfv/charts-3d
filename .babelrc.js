module.exports = {
  presets: [
    [
      '@babel/env',
      {
        modules: false,
        loose: true,
        // targets: {
        //   browsers: '> 1%, IE 11, not op_mini all, not dead',
        //   node: 8
        // },
        useBuiltIns: 'usage',
        corejs: 3
      }
    ]
  ],
  plugins: ['@babel/plugin-external-helpers']
};
