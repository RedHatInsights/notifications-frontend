import { Environment, getInsightsEnvironment } from '../utils/insights-common-typescript';

export const stagingAndProd: Array<Environment> = ['stage-beta', 'prod-beta', 'stage', 'prod'];

export const fedramp: Array<Environment> = ['gov', 'govStage', 'gov-beta', 'govStage-beta'];

export const stagingAndProdStable: Array<Environment> = ['stage', 'prod'];

export const stagingAndProdBeta: Array<Environment> = ['stage-beta', 'prod-beta'];

export const staging: Array<Environment> = ['stage', 'stage-beta'];

export const isExperimental = (isBeta: boolean, env: string) => {
  const environment = getInsightsEnvironment(isBeta, env);

  return !stagingAndProd.includes(environment) && !fedramp.includes(environment);
};
