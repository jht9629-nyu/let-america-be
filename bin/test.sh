#!/bin/bash
cd ${0%/*}

# Produce a release build to main branch

cd ..
quiet=--quiet

# src/js/a-main.js
VERSION=$(grep -e "my.version =" src/js/a-main.js)

echo $VERSION