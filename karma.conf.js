/*global module*/
(function karmaConfig(module) {
  'use strict';

  module.exports = function configureKarma(config) {
    config.set({
      basePath: '',
      frameworks: ['jasmine'],
      files: [
        'node_modules/angular/angular.js',
        'node_modules/angular-mocks/angular-mocks.js',
        'lib/angular-socialshare.js',
        'test/**/*.spec.js'
      ],
      exclude: [],
      preprocessors: {},
      reporters: ['progress'],
      port: 9876,
      colors: true,
      logLevel: config.LOG_INFO,
      autoWatch: false,
      browsers: process.env.CI ? ['ChromeHeadlessNoSandbox'] : ['ChromeHeadless'],
      customLaunchers: {
        'ChromeHeadlessNoSandbox': {
          'base': 'ChromeHeadless',
          'flags': ['--no-sandbox', '--disable-gpu']
        }
      },
      singleRun: true,
      concurrency: Infinity
    });
  };
}(module));