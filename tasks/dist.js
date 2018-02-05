/**
 * Creates a service worker and copies it to the dest directory
 *
 * @usage gulp dist
 */

import gulp from 'gulp';

export default function dist() {
  return gulp.src([
      `${process.env.DIRECTORY_SRC}/favicon.png`,
      `${process.env.DIRECTORY_SRC}/favicon.ico`,
      `${process.env.DIRECTORY_SRC}/manifest.json`,
    ])
    .pipe(gulp.dest(process.env.DIRECTORY_DEST));
}
