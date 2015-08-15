#!/bin/bash

mkdir -p lib
node_modules/.bin/babel --retain-lines src --out-dir lib
