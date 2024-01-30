import { Popover, Text, TextContent } from '@patternfly/react-core';
import * as React from 'react';
import { TableHelp } from './TableHelp';

export interface TableHelpPopoverProps {
  title: string | React.ReactNode;
  tableBody: ReadonlyArray<[React.ReactNode, React.ReactNode]>;
}

const getHeaderContent = (title: string | React.ReactNode): React.ReactNode => {
  if (typeof title === 'string') {
    return (
      <TextContent>
        <Text component="h6">{title}</Text>
      </TextContent>
    );
  }

  return title;
};

export const TableHelpPopover: React.FunctionComponent<TableHelpPopoverProps> =
  (props) => {
    return (
      <Popover
        hasAutoWidth
        headerContent={getHeaderContent(props.title)}
        bodyContent={<TableHelp tableBody={props.tableBody} />}
      >
        <>{props.children}</>
      </Popover>
    );
  };
