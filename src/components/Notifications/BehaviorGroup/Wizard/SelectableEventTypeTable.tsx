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
import * as React from 'react';

import { EventType } from '../../../../types/Notification';

const skeletonRows = 10;

export interface SelectableEventTypeRow extends EventType {
  isSelected: boolean;
}

interface SelectableEventTypeTableBaseProps {
  onSelect?: (isSelected: boolean, event: EventType) => void;
  selectionLoading?: boolean;
}

interface SelectableEventTypeTableImplProps
  extends SelectableEventTypeTableBaseProps {
  events: ReadonlyArray<SelectableEventTypeRow>;
}

export interface SelectableEventTypeTableProps
  extends SelectableEventTypeTableBaseProps {
  events?: ReadonlyArray<SelectableEventTypeRow>;
}

const SelectableEventTypeTableLayout: React.FunctionComponent<
  React.PropsWithChildren
> = (props) => {
  return (
    <TableComposable variant={TableVariant.compact}>
      <Thead>
        <Tr>
          <Th />
          <Th>Event type</Th>
          <Th>Service</Th>
        </Tr>
      </Thead>
      <Tbody>{props.children}</Tbody>
    </TableComposable>
  );
};

const SelectableEventTypeTableSkeleton: React.FunctionComponent = () => {
  return (
    <SelectableEventTypeTableLayout>
      {[...Array(skeletonRows)].map((_unused, index) => (
        <Tr key={index}>
          <Td
            select={{
              isSelected: false,
              rowIndex: index,
              isDisabled: true,
            }}
          />
          <Td>
            <Skeleton width="80%" />
          </Td>
          <Td>
            <Skeleton width="80%" />
          </Td>
        </Tr>
      ))}
    </SelectableEventTypeTableLayout>
  );
};

const SelectableEventTypeTableImpl: React.FunctionComponent<
  SelectableEventTypeTableImplProps
> = (props) => {
  return (
    <SelectableEventTypeTableLayout>
      {props.events.map((event, rowIndex) => (
        <Tr key={event.id}>
          <Td
            modifier={props.selectionLoading ? 'fitContent' : undefined}
            noPadding={props.selectionLoading}
            select={
              props.selectionLoading
                ? undefined
                : {
                    rowIndex,
                    onSelect: (_event, isSelected) =>
                      props.onSelect && props.onSelect(isSelected, event),
                    isSelected: event.isSelected,
                    isDisabled: props.selectionLoading,
                  }
            }
          >
            {props.selectionLoading && <Spinner size="sm" />}
          </Td>
          <Td>{event.eventTypeDisplayName}</Td>
          <Td>{event.applicationDisplayName}</Td>
        </Tr>
      ))}
    </SelectableEventTypeTableLayout>
  );
};

export const SelectableEventTypeTable: React.FunctionComponent<
  SelectableEventTypeTableProps
> = (props) => {
  if (props.events) {
    return <SelectableEventTypeTableImpl {...props} events={props.events} />;
  }

  return <SelectableEventTypeTableSkeleton />;
};
