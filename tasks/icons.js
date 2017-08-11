/**
 * Builds static files found in /src/assets/icons
 *
 * @usage gulp icons
 */

import browserSync from 'browser-sync';
import gulp from 'gulp';
import inject from 'gulp-inject';
import svgmin from 'gulp-svgmin';
import svgstore from 'gulp-svgstore';
import notify from './notify';

function watchIcons() {
    gulp.watch(`${process.env.DIRECTORY_SRC}/assets/icons/**/*`, () => {
        notify.log('ICONS: file update detected, rebuilding...');
        buildIcons();
    });
}

function buildIcons() {
    const browser = browserSync.get('local');
    const svgs = gulp
        .src(`${process.env.DIRECTORY_SRC}/assets/icons/**/*`)
        .pipe(svgmin())
        .pipe(svgstore({ inlineSvg: true }));

    return gulp
        .src(`${process.env.DIRECTORY_DEST}/**/*.html`)
        .pipe(inject(svgs, { transform: (filePath, file) => file.contents.toString() }))
        .pipe(gulp.dest(process.env.DIRECTORY_DEST))
        .on('end', notify.onLog('ICONS: rebuild complete'))
        .on('end', browser.reload);
}

export default function icons() {
    if (process.env.WATCH === 'true') {
        watchIcons();
    }

    return buildIcons();
}
