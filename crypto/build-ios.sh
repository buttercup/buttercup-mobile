#!/bin/bash

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd $DIR

rustup target add aarch64-apple-ios
rustup target add armv7-apple-ios
rustup target add i386-apple-ios
rustup target add x86_64-apple-ios

cargo lipo --release

cp ./target/universal/release/libcrypto.a ../ios/libs/

cd -
