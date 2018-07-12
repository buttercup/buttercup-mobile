#!/bin/bash

THISDIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

cd $THISDIR/../android
./gradlew app:connectedAndroidTest
cd -
