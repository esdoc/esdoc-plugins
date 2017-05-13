#!/bin/bash

for plugin in $(ls -1 -d esdoc-*)
do
  cd $plugin
  localDate=$(TZ=UTC git log --date=format-local:%Y-%m-%d -n 1 ./ | grep Date | cut -d ' ' -f 4 | cut -d 'T' -f 1)
  npmDate=$(npm view ./ | grep modified | awk -F "'" '{print $2}' | cut -d 'T' -f 1)

  if [ $localDate != $npmDate ]; then
    echo $plugin
    echo $localDate
    echo $npmDate
  fi

  cd ../
done
