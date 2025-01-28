import { toUtc } from '@redhat-cloud-services/insights-common-typescript';
import format from 'date-fns/format';
import * as React from 'react';

export interface UtcDateProps {
  date: Date;
  isUtc?: boolean;
}

const dateFormatString = 'dd MMM yyyy HH:mm:ss';

export const UtcDate: React.FunctionComponent<UtcDateProps> = (props) => {
  const { date, isUtc } = props;
  const formatted = React.useMemo(
    () => format(isUtc ? date : toUtc(date), dateFormatString),
    [date, isUtc]
  );

  return <>{formatted} UTC</>;
};

export function getDateDaysAgo(days: number): string {
  const today = new Date();
  const xDaysAgo = new Date(today.setDate(today.getDate() - days));
  return xDaysAgo.toISOString().split('.')[0];
}
