# Buttercup Mobile
The mobile application for the Buttercup Credentials Manager.

[![Buttercup](https://cdn.rawgit.com/buttercup-pw/buttercup-assets/6582a033/badge/buttercup-slim.svg)](https://buttercup.pw) [![Build Status](https://travis-ci.org/buttercup/buttercup-mobile.svg?branch=master)](https://travis-ci.org/buttercup/buttercup-mobile)

## About
This repository holds the source for the Buttercup mobile application, which is available for the following platforms:

 * iOS **10+**
 * Android **6.0+**

The mobile application allows for full integration with Buttercup archives stored on a variety of platforms. Like the other applications, this mobile application makes use of **AES 256bit encryption** with over **200k PBKDF2 password derivation interations**.

### Introduction
This project uses **React Native** to build _native_ iOS and Android applications from a React/JavaScript codebase. The majority of the codebase is JavaScript which utilises the following platforms:

 * ReactJS
 * Redux
 * React Native Router Flux

As Buttercup makes use of strong cryptography, certain encryption/decryption tasks are performed using pure native code (Objective-C/Java). Only the bare minimum required for increased performance is handled on the native side, with the rest being solely JavaScript.

## Installation
Ensure that you're using **NodeJS 6** or newer on OSX. Android projects can be built and tested on Linux and Windows, but these platforms are _not officially supported_.

Before getting started, ensure you follow the [official React Native Getting Started guide](https://facebook.github.io/react-native/docs/getting-started.html) for your desired platform (iOS/Android). It is also recommended to have the react-native-cli installed:

```shell
npm install -g react-native-cli
```

Run the following to initialise the project:

```shell
npm install
```

Once all dependencies are installed and your target development environments are setup (Xcode for iOS and Android Studio for Android), it should be possible to begin development with virtual devices.

### iOS development
Providing Xcode is setup correctly, running the following will launch the application in an iPhone emulator:

```shell
npm run start:ios
```

### Android development
Ensure that Android Studio is setup correctly and that an AVD has been created. The virtual device must be on **API level 23** or greater running **Android 6.0** or newer. You must have the AVD started before continuing with no other devices connected. To ensure you only have one device running, execute the following on the command-line:

```shell
adb devices
```

To run the application in the virtual device, run the following:

```shell
npm run start:android
```

#### Running on an Android device
To run on an actual device, first terminate any AVDs that are running. Connect the phone over USB and run `adb devices` to ensure that it shows up. You can then run `npm run start:android` to launch the application on the device.

The same software version restrictions apply to real devices.

## Contributing
We love contributions - anything from new features and bug fixes to suggestions and questions. Please keep it respectful and understand that we only have so much time in a work day. If you plan on submitting a PR for a new feature please consider raising an issue first to discuss the architecture and approach. Also remember that not all features may be accepted: We will accept features that are in line with the project roadmap that make sense and are easily maintainable.

### Development
Please keep in-line with the code style of each file, regardless of what tests are run (linting etc.). When creating new files their format is expected to closely resemble that of other existing source files.
