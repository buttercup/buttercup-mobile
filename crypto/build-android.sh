cargo build --target aarch64-linux-android --release
cargo build --target armv7-linux-androideabi --release
cargo build --target i686-linux-android --release

cp ./target/aarch64-linux-android/release/*.so ../android/app/src/main/jniLibs/arm64-v8a/
cp ./target/armv7-linux-androideabi/release/*.so ../android/app/src/main/jniLibs/armeabi-v7a/
cp ./target/i686-linux-android/release/*.so ../android/app/src/main/jniLibs/x86/
