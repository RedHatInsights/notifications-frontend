import {
  TableComposable,
  TableVariant,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from '@patternfly/react-table';
import { important } from 'csx';
import * as React from 'react';
import { style } from 'typestyle';

const removeBorderBottomClass = style({
  borderBottom: important('none'),
});

export interface TableHelpProps {
  tableBody: ReadonlyArray<[React.ReactNode, React.ReactNode]>;
}

export const TableHelp: React.FunctionComponent<TableHelpProps> = (props) => {
  return (
    <TableComposable variant={TableVariant.compact} borders={false}>
      <Thead>
        <Tr className={removeBorderBottomClass}>
          <Th>Status</Th>
          <Th>Meaning</Th>
        </Tr>
      </Thead>
      <Tbody>
        {props.tableBody.map(([status, meaning], index) => (
          <Tr key={index}>
            <Td>{tb[0]}</Td>
            <Td>{tb[1]}</Td>
          </Tr>
        ))}
      </Tbody>
    </TableComposable>
  );
};
