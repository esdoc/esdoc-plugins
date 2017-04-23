#!/bin/bash -e

for plugin in $(ls -1 -d esdoc-*)
do
  echo $plugin
  (cd $plugin && npm install)
  echo ========================================================================
done
