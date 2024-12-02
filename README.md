[![Build Status](https://travis-ci.com/RedHatInsights/notifications-frontend.svg?branch=master)](https://travis-ci.com/RedHatInsights/notifications-frontend)


# notifications-frontend 

Notifications frontend for Red Hat Insights

## Build app

0. If needed run `npm install` to install dependency packages

1. ```npm install```

2. ```npm start```
    - starts webpack bundler and serves the files with webpack dev server

### Testing

- `npm run verify` will run linters and tests
- Travis is used to test the build for this code.
  - You are always notified on failed builds
  - You are only notified on successful builds if the build before it failed
  - By default, both `push` events as well as `pull_request` events send notifications

## Running locally

You need to configure your `/etc/hosts` to have the hosts for `prod.foo` and `stage.foo`.
Check or execute [this](https://raw.githubusercontent.com/RedHatInsights/insights-proxy/master/scripts/patch-etc-hosts.sh) script for details.

Install the dependencies using `npm install`:

```shell
npm install
```

Then run the application:

```shell
npm start
```

For more info refer to [Insights Frontend Starter App README](https://github.com/RedHatInsights/insights-frontend-starter-app/blob/master/README.md)

## Deploying

Deployments come from the `.travis/custom_release.sh` file. Push to certain branches to deploy to certain environments:

### Pushing to master and prod branches.

Anytime a build of the `master` branch happens, Travis builds and pushes a new commit to the ci-beta, qa-beta, ci-stable and qa-stable branch of notifications-frontend-build repository. Pull requests on master will not be deployed until they are merged, but they will be built to assure linting, snapshots, etc. are working as expected.
A push to `prod` branch  will push new commits to `prod-stable` and `prod-beta` of branch of notifications-frontend-build repository.
It's possible to only push to `prod-stable` or `prod-beta` by creating these branches, but any other push to `prod` branch will overwrite these changes.

### Deploying to prod

To deploy to prod, delete the `prod` branch and create it again from the wanted commit/branch.

### Testing if generated files (openapi) are in sync

One can manually verify if the files are in sync by running `npm run schema-check`. This will, by default, compare with prod.
It is possible to specify the path the server by passing is as the first argument, e.g. `yarn schema-check http://localhost:8085.

### Testing - jest

When you want to test your code with unit tests please use `jest` which is preconfigured in a way to collect codecoverage as well. If you want to see your coverage on server the travis config has been set in a way that it will send data to [codecov.io](https://codecov.io) the only thing you have to do is visit their website (register), enable your repository and add CODECOV_TOKEN to your travis web config (do not add it to .travis file, but trough [travis-ci.org](https://travis-ci.org/))

## Generating types from Openapi file

The ui-frontend depends on types from the ui-backend, these are generated from the Openapi spec file, run `npm run schema` to reload the types.

Generate types can be found in: `src/generated/`, check `package.json` for more info.
