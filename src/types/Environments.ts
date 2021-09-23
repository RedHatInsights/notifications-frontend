import { Environment, getInsightsEnvironment, InsightsType } from '@redhat-cloud-services/insights-common-typescript';

export const stagingAndProd: Array<Environment> = [
    'stage-beta',
    'prod-beta',
    'stage',
    'prod'
];

export const stagingAndProdStable: Array<Environment> = [
    'stage',
    'prod'
];

export const isStagingOrProd = (insights: InsightsType) => {
    return stagingAndProd.includes(getInsightsEnvironment(insights));
};

export const isStagingOrProdStable = (insights: InsightsType) => {
    return stagingAndProdStable.includes(getInsightsEnvironment(insights));
};
