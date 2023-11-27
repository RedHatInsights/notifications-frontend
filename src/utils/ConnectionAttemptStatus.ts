import { IntegrationConnectionAttempt } from '../types/Integration';

export enum AggregatedConnectionAttemptStatus {
  UNKNOWN,
  SUCCESS,
  WARNING,
  ERROR,
}

export const aggregateConnectionAttemptStatus = (
  attempts: Array<IntegrationConnectionAttempt> | undefined
): AggregatedConnectionAttemptStatus => {
  if (!attempts || attempts.length === 0) {
    return AggregatedConnectionAttemptStatus.UNKNOWN;
  }

  const failures = attempts.filter((a) => !a.isSuccess).length;

  if (failures === attempts.length) {
    return AggregatedConnectionAttemptStatus.ERROR;
  } else if (failures > 0) {
    return AggregatedConnectionAttemptStatus.WARNING;
  }

  return AggregatedConnectionAttemptStatus.SUCCESS;
};
