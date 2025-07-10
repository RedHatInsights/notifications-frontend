import { Icon } from '@patternfly/react-core';
import {
  CheckCircleIcon,
  ExclamationCircleIcon,
} from '@patternfly/react-icons';
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
      return (
        <Icon status="success">
          <CheckCircleIcon />
        </Icon>
      );
    case ConnectionAttemptType.FAILED:
      return (
        <Icon status="danger">
          <ExclamationCircleIcon />
        </Icon>
      );
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
      <span className="pf-v6-u-ml-xs">
        <DateFormat type="relative" date={props.date} />
      </span>
    </>
  );
};
