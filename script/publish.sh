#!/bin/bash -e

for plugin in $(ls -1 -d esdoc-*)
do
  cd $plugin
  npm publish --access public
  cd ../
done
