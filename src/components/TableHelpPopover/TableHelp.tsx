import {
  Table,
  TableVariant,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from '@patternfly/react-table/dist/dynamic/components/Table';
import { important } from 'csx';
import * as React from 'react';
import { defineMessages, useIntl } from 'react-intl';
import { style } from 'typestyle';

const messages = defineMessages({
  status: {
    id: 'tableHelp.status',
    defaultMessage: 'Status',
  },
  meaning: {
    id: 'tableHelp.meaning',
    defaultMessage: 'Meaning',
  },
});

const removeBorderBottomClass = style({
  borderBottom: important('none'),
});

export interface TableHelpProps {
  tableBody: ReadonlyArray<[React.ReactNode, React.ReactNode]>;
}

export const TableHelp: React.FunctionComponent<React.PropsWithChildren<TableHelpProps>> = (
  props
) => {
  const intl = useIntl();
  return (
    <Table variant={TableVariant.compact} borders={false}>
      <Thead>
        <Tr className={removeBorderBottomClass}>
          <Th>{intl.formatMessage(messages.status)}</Th>
          <Th>{intl.formatMessage(messages.meaning)}</Th>
        </Tr>
      </Thead>
      <Tbody>
        {props.tableBody.map(([status, meaning], index) => (
          <Tr key={index}>
            <Td>{status}</Td>
            <Td>{meaning}</Td>
          </Tr>
        ))}
      </Tbody>
    </Table>
  );
};
