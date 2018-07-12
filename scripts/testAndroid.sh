#!/bin/bash

THISDIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

cd $THISDIR/../android
./gradlew --project-cache-dir ../.gradlecache test
rm ./app/libcrypto.dylib
rm ./app/libcrypto.so
