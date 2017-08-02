# CLIENT.Project

This document describes the Front-end build process.

The following tools are used:

 * Build - Node 6.5.0, Gulp
 * Packages - Npm, Bower
 * Docs - YuiDocs
 * JavaScript - Browserify, Babelify, Uglify, ESLint
 * Stylesheets - PostCSS, CSSNext, CSSClean
 * HTML - Handlebars
 * Images - ImageMin

## Prereqs

Install the required version of Node.js:

    Mac/Linux: $ chmod 770 node-install.sh & ./node-install.sh -i
    Windows: $ node-install.cmd --i

## Development Build

Builds source code from /src into /web. Starts a watch on files in /src.

    $ npm install
    $ npm run dev

## Production Build

Minifies all code. Skips installing optionalDependencies in package.json.

    $ npm install --no-optional
    $ npm run prod

## Local Server

Starts a BrowserSync development server @ http://localhost:3000

    $ npm run serve

## Image Optimization

Optimize GIF/PNG/JPG/SVG images. Images are losslessly compressed, and will replace the original versions.

    $ npm run optimize

## Documentation

Generates documentation based on JavaScript docblocks, writes to /docs.

    $ npm run docs

## Linting

Lints all JavaScript files for syntax issues.

    $ npm run lint

## Build Configuration

Vary build options based on the target environment:

 * env/default.env - base configuration.
 * env/development.env - overrides for dev environment
 * env/local.env - overrides for local environment. This is for your personal use only, do not commit this file.

## JavaScipt Bundles

Two separate bundles are created for JavaScript:

 * main.js - built from our own code in /src/assets/scripts
 * vendor.js - built from third-party libs in /src/assets/vendor

## Third-Party Libraries

Use npm whenever possible to install third party libraries. Add a new entry in package.json, under "dependencies"

If a library you want to use is NOT hosted in npm, do the following:

 1. Add an entry to the file bower.json
 1. Run `bower install` to download the library to /assets/vendor
 1. Add an alias for the library in package.json under "browser"
 1. If the library is not CommonJS-compatible, add an entry to "browserify-shim"
 1. Please commit all libraries in /assets/vendor to source control
