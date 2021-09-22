#!/bin/bash

SERVER_BASE=${1:-https://cloud.redhat.com}

echo "Comparing current schema against prod API";

yarn schema:integrations:generate -i "${SERVER_BASE}"/api/integrations/v1.0/openapi.json
yarn schema:notifications:generate -i "${SERVER_BASE}"/api/notifications/v1.0/openapi.json

if [[ -z $(git status src/generated/ --porcelain --untracked-files=no) ]]; then
  echo "Success."
else
  git status src/generated
  git diff src/generated
  echo "Error: openapi.json types or actions are out of sync. "
fi
