/**
 * Builds HTML markup found in /src/assets/
 *
 * @usage gulp markup
 */

/* eslint-disable camelcase, no-param-reassign */
import browserSync from 'browser-sync';
import gulp from 'gulp';
import handlebarsHelpers from 'handlebars-helpers';
import handlebarsLayouts from 'handlebars-layouts';
import hb from 'gulp-hb';
import notify from './notify';
import pkg from './../package.json';
import prettify from 'gulp-prettify';
import rename from 'gulp-rename';
import replace from 'gulp-replace';

function watchMarkup() {
    const src = [
        `${process.env.DIRECTORY_SRC}/**/*.hbs`,
        `!${process.env.DIRECTORY_SRC}/assets/**`,
    ];

    gulp.watch(src, () => {
        notify.log('MARKUP: file update detected, rebuilding...');
        buildMarkup();
    });
}

function buildMarkup() {
    const browser = browserSync.get('local');
    const src = [
        `${process.env.DIRECTORY_SRC}/**/*.hbs`,
        `!${process.env.DIRECTORY_SRC}/assets/**`,
        `!${process.env.DIRECTORY_SRC}/templates/**`,
    ];

    return gulp
        .src(src)
        .pipe(notify.onError('MARKUP: error'))
        .pipe(hb()
            .partials(`${process.env.DIRECTORY_SRC}/templates/**/*.hbs`)
            .helpers(handlebarsHelpers)
            .helpers(handlebarsLayouts)
            .data({
                version: pkg.version,
                date: new Date().toISOString(),
                env: process.env.NODE_ENV,
            })
            .data(`${process.env.DIRECTORY_SRC}/assets/data/*.{js,json}`)
        )
        .pipe(prettify({
            indent_size: 4,
            indent_inner_html : true,
            wrap_line_length: 999999,
            unformatted: [
                'a', 'b', 'code', 'i', 'p',
                'pre', 'small', 'span',
                'sub', 'sup', 'u', 'textarea',
                'strong', 'em', 'svg',
            ],
        }))
        .pipe(rename(path => { path.extname = '.html'; }))
        .pipe(gulp.dest(process.env.DIRECTORY_DEST))
        .on('end', notify.onLog('MARKUP: rebuild complete'))
        .on('end', browser.reload);
}

export default function markup() {
    if (process.env.WATCH === 'true') {
        watchMarkup();
    }

    return buildMarkup();
}
