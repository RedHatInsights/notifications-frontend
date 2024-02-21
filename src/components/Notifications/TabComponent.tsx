import { Tabs } from '@patternfly/react-core';
import React from 'react';

interface MyTabComponentProps {
  configuration: React.ReactNode;
  settings: React.ReactNode;
  activeKey?: number;
}

export const TabComponent: React.FunctionComponent<
  React.PropsWithChildren<MyTabComponentProps>
> = ({ activeKey = 0, ...props }) => {
  const [activeTabKey, setActiveTabKey] = React.useState(activeKey);

  const handleTabSelect = (
    // eslint-disable-next-line
    event: React.MouseEvent<HTMLElement, MouseEvent>,
    tabIndex: number | string
  ) => {
    setActiveTabKey(tabIndex as number);
  };

  return (
    <div className="pf-v5-u-background-color-100">
      <Tabs
        className="pf-v5-u-pl-lg"
        activeKey={activeTabKey}
        role="region"
        onSelect={handleTabSelect}
      >
        {props.children}
      </Tabs>
    </div>
  );
};
