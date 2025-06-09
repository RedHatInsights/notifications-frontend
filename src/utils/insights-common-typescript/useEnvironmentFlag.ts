import { useCallback, useMemo } from 'react';
import { Environment, getInsightsEnvironment } from './Environment';
import { InsightsType } from './InsightsType';
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

  // Both elements can't be undefined because we are guarded by EnvironmentFlagSignature.
  // But we have to typecast because current declaration has both as possible undefined.
  return useFeatureFlag(resolver, ifTrue, ifFalse as any);
};

type InsightsEnvironmentFlagSignature = {
  <T>(
    insights: InsightsType,
    targetEnvironments: Environment | ReadonlyArray<Environment>,
    ifTrue: FeatureFlagCallback<T>,
    ifFalse?: FeatureFlagCallback<T>
  ): T | undefined;
  <T>(
    insights: InsightsType,
    targetEnvironments: Environment | ReadonlyArray<Environment>,
    ifTrue: FeatureFlagCallback<T> | undefined,
    ifFalse: FeatureFlagCallback<T>
  ): T | undefined;
};

export const useInsightsEnvironmentFlag: InsightsEnvironmentFlagSignature = <T>(
  insights: InsightsType,
  targetEnvironments: Environment | ReadonlyArray<Environment>,
  ifTrue: FeatureFlagCallback<T> | undefined,
  ifFalse: FeatureFlagCallback<T> | undefined
) => {
  const current = useMemo(() => getInsightsEnvironment(insights), [insights]);

  // Same as above
  return useEnvironmentFlag(
    current,
    targetEnvironments,
    ifTrue,
    ifFalse as FeatureFlagCallback<T>
  );
};
