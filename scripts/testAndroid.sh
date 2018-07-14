#!/bin/bash

THISDIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

set -e

cd $THISDIR/../android

./gradlew assemble
./gradlew app:connectedAndroidTest

cd -
