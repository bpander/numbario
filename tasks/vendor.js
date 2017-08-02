/**
 * Builds vendor files found in /src/assets/vendor
 *
 * @usage gulp vendor
 */

import browserify from 'browserify';
import buffer from 'vinyl-buffer';
import gulp from 'gulp';
import gulpIf from 'gulp-if';
import notify from './notify';
import pkg from './../package.json';
import source from 'vinyl-source-stream';
import uglify from 'gulp-uglify';

export default function vendor() {
    const vendorArray = [...Object.keys(pkg.browser), ...Object.keys(pkg.dependencies)];
    const bundler = browserify({ debug: false });

    // individually require all libs specified in vendor list
    vendorArray.forEach(vendor => {
        try {
            require.resolve(vendor);
            bundler.require(vendor);
        } catch (err) {
            // ignore non-js modules
        }
    });

    return bundler
        .bundle()
        .pipe(notify.onError('VENDOR: error'))
        .pipe(source('vendor.js'))
        .pipe(buffer())
        .pipe(gulpIf(process.env.MINIFY === 'true', uglify()))
        .pipe(gulp.dest(`${process.env.DIRECTORY_DEST}/assets/scripts/`));
}
