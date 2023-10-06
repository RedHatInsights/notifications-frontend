import { useChrome } from '@redhat-cloud-services/frontend-components/useChrome';

export const stagingAndProd: Array<string> = [
    'stage-beta',
    'prod-beta',
    'stage',
    'prod'
];

export const fedramp: Array<string> = [
    'gov',
    'govStage',
    'gov-beta',
    'govStage-beta'
];

export const stagingAndProdStable: Array<string> = [
    'stage',
    'prod'
];

export const stagingAndProdBeta: Array<string> = [
    'stage-beta',
    'prod-beta'
];

export const staging: Array<string> = [
    'stage',
    'stage-beta'
];

export const useIsExperimental = () => {
    const { getEnvironment, isBeta } = useChrome();
    const environment = `${getEnvironment()}-${isBeta() ? 'beta' : 'stable'}`;

    return !stagingAndProd.includes(environment) && !fedramp.includes(environment);
};
