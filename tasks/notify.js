/**
 * Notify user of happenings with system notifications.
 */

import gulp from 'gulp';
import gulpIf from 'gulp-if';
import plumber from 'gulp-plumber';
import gutil from 'gulp-util';

class Notify {
    // By default, only logs if in watch mode
    // unless force = true
    log(title, message = '', force) {
        if (force || this.isWatch) {
            gutil.log(title, message);
        }
    }

    onLog(title, message = '', force) {
        return () => {
            this.log(title, message);
        };
    }

    error(title, error) {
        const message = [title, error.fileName, error.lineNumber, error.message, error.codeFrame]
            .filter(part => part != null)
            .join('\n');

        gutil.log(gutil.colors.red(message));

        if (process.env.BEEP_ON_ERROR === 'true') {
            gutil.beep();
        }
    }

    onError(title) {
        return plumber({
            errorHandler: error => { this.error(title, error); },
        });
    }

    get isWatch() {
        return process.env.WATCH === 'true' && process.env.watchStarted === 'true';
    }
}

export default new Notify();
