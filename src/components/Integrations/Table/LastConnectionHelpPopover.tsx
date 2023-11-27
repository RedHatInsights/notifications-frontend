import * as React from 'react';

import { TableHelpPopover } from '../../TableHelpPopover/TableHelpPopover';
import {
  StatusCreationFailure,
  StatusEventFailure,
  StatusProcessing,
  StatusReady,
  StatusSuccess,
} from './IntegrationStatus';

const tableData: ReadonlyArray<[React.ReactNode, React.ReactNode]> = [
  [
    <StatusSuccess key="status-success" />,
    'The last connection attempt succeeded',
  ],
  [
    <StatusEventFailure key="status-event-failure" />,
    'The last connection attempt failed',
  ],
  [
    <StatusCreationFailure key="status-creation-failure" />,
    'Integration creation failed. Configuration error',
  ],
  [
    <StatusReady key="status-ready" />,
    'Your integration configuration was successful',
  ],
  [
    <StatusProcessing key="status-processing" />,
    'Integration configuration processing',
  ],
];

export const LastConnectionHelpPopover: React.FunctionComponent<unknown> = (
  props
) => (
  <TableHelpPopover
    title="Last connection attempt status meanings"
    tableBody={tableData}
  >
    <>{props.children}</>
  </TableHelpPopover>
);
