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

export const stagingStableAndAnyProd: Array<Environment> = [
    'stage',
    // 'prod-beta', // Todo: Add it back
    'prod'
];

export const isStagingOrProd = (insights: InsightsType) => {
    return stagingAndProd.includes(getInsightsEnvironment(insights));
};

export const isStagingStableOrAnyProd = (insights: InsightsType) => {
    return stagingStableAndAnyProd.includes(getInsightsEnvironment(insights));
};
