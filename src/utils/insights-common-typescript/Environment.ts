import { InsightsType } from './InsightsType';

const nonBetaEnvironments = [
  'ci',
  'qa',
  'stage',
  'prod',
  'gov',
  'govStage',
] as const;

const betaEnvironments = nonBetaEnvironments.map((v) => `${v}-beta` as const);

export type NonBetaEnvironment = (typeof nonBetaEnvironments)[number];
export type BetaEnvironment = (typeof betaEnvironments)[number];

export type Environment = NonBetaEnvironment | BetaEnvironment;

export const getInsightsEnvironment = (insights: InsightsType): Environment => {
  const isBeta = insights.chrome.isBeta();
  const env: NonBetaEnvironment = insights.chrome.getEnvironment();
  if (isBeta) {
    return `${env}-beta` as BetaEnvironment;
  } else {
    return env;
  }
};
