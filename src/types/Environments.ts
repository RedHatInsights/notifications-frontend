import { Environment, getInsightsEnvironment, InsightsType } from '@redhat-cloud-services/insights-common-typescript';

export const stagingAndProd: Array<Environment> = [
    'stage-beta',
    'prod-beta',
    'stage',
    'prod'
];

export const isStagingOrProd = (insights: InsightsType) => {
    return stagingAndProd.includes(getInsightsEnvironment(insights));
};
