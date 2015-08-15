#!/bin/bash

dbfile=db.test.sqlite

export NODE_ENV=test

rm -f $dbfile
touch $dbfile

node_modules/.bin/mocha test/*.test.js \
  --require babel/register \
  --require test/env.js \
  $@
