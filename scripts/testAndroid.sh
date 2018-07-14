#!/bin/bash

THISDIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

set -e

cd $THISDIR/../android
./gradlew app:connectedAndroidTest
cd -
