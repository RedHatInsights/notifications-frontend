import { useCallback, useMemo } from 'react';
import { Environment, getInsightsEnvironment } from './Environment';
import { FeatureFlagCallback, useFeatureFlag } from './useFeatureFlag';

type EnvironmentFlagSignature = {
  <T>(
    currentEnvironment: Environment,
    targetEnvironments: Environment | ReadonlyArray<Environment>,
    ifTrue: FeatureFlagCallback<T>,
    ifFalse?: FeatureFlagCallback<T>
  ): T | undefined;
  <T>(
    currentEnvironment: Environment,
    targetEnvironments: Environment | ReadonlyArray<Environment>,
    ifTrue: FeatureFlagCallback<T> | undefined,
    ifFalse: FeatureFlagCallback<T>
  ): T | undefined;
};

export const useEnvironmentFlag: EnvironmentFlagSignature = <T>(
  currentEnvironment: Environment,
  targetEnvironments: Environment | ReadonlyArray<Environment>,
  ifTrue: FeatureFlagCallback<T> | undefined,
  ifFalse: FeatureFlagCallback<T> | undefined
) => {
  const resolver = useCallback(
    () => targetEnvironments.includes(currentEnvironment),
    [currentEnvironment, targetEnvironments]
  );

  return useFeatureFlag(resolver, ifTrue, ifFalse as FeatureFlagCallback<T>);
};

type InsightsEnvironmentFlagSignature = {
  <T>(
    isBeta: boolean,
    env: string,
    targetEnvironments: Environment | ReadonlyArray<Environment>,
    ifTrue: FeatureFlagCallback<T>,
    ifFalse?: FeatureFlagCallback<T>
  ): T | undefined;
  <T>(
    isBeta: boolean,
    env: string,
    targetEnvironments: Environment | ReadonlyArray<Environment>,
    ifTrue: FeatureFlagCallback<T> | undefined,
    ifFalse: FeatureFlagCallback<T>
  ): T | undefined;
};

export const useInsightsEnvironmentFlag: InsightsEnvironmentFlagSignature = <T>(
  isBeta: boolean,
  env: string,
  targetEnvironments: Environment | ReadonlyArray<Environment>,
  ifTrue: FeatureFlagCallback<T> | undefined,
  ifFalse: FeatureFlagCallback<T> | undefined
) => {
  const current = useMemo(() => getInsightsEnvironment(isBeta, env), [isBeta, env]);

  return useEnvironmentFlag(current, targetEnvironments, ifTrue, ifFalse as FeatureFlagCallback<T>);
};
