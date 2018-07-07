#!/usr/bin/env bash

THISDIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

SIMNAME=$1
SIMVER=$2

echo Testing ${SIMNAME} with iOS ${SIMVER}...

cd $THISDIR/../ios
set -o pipefail && xcodebuild -scheme Buttercup -destination "platform=iOS Simulator,name=${SIMNAME},OS=${SIMVER}" build test | xcpretty -c
