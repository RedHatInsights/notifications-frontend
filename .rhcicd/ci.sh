#!/bin/bash

yarn lint
yarn ci:test
yarn build:prod
yarn smoketest
yarn ci:pinned-deps