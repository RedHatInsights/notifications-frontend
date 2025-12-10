import { useMemo } from 'react';

export type FeatureFlagCallback<T> = () => T;
export type FeatureFlagSignature = {
  <T>(
    resolver: () => boolean,
    ifTrue: FeatureFlagCallback<T>,
    ifFalse?: FeatureFlagCallback<T>
  ): T | undefined;
  <T>(
    resolver: () => boolean,
    ifTrue: FeatureFlagCallback<T> | undefined,
    ifFalse: FeatureFlagCallback<T>
  ): T | undefined;
};

export const useFeatureFlag: FeatureFlagSignature = <T>(
  resolver: () => boolean,
  ifTrue: FeatureFlagCallback<T> | undefined,
  ifFalse: FeatureFlagCallback<T> | undefined
) => {
  return useMemo(() => {
    if (resolver()) {
      return ifTrue && ifTrue();
    }

    return ifFalse && ifFalse();
  }, [resolver, ifTrue, ifFalse]);
};
