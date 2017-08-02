/**
 * Output auto-generated documentation to /docs
 *
 * @usage gulp docs
 */

import del from 'del';
import gulp from 'gulp';
import pkg from './../package.json';
import runSequence from 'run-sequence';
import yuidoc from 'gulp-yuidoc';

function cleanDocs() {
    return del(`${process.env.DIRECTORY_DOCS}/scripts`);
}

function buildDocs() {
    return gulp
        .src(`${process.env.DIRECTORY_SRC}/assets/scripts/**/*.js`)
        .pipe(yuidoc.parser({
            project: {
                name: pkg.name,
                description: pkg.description,
                version: pkg.version,
                url: pkg.homepage,
            },
        }))
        .pipe(yuidoc.generator({
            helpers: [],
            themedir: 'tools/cache/yuidoc-friendly-theme',
        }))
        .pipe(gulp.dest(`${process.env.DIRECTORY_DOCS}/scripts`));
}

export default function docs() {
    return runSequence('cleanDocs', 'buildDocs');
}

gulp.task('cleanDocs', cleanDocs);
gulp.task('buildDocs', buildDocs);
