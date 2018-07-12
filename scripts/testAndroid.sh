#!/bin/bash

THISDIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

cd $THISDIR/../android
cp app/src/main/jniLibs/x86_64-darwin/libcrypto.dylib ./app/
cp app/src/main/jniLibs/armeabi-v7a/libcrypto.so ./app/
./gradlew --project-cache-dir ../.gradlecache test
rm ./app/libcrypto.dylib
rm ./app/libcrypto.so
