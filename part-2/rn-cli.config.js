module.exports = {
  getProjectRoots() {
    return [__dirname, `${__dirname}/node_modules/wix-one-app-engine`];
  },
  getSourceExts: () => process.env.RN_SOURCE_EXTENSIONS ? process.env.RN_SOURCE_EXTENSIONS.split(',') : []
};
