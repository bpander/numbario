/**
 * Lints all JavaScript files for syntax issues in /src/assets/scripts
 *
 * @usage gulp lint
 */

import eslint from 'gulp-eslint';
import gulp from 'gulp';

export default function lint() {
    return gulp
        .src([`${process.env.DIRECTORY_SRC}/assets/scripts/**/*.js`])
        .pipe(eslint())
        .pipe(eslint.format('table'));
}
