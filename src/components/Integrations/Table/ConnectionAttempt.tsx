import {
  CheckCircleIcon,
  ExclamationCircleIcon,
} from '@patternfly/react-icons';
import {
  global_danger_color_100,
  global_success_color_100,
} from '@patternfly/react-tokens';
import DateFormat from '@redhat-cloud-services/frontend-components/DateFormat';
import { assertNever } from 'assert-never';
import * as React from 'react';

export interface ConnectionAttemptProps {
  type: ConnectionAttemptType;
  date: Date;
}

export enum ConnectionAttemptType {
  SUCCESS,
  FAILED,
}

const getIcon = (type: ConnectionAttemptType) => {
  switch (type) {
    case ConnectionAttemptType.SUCCESS:
      return <CheckCircleIcon color={global_success_color_100.value} />;
    case ConnectionAttemptType.FAILED:
      return <ExclamationCircleIcon color={global_danger_color_100.value} />;
    default:
      assertNever(type);
  }
};

export const ConnectionAttempt: React.FunctionComponent<
  ConnectionAttemptProps
> = (props) => {
  return (
    <>
      {getIcon(props.type)}
      <span className="pf-v5-u-ml-xs">
        <DateFormat type="relative" date={props.date} />
      </span>
    </>
  );
};
