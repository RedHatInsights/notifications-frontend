import { Environment, getInsights, getInsightsEnvironment, InsightsType } from '@redhat-cloud-services/insights-common-typescript';

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
    'prod-beta',
    'prod'
];

export const staging: Array<Environment> = [
    'stage',
    'stage-beta'
];

export const isStagingOrProd = (insights: InsightsType) => {
    return stagingAndProd.includes(getInsightsEnvironment(insights));
};

export const isStagingStableOrAnyProd = (insights: InsightsType) => {
    return stagingStableAndAnyProd.includes(getInsightsEnvironment(insights));
};

export const isReleased = () => {
    const insights = getInsights();
    return isStagingStableOrAnyProd(insights);
};
