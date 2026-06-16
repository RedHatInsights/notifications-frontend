const nonBetaEnvironments = ['ci', 'qa', 'stage', 'prod', 'gov', 'govStage'] as const;

const betaEnvironments = nonBetaEnvironments.map((v) => `${v}-beta` as const);

export type NonBetaEnvironment = (typeof nonBetaEnvironments)[number];
export type BetaEnvironment = (typeof betaEnvironments)[number];

export type Environment = NonBetaEnvironment | BetaEnvironment;

export const getInsightsEnvironment = (isBeta: boolean, env: string): Environment => {
  if (isBeta) {
    return `${env}-beta` as BetaEnvironment;
  }
  return env as NonBetaEnvironment;
};
