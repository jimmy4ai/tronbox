#!/usr/bin/env bash

echo 'Nile: Test abiv2'
cd abiv2
rm -rf build
../../tronbox.dev migrate --network nile
cd ..

echo 'Nile: Test init'
rm -rf build
mkdir build
cd build
TRONBOX_CREATE_JAVASCRIPT_PROJECT_WITH_DEFAULTS=true ../../tronbox.dev init
../../tronbox.dev migrate --network nile
cd ..

echo 'Nile: Test init metacoin'
rm -rf build
mkdir build
cd build
TRONBOX_CREATE_JAVASCRIPT_METACOIN_PROJECT_WITH_DEFAULTS=true ../../tronbox.dev init
../../tronbox.dev migrate --network nile
cd ..

echo 'Nile: Test unbox metacoin'
rm -rf build
mkdir build
cd build
../../tronbox.dev unbox metacoin-box
../../tronbox.dev migrate --network nile
cd ..

echo 'BTTC: Test evm'
cd evm
rm -rf build
../../tronbox.dev migrate --network bttc --evm
cd ..
