import React from 'react';
import { Skeleton, Spinner } from '@patternfly/react-core';
import {
  Table as TableComposable,
  TableVariant,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from '@patternfly/react-table/dist/dynamic/components/Table';
import useFieldApi, {
  UseFieldApiProps,
} from '@data-driven-forms/react-form-renderer/use-field-api';

export interface TableRow {
  id: string;
  [key: string]: unknown;
}

export interface SelectableTableProps<T extends TableRow>
  extends UseFieldApiProps<T[]> {
  name: string;
  data?: ReadonlyArray<T>;
  columns: { name: string; key: string }[];
  onSelect?: (isSelected: boolean, row: T) => void;
  selectionLoading?: boolean;
  skeletonRows?: number;
}

const SelectableTable = <T extends TableRow>(
  props: SelectableTableProps<T>
) => {
  const {
    input,
    data = [],
    onSelect,
    selectionLoading,
    columns,
    skeletonRows = 10,
  } = useFieldApi(props);

  const inputValue = input.value || [];

  const handleSelect = (isSelected: boolean, row: T) => {
    if (onSelect) {
      onSelect(isSelected, row);
    }
    input.onChange(
      isSelected
        ? [...inputValue, row]
        : inputValue.filter((selectedRow) => selectedRow.id !== row.id)
    );
  };

  return (
    <TableComposable variant={TableVariant.compact}>
      <Thead>
        <Tr>
          <Th />
          {columns.map((column) => (
            <Th key={column.key}>{column.name}</Th>
          ))}
        </Tr>
      </Thead>
      <Tbody>
        {data.length === 0
          ? [...Array(skeletonRows)].map((_, index) => (
              <Tr key={index}>
                <Td
                  select={{
                    isSelected: false,
                    rowIndex: index,
                    isDisabled: true,
                  }}
                />
                {columns.map((column) => (
                  <Td key={column.key}>
                    <Skeleton width="80%" />
                  </Td>
                ))}
              </Tr>
            ))
          : data.map((row, rowIndex) => (
              <Tr key={row.id}>
                <Td
                  modifier={selectionLoading ? 'fitContent' : undefined}
                  noPadding={selectionLoading}
                  select={
                    selectionLoading
                      ? undefined
                      : {
                          rowIndex,
                          onSelect: (_event, isSelected) =>
                            handleSelect(isSelected, row),
                          isSelected: inputValue.some(
                            (selectedRow) => selectedRow.id === row.id
                          ),
                          isDisabled: selectionLoading,
                        }
                  }
                >
                  {selectionLoading && <Spinner size="sm" />}
                </Td>
                {columns.map((column) => (
                  <Td key={column.key}>{row[column.key]}</Td>
                ))}
              </Tr>
            ))}
      </Tbody>
    </TableComposable>
  );
};

export default SelectableTable;
