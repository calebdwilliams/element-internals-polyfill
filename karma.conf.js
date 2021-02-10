const { createDefaultConfig } = require('@open-wc/testing-karma');
const merge = require('deepmerge');

module.exports = config => {
  config.set(
    merge(createDefaultConfig(config), {
      files: [
        // runs all files ending with .test in the test folder,
        // can be overwritten by passing a --grep flag. examples:
        //
        // npm run test -- --grep test/foo/bar.test.js
        // npm run test -- --grep test/bar/*
        { pattern: config.grep ? config.grep : 'test/*.test.js', type: 'module' },
      ],

      // see the karma-esm docs for all options
      esm: {
        // if you are using 'bare module imports' you will need this option
        nodeResolve: true,
      },

      frameworks: [...config.frameworks, 'detectBrowsers'],

      detectBrowsers: {
        enabled: config.detectBrowsers,
        usePhantomJS: false,
        preferHeadless: true,
        postDetection(availableBrowsers) {
          console.log(availableBrowsers)
          return availableBrowsers.filter(browser => !['ChromeCanaryHeadless', 'SafariTechPreview'].includes(browser));
        }
      },

      customLaunchers: {
        Safari: {
          base: 'SafariNative',
        },
      },

      browserNoActivityTimeout: 60000, //default 10000
      browserDisconnectTimeout: 10000, // default 2000
      browserDisconnectTolerance: 1, // default 0
      captureTimeout: 60000,
    }),
  );
  return config;
};
