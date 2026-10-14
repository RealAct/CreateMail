#!/bin/bash
#
# Builds the mailsync sync engine from the `mailsync` submodule (Mailspring-Sync,
# GPLv3) with CreateMail's patches applied, and installs it into ./app.
#
# The prebuilt binaries Mailspring publishes exit immediately unless their
# install path contains "mailspring", so CreateMail.app cannot use them.
#
# macOS: needs the Xcode command line tools; produces a universal binary.
# Linux: needs the packages listed in .github/workflows/test.yaml.
#
set -euo pipefail

ROOT_DIR=$( cd "$(dirname "$0")/.." ; pwd -P )
cd "$ROOT_DIR"

git submodule update --init mailsync

cd mailsync
git checkout -- .
for patch in "$ROOT_DIR"/mailsync-patches/*.patch; do
  echo "Applying $(basename "$patch")"
  git apply "$patch"
done

./build.sh

echo "mailsync installed into $ROOT_DIR/app"
