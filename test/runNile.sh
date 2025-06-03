#!/usr/bin/env bash

echo 'Test abiv2'
cd abiv2
rm -rf build
../../tronbox.dev migrate --network nile
cd ..

echo 'Nile: test openzeppelin'
cd openzeppelin
. runNile.sh
cd ..

echo 'Nile: test init'
rm -rf build
mkdir build
cd build
TRONBOX_CREATE_JAVASCRIPT_PROJECT_WITH_DEFAULTS=true ../../tronbox.dev init
../../tronbox.dev migrate --network nile
cd ..

echo 'Nile test init metacoin'
rm -rf build
mkdir build
cd build
TRONBOX_CREATE_JAVASCRIPT_METACOIN_PROJECT_WITH_DEFAULTS=true ../../tronbox.dev init
../../tronbox.dev migrate --network nile
cd ..

echo 'Nile: test unbox metacoin'
rm -rf build
mkdir build
cd build
../../tronbox.dev unbox metacoin-box
../../tronbox.dev migrate --network nile
cd ..

rm -rf build

echo 'Test evm'
cd evm
rm -rf build
../../tronbox.dev migrate --network bttc --evm
cd ..
