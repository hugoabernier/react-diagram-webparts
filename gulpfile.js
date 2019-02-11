'use strict';

const gulp = require('gulp');
const build = require('@microsoft/sp-build-web');
build.addSuppression(`Warning - [sass] The local CSS class 'ms-Grid' is not camelCase and will not be type-safe.`);

const path = require('path');

// Added to simplify imports
build.configureWebpack.mergeConfig({
  additionalConfiguration: (generatedConfiguration) => {
    if(!generatedConfiguration.resolve.alias){
      generatedConfiguration.resolve.alias = {};
    }

    // web part specific components folder
    generatedConfiguration.resolve.alias['@flow-components'] = path.resolve( __dirname, 'lib/webparts/flow/components/')
    generatedConfiguration.resolve.alias['@sequence-components'] = path.resolve( __dirname, 'lib/webparts/flow/sequence/')

    // common
    generatedConfiguration.resolve.alias['@common'] = path.resolve( __dirname, 'lib/common/')

    // controls
    generatedConfiguration.resolve.alias['@controls'] = path.resolve( __dirname, 'lib/controls/')

    //root src folder
    generatedConfiguration.resolve.alias['@src'] = path.resolve( __dirname, 'lib')

    return generatedConfiguration;
  }
});
// End Added

build.initialize(gulp);
