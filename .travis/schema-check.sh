#!/bin/bash

if [ "${TRAVIS_BRANCH}" = "prod" ] || [ "${TRAVIS_BRANCH}" = "prod-stable" ]
then
    yarn schema:integrations:generate -i https://cloud.redhat.com/api/integrations/v1.0/openapi.json
    yarn schema:notifications:generate -i https://cloud.redhat.com/api/notifications/v1.0/openapi.json
    [[ -z $(git status --porcelain) ]] ||
    (
      git status &&
      git diff &&
      echo "----------------------------------------------------------------" &&
      echo "  openapi.json types or actions are out of sync aborting build. " &&
      echo "----------------------------------------------------------------" &&
      false
    )
fi
