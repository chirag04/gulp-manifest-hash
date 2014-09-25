var path = require('path');
var crypto = require('crypto');
var through2 = require('through2');
var gutil = require('gulp-util');
var PluginError = gutil.PluginError;

module.exports = function () {
  return through2.obj(function(file, enc, cb) {

    if (file.isNull()) {
      return cb(null, file);
    }

    if (file.isStream()) {
      return cb(new PluginError('gulp-manifest', 'Streaming not supported'));
    }

    var src = file.contents.toString('utf8');
    file.hash = crypto.createHash('md5').update(src).digest('hex');
    
    var basename = path.basename(file.path);

    var new_basename = basename.split('.');
        new_basename[0] = new_basename[0] + "-" + file.hash;
        new_basename = new_basename.join('.');

    file.path = file.path.replace(basename, new_basename);
    cb(null, file);

  });
};