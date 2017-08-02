/**
 * Exits early if old version of node is detected
 * Checks installed version of node against the minimum version number of node specified
 * in package.json/engines/node
 */

'use strict';

var path = require('path');
var shell = require('shelljs');
var pkg = require('./../package.json');
var semver = require('semver');
var readline = require('readline');

shell.chmod(770, path.resolve(__dirname, '../build.sh'));
shell.chmod(770, path.resolve(__dirname, '../node-install.sh'));

var expected = semver.validRange(pkg.engines.node);
var actual = semver.valid(process.version);
var satisfies = semver.satisfies(actual, expected);

if (!satisfies) {
    var errorMessage =
        '=========================================================\n' +
        'STOP! OUTDATED NODE VERSION DETECTED!\n' +
        '=========================================================\n' +
        'Cannot run build due to outdated node version\n' +
        'Expected node ' + expected + ', but found ' + actual + '\n\n' +
        'To install the required version of node:\n\n' +
        '    Windows: node-install.cmd --install\n' +
        '    Mac/Linux: ./node-install.sh --install\n' +
        '=========================================================';

    console.error(errorMessage);
    console.log('Press any key to exit');

    process.stdin.setRawMode(true);
    process.stdin.resume();
    process.stdin.on('data', process.exit.bind(process, 0));
}
