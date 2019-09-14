# Buttercup Mobile Changelog

## v.1.10.0
_2019-09-14_

 * React Native to 0.59
 * Update to 64bit support
 * **Bugfix**:
   * App would crash during infinite request loop for permissions

## v1.9.1
_2019-08-29_

 * Android 64bit support

_Released to Android only._

## v1.9.0
_2019-08-27_

 * Google Drive integration
 * Password display uses monospace font

_Released to iOS only._

## v1.8.2
_2019-05-16_

 * **Bugfix**: ([#158](https://github.com/buttercup/buttercup-mobile/issues/158)) Android devices throw `Unknown type: null` error
 * Update icons for Android

## v1.8.1
_2019-01-19_

 * **Bugfix**: ([#137](https://github.com/buttercup/buttercup-mobile/issues/137)) Keychain access results in constant auth prompts
 * **Bugfix**: ([#136](https://github.com/buttercup/buttercup-mobile/issues/136)) Unable to create new vaults on iOS

## v1.8.0
_2019-01-17_

 * ([#125](https://github.com/buttercup/buttercup-mobile/issues/125)) iOS Autofill integration

## v1.7.0
_2019-01-01_

 * ([#69](https://github.com/buttercup/buttercup-mobile/issues/69)) Searching

## v1.6.0
_2018-12-14_

 * **Bugfix**:
   * ([#129](https://github.com/buttercup/buttercup-mobile/issues/129)) Android packaging failing
 * New Dropbox & WebDAV clients
 * React-Native -> 0.57

## v1.5.0
_2018-08-13_

 * ([#115](https://github.com/buttercup/buttercup-mobile/pull/115)) Offline archives

## v1.4.3
_2018-08-03_

 * **Bugfix**: (#112) App crashes when certain custom properties are edited or added

## v1.4.2
_2018-07-21_

 * **Bugfix**: (#111) Various Android UI issues

## v1.4.1
_2018-07-18_

 * **Bugfix**: App would crash on some Android phones due to bad gradle config

## v1.4.0
_2018-07-16_

 * **New crypto library** written in Rust
   * **Bugfix**: (#78) Possible tampering error

## v1.3.0
_2018-06-05_

May update:

 * Upgraded archive format for future format support
 * Fixed Android Touch Unlock support

## v1.2.0
_2018-04-07_

Feature release:

 * **Touch unlock** support for iOS and Android
 * Update React-Native to 0.54
 * Minor UI updates

## v1.1.2
_2017-11-01_

Android patch:

 * **Bugfix**: (#64) Using the Android back arrow to leave the app would cause intermittent crashes

## v1.1.1
_2017-10-27_

Patch release to fix some issues:

 * **Bugfix**: (#62) Saving would override remote changes without merging
 * Removed analytics

## v1.1.0
_2017-10-18_

Quick follow-up feature release:

 * Dropbox support
 * Analytics update (session fix)
 * "View-hidden" button for showing password field
 * Home screen face-lift

## v1.0.0
_2017-10-07_

First iOS release. Includes basic functionality:

 * Add/Remove archives
 * Add/Remove groups
 * Add/Remove/Edit entries
 * Connect ownCloud/Nextcloud/WebDAV archives (no Dropbox support yet)
 * Open entries in Safari (with password copied)
 * Auto-lock after 10 minutes of being in background
 * Auto-hide app contents on being moved to background
