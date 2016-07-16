"use strict";

const fs = require('fs-extra');
const path = require('path');
const gaze = require('gaze');

// Watch manifest change
gaze('./src/manifest.json', function(err, watcher) {
  this.on('all', function(event, filepath) {
    const destPath = './dist/unpacked/' + path.basename(filepath);
    fs.copySync(filepath, destPath, {clobber: true});
    console.log('Copy changed', filepath);
  });
});
