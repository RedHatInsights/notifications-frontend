import * as React from 'react';

import {
  StatusCreationFailure,
  StatusEventFailure,
  StatusProcessing,
  StatusReady,
  StatusSuccess,
} from './IntegrationStatus';
import { TableHelp } from '../../TableHelpPopover/TableHelp';

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

export const LastConnectionHelpTable: React.FunctionComponent<unknown> = (
  props
) => (
  <TableHelp tableBody={tableData}>
    <>{props.children}</>
  </TableHelp>
);
