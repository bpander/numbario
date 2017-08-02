#!/bin/sh

set -e

npm install --no-optional
npm run prod

printf 'DONE'
