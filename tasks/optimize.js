/**
 * Optimize all GIF, PNG, JPG, SVG assets in /src/assets/media/images
 *
 * Images are losslessly compressed with no degraded image quality.
 * Compressed images will replace the original versions in source directory.
 * Commit compressed images source control.
 *
 * This task can is a one-off manual run and not part of the normal build process.
 *
 * @usage gulp optimize
 */

import gulp from 'gulp';
import imagemin from 'gulp-imagemin';
import pngquant from 'imagemin-pngquant';

export default function optimize() {
    return gulp
        .src(`${process.env.DIRECTORY_SRC}/assets/media/images/**/*.+(png|jpg|gif|svg)`)
        .pipe(imagemin({
            verbose: true,
            progressive: true,
            optimizationLevel: 7,
            use: [pngquant()], // pngquant isn't included in gulp-imagemin by default
        }))
        .pipe(gulp.dest(`${process.env.DIRECTORY_SRC}/assets/media/images/`));
}
