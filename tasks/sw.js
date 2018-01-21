/**
 * Creates a service worker and copies it to the dest directory
 *
 * @usage gulp sw
 */

import pkg from './../package.json';
import gulp from 'gulp';
import replace from 'gulp-replace';

export default function sw() {
  return gulp.src([ `${process.env.DIRECTORY_SRC}/sw.js` ])
    .pipe(replace('{{version}}', pkg.version))
    .pipe(gulp.dest(process.env.DIRECTORY_DEST));
}
