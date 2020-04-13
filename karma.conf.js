
// Karma configuration
// Generated on Mon Apr 13 2020 13:45:54 GMT-0500 (Central Daylight Time)
const {readFileSync} = require('fs');
const {resolve} = require('path');

const isCI = !!process.env.CI;
const watch = !!process.argv.find(arg => arg.includes('watch')) && !isCI;
const coverage = !!process.argv.find(arg => arg.includes('--coverage'));

const babelrc = JSON.parse(
  readFileSync(resolve(process.cwd(), '.babelrc'), 'utf8'),
);

module.exports = function(config) {
  config.set({
    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',

    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['jasmine', 'detectBrowsers'],

    // plugins
    plugins: [
      'karma-jasmine',
      'karma-chrome-launcher',
      'karma-edge-launcher',
      'karma-firefox-launcher',
      'karma-ie-launcher',
      'karma-safarinative-launcher',
      'karma-detect-browsers',
      'karma-rollup-preprocessor'
    ],

    browserNoActivityTimeout: 60000, //default 10000
    browserDisconnectTimeout: 10000, // default 2000
    browserDisconnectTolerance: 1, // default 0
    captureTimeout: 60000,

    detectBrowsers: {
      enabled: true,
      usePhantomJS: false,
      preferHeadless: true,
      postDetection(availableBrowsers) {
        return availableBrowsers.filter(browser => browser !== 'SafariTechPreview');
      }
    },

    customLaunchers: {
      Safari: {
        base: 'SafariNative',
      },
    },

    // list of files / patterns to load in the browser
    files: [
      { pattern: 'src/element-internals.js', watched: false },
      { pattern: 'test/*.test.js', watched: false },
    ],


    // list of files / patterns to exclude
    exclude: [
    ],


    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
      'src/element-internals.js': ['sourceRollup'],
      'test/*.test.js': ['rollup'],
    },

    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['progress', coverage && 'coverage-istanbul'].filter(Boolean),

    rollupPreprocessor: {
      plugins: [
        require('rollup-plugin-commonjs')({
          include: 'node_modules/**',
          exclude: 'node_modules/@open-wc/**',
        }),
        require('rollup-plugin-babel')({
          babelrc: false,
          ...babelrc,
          plugins: [
          ],
        }),
      ],
      output: {
        format: 'iife',
        name: 'tests',
      },
    },

    customPreprocessors: {
      sourceRollup: {
        base: 'rollup',
        options: {
          plugins: [
            require('rollup-plugin-babel')({
              babelrc: false,
              ...babelrc,
              plugins: [coverage && 'babel-plugin-istanbul'].filter(Boolean),
            })
          ],
          output: {
            format: 'iife',
            name: 'tests',
          },
          treeshake: false,
        },
      },
    },

    // web server port
    port: 9876,


    // enable / disable colors in the output (reporters and logs)
    colors: true,


    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: watch,


    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: !watch,

    // Concurrency level
    // how many browser should be started simultaneous
    concurrency: Infinity
  })
}
