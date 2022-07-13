#!/bin/bash
set -e
set -x

if [ "${TRAVIS_BRANCH}" = "master" ]
then
    for env in ci qa
    do
        echo "PUSHING ${env}-beta"
        rm -rf ./dist/.git
        .travis/release.sh "${env}-beta"
    done
fi


if [ "${TRAVIS_BRANCH}" = "master" ]
then
    for env in ci qa
    do
        echo "PUSHING ${env}-stable"
        rm -rf ./dist/.git
        .travis/release.sh "${env}-stable"
    done
fi

if [ "${TRAVIS_BRANCH}" = "prod" ]
then
    echo "PUSHING prod-beta"
    rm -rf ./dist/.git
    .travis/release.sh "prod-beta"

    echo "PUSHING prod-stable"
    rm -rf ./dist/.git
    .travis/release.sh "prod-stable"
fi

if [ "${TRAVIS_BRANCH}" = "prod-beta" ]
then
    echo "PUSHING prod-beta"
    rm -rf ./dist/.git
    .travis/release.sh "prod-beta"
fi

if [ "${TRAVIS_BRANCH}" = "prod-stable" ]
then
    echo "PUSHING prod-stable"
    rm -rf ./dist/.git
    .travis/release.sh "prod-stable"
fi
