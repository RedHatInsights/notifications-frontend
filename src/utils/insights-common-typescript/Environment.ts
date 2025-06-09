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
const environments = [...nonBetaEnvironments, ...betaEnvironments] as const;

const prodEnvironments = ['prod', 'prod-beta', 'gov', 'gov-beta'] as const;
const nonProdEnvironments = environments.filter(
  (v) => !prodEnvironments.includes(v as (typeof prodEnvironments)[number])
);

const ciEnvironments: ReadonlyArray<Environment> = ['ci', 'ci-beta'];
const qaEnvironments: ReadonlyArray<Environment> = ['qa', 'qa-beta'];
const stageEnvironments: ReadonlyArray<Environment> = [
  'stage',
  'stage-beta',
  'govStage',
  'govStage-beta',
];

const govProdEnvironments: ReadonlyArray<Environment> = ['gov', 'gov-beta'];
const govStageEnvironments: ReadonlyArray<Environment> = [
  'govStage',
  'govStage-beta',
];

export type NonBetaEnvironment = (typeof nonBetaEnvironments)[number];
export type BetaEnvironment = (typeof betaEnvironments)[number];

export type Environment = NonBetaEnvironment | BetaEnvironment;

type Environments = Record<
  | 'all'
  | 'beta'
  | 'nonBeta'
  | 'prod'
  | 'nonProd'
  | 'ci'
  | 'qa'
  | 'stage'
  | 'govProd'
  | 'govStage',
  ReadonlyArray<Environment>
>;
export const Environments: Environments = {
  all: environments,
  beta: betaEnvironments,
  nonBeta: nonBetaEnvironments,
  prod: prodEnvironments,
  nonProd: nonProdEnvironments,
  ci: ciEnvironments,
  qa: qaEnvironments,
  stage: stageEnvironments,
  govProd: govProdEnvironments,
  govStage: govStageEnvironments,
};

export const getInsightsEnvironment = (insights: InsightsType): Environment => {
  const isBeta = insights.chrome.isBeta();
  const env: NonBetaEnvironment = insights.chrome.getEnvironment();
  if (isBeta) {
    return `${env}-beta` as BetaEnvironment;
  } else {
    return env;
  }
};
