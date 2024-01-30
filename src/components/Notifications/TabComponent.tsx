import { Tabs } from '@patternfly/react-core';
import React from 'react';

interface MyTabComponentProps {
  configuration: React.ReactNode;
  settings: React.ReactNode;
}

export const TabComponent: React.FunctionComponent<React.PropsWithChildren<MyTabComponentProps>> = (
  props
) => {
  const [activeTabKey, setActiveTabKey] = React.useState(0);

  const handleTabClick = React.useCallback((tabIndex) => {
    setActiveTabKey(tabIndex);
  }, []);

  return (
    <div className="pf-v5-u-background-color-100">
      <Tabs
        className="pf-v5-u-pl-lg"
        defaultActiveKey={activeTabKey}
        role="region"
        onClick={handleTabClick}
      >
        {props.children}
      </Tabs>
    </div>
  );
};
