#!/usr/bin/env bash

rm -rf build
rm actual.log
TRONBOX_SOLIDITY_CONSOLE_LOG=true ../../tronbox.dev migrate --quiet > actual.log
../../tronbox.dev test