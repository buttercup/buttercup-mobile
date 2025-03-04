# Buttercup Mobile
> Mobile vault application for Buttercup Password Manager

[![Buttercup](https://cdn.rawgit.com/buttercup-pw/buttercup-assets/6582a033/badge/buttercup-slim.svg)](https://buttercup.pw) ![Tests status](https://github.com/buttercup/buttercup-mobile/actions/workflows/test.yml/badge.svg) [![Backers on Open Collective](https://opencollective.com/buttercup/backers/badge.svg)](#backers) [![Sponsors on Open Collective](https://opencollective.com/buttercup/sponsors/badge.svg)](#sponsors) [![Chat securely on Keybase](https://img.shields.io/badge/keybase-bcup-blueviolet)](https://keybase.io/team/bcup)

[![Get it from iTunes](https://buttercup.pw/static/img/appstore.svg)](https://itunes.apple.com/us/app/buttercup-password-manager/id1294001514) [![Get it on Google Play](https://buttercup.pw/static/img/googleplay.svg)](https://play.google.com/store/apps/details?id=com.buttercup&hl=en&utm_campaign=github&pcampaignid=badge-2017-10-31)

![Vault screen](https://github.com/buttercup/buttercup-mobile/raw/master/bcup-1.png) ![Entry screen](https://github.com/buttercup/buttercup-mobile/raw/master/bcup-2.png)

---

⚠️ **Project Closure** ⚠️

The Buttercup project has come to an end, and these repositories are in transition to becoming public archives. No public-facing resources will be removed, wherever possible. Please do not create issues or PRs - they will unfortunately be ignored. Discussion can be found [here](https://github.com/buttercup/buttercup-desktop/discussions/1395), and explanation [here](https://gist.github.com/perry-mitchell/43ebfcec4d874b77a704be1d4f2262e6).

---

## About
This repository holds the source for the Buttercup mobile application, which is available for the following platforms:

 * iOS **13+**
 * Android **13+**

_Currently only phones are supported, not tablets._

The mobile application allows for full integration with Buttercup archives stored on a variety of platforms. Like the other applications, this mobile application makes use of **AES 256bit encryption** with over **200k PBKDF2 password derivation iterations**.

The Buttercup for Mobile application boasts the following features:

 * On-device encryption and decryption
 * Auto-hide screen when app is sent to background (like banking apps)
 * Auto-lock vaults after a certain period of inactivity
 * Add/Edit/Delete entries
 * Unlock vaults even when offline (read-only)
 * Autofilling of login forms in Safari (iOS only)
 * Password generator
 * Biometric access

You can read about the changes and releases of the application in the [changelog](CHANGELOG.md).

### Introduction
This project uses **React Native** to build _native_ iOS and Android applications from a React/JavaScript codebase. The majority of the codebase is JavaScript which utilises the following platforms:

 * ReactJS
 * Redux
 * React Native Router Flux

As Buttercup makes use of strong cryptography, certain encryption/decryption tasks are performed using pure native code (Objective-C/Java). Only the bare minimum required for increased performance is handled on the native side, with the rest being solely JavaScript.

## Installation
Ensure that you're using **NodeJS 14** or newer on OSX. Android projects can be built and tested on Linux and Windows, but these platforms are _not officially supported_.

Before getting started, ensure you follow the [official React Native Getting Started guide](https://facebook.github.io/react-native/docs/getting-started.html) for your desired platform (iOS/Android). It is also recommended to have the react-native-cli installed:

```shell
npm install -g react-native-cli
```

Run the following to initialise the project:

```shell
npm install
```

Once all dependencies are installed and your target development environments are setup (Xcode for iOS and Android Studio for Android), it should be possible to begin development with virtual devices.

**Important note about Node.js support**: Development for this project should be performed on Node version 8. Although it may work on versions 6 and newer, we will not be supporting issues raised for these versions. Similarly, we do not currently support NodeJS version 9.

### iOS development
Providing Xcode is setup correctly, running the following will launch the application in an iPhone emulator:

```shell
npm run ios
```

### Android development
Ensure that Android Studio is setup correctly and that an AVD has been created. The virtual device must be on **API level 23** or greater running **Android 6.0** or newer. You must have the AVD started before continuing with no other devices connected. To ensure you only have one device running, execute the following on the command-line:

```shell
adb devices
```

To run the application in the virtual device, run the following:

```shell
npm run android
```

#### Running on an Android device
To run on an actual device, first terminate any AVDs that are running. Connect the phone over USB and run `adb devices` to ensure that it shows up. You can then run `npm run start:android` to launch the application on the device.

The same software version restrictions apply to real devices.

#### Building an APK
To build a signed APK:

 1. Close all other development resources for the project.
 2. Run `npm run build:android` to first build the project.
 3. In Android Studio, choose _Build > Generate Signed APK_.
 4. Build a release APK by following the instructions in the GUI.

#### Publishing error: duplicate resources

If you encounter a publishing error when generating a signed APK, follow [these instructions](https://stackoverflow.com/questions/52632950/react-native-0-57-1-android-duplicate-resources#answer-55245362).

## Contributing

We love contributions - anything from new features and bug fixes to suggestions and questions. Please follow our [contribution guide](https://github.com/buttercup/dossier/blob/master/CONTRIBUTING.md).

### Development

Please keep in-line with the code style of each file, regardless of what tests are run (linting etc.). When creating new files their format is expected to closely resemble that of other existing source files.

### Contributors

This project exists thanks to all the people who contribute. [[Contribute]](https://github.com/buttercup/dossier/blob/master/CONTRIBUTING.md).
<a href="graphs/contributors"><img src="https://opencollective.com/buttercup/contributors.svg?width=890" /></a>

#### Backers

Thank you to all our backers! 🙏 [[Become a backer](https://opencollective.com/buttercup#backer)]

<a href="https://opencollective.com/buttercup#backers" target="_blank"><img src="https://opencollective.com/buttercup/backers.svg?width=890"></a>

#### Sponsors

Support this project by becoming a sponsor. Your logo will show up here with a link to your website. [[Become a sponsor](https://opencollective.com/buttercup#sponsor)]

<a href="https://opencollective.com/buttercup/sponsor/0/website" target="_blank"><img src="https://opencollective.com/buttercup/sponsor/0/avatar.svg"></a>
<a href="https://opencollective.com/buttercup/sponsor/1/website" target="_blank"><img src="https://opencollective.com/buttercup/sponsor/1/avatar.svg"></a>
<a href="https://opencollective.com/buttercup/sponsor/2/website" target="_blank"><img src="https://opencollective.com/buttercup/sponsor/2/avatar.svg"></a>
<a href="https://opencollective.com/buttercup/sponsor/3/website" target="_blank"><img src="https://opencollective.com/buttercup/sponsor/3/avatar.svg"></a>
<a href="https://opencollective.com/buttercup/sponsor/4/website" target="_blank"><img src="https://opencollective.com/buttercup/sponsor/4/avatar.svg"></a>
<a href="https://opencollective.com/buttercup/sponsor/5/website" target="_blank"><img src="https://opencollective.com/buttercup/sponsor/5/avatar.svg"></a>
<a href="https://opencollective.com/buttercup/sponsor/6/website" target="_blank"><img src="https://opencollective.com/buttercup/sponsor/6/avatar.svg"></a>
<a href="https://opencollective.com/buttercup/sponsor/7/website" target="_blank"><img src="https://opencollective.com/buttercup/sponsor/7/avatar.svg"></a>
<a href="https://opencollective.com/buttercup/sponsor/8/website" target="_blank"><img src="https://opencollective.com/buttercup/sponsor/8/avatar.svg"></a>
<a href="https://opencollective.com/buttercup/sponsor/9/website" target="_blank"><img src="https://opencollective.com/buttercup/sponsor/9/avatar.svg"></a>
