import { Environment, getInsightsEnvironment, InsightsType } from '@redhat-cloud-services/insights-common-typescript';

export const stagingBetaAndProdBetaEnvironment: Array<Environment> = [
    'staging-beta',
    'prod-beta'
];

export const isStagingBetaOrProdBeta = (insights: InsightsType) => {
    return stagingBetaAndProdBetaEnvironment.includes(getInsightsEnvironment(insights));
};
