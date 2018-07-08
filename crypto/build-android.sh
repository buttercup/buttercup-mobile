#!/bin/bash

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd $DIR

cargo build --target aarch64-linux-android --release
cargo build --target armv7-linux-androideabi --release
cargo build --target i686-linux-android --release

cp ./target/aarch64-linux-android/release/*.so ../android/app/src/main/jni/arm64-v8a/
cp ./target/armv7-linux-androideabi/release/*.so ../android/app/src/main/jni/armeabi-v7a/
cp ./target/i686-linux-android/release/*.so ../android/app/src/main/jni/x86/

cd -
