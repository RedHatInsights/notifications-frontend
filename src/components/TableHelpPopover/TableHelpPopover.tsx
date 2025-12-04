import { Content, Popover } from '@patternfly/react-core';
import * as React from 'react';
import { TableHelp } from './TableHelp';

export interface TableHelpPopoverProps {
  title: string | React.ReactNode;
  tableBody: ReadonlyArray<[React.ReactNode, React.ReactNode]>;
}

const getHeaderContent = (title: string | React.ReactNode): React.ReactNode => {
  if (typeof title === 'string') {
    return (
      <Content>
        <Content component="h6">{title}</Content>
      </Content>
    );
  }

  return title;
};

export const TableHelpPopover: React.FunctionComponent<
  React.PropsWithChildren<TableHelpPopoverProps>
> = (props) => {
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
