import { Skeleton, Spinner, Text } from '@patternfly/react-core';
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
          <Td expand={{ rowIndex: index, isExpanded: false }} />
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

const SelectableEventTypeTableRow: React.FunctionComponent<{
  event: SelectableEventTypeRow;
  rowIndex: number;
  onSelect?: (isSelected: boolean, event: EventType) => void;
  selectionLoading?: boolean;
}> = ({ event, rowIndex, onSelect, selectionLoading }) => {
  const [isExpanded, setIsExpanded] = React.useState(false);

  return (
    <>
      <Tr key={event.id}>
        {event.description ? (
          <Td
            expand={{
              rowIndex: rowIndex,
              isExpanded,
              onToggle: () => setIsExpanded(!isExpanded),
              expandId: `expandable-toggle-${event.id}`,
            }}
          />
        ) : (
          <Td />
        )}
        <Td
          modifier={selectionLoading ? 'fitContent' : undefined}
          noPadding={selectionLoading}
          select={
            selectionLoading
              ? undefined
              : {
                  rowIndex: rowIndex,
                  onSelect: (_event, isSelected) =>
                    onSelect && onSelect(isSelected, event),
                  isSelected: event.isSelected,
                  isDisabled: selectionLoading,
                }
          }
        >
          {selectionLoading && <Spinner size="sm" />}
        </Td>
        <Td>{event.eventTypeDisplayName}</Td>
        <Td>{event.applicationDisplayName}</Td>
      </Tr>
      {event.description && isExpanded && (
        <Tr>
          <Td colSpan={2} />
          <Td colSpan={2}>
            <Text className="pf-v5-u-color-200 pf-v5-u-p-0">
              {event.description}
            </Text>
          </Td>
        </Tr>
      )}
    </>
  );
};

export const SelectableEventTypeTable: React.FunctionComponent<
  SelectableEventTypeTableProps
> = (props) =>
  props.events ? (
    <SelectableEventTypeTableLayout>
      {props.events.map((event, rowIndex) => (
        <SelectableEventTypeTableRow
          key={event.id}
          event={event}
          rowIndex={rowIndex}
          onSelect={props.onSelect}
          selectionLoading={props.selectionLoading}
        />
      ))}
    </SelectableEventTypeTableLayout>
  ) : (
    <SelectableEventTypeTableSkeleton />
  );
