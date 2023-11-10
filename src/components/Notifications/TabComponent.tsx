import { Tabs } from '@patternfly/react-core';
import {
  global_BackgroundColor_100,
  global_spacer_lg,
} from '@patternfly/react-tokens';
import React from 'react';
import { style } from 'typestyle';

interface MyTabComponentProps {
  configuration: React.ReactNode;
  settings: React.ReactNode;
}

const backgroundColorClassName = style({
  backgroundColor: global_BackgroundColor_100.var,
});

const paddingLeftClassName = style({
  paddingLeft: global_spacer_lg.value,
});

export const TabComponent: React.FunctionComponent<MyTabComponentProps> = (
  props
) => {
  const [activeTabKey, setActiveTabKey] = React.useState(0);

  const handleTabClick = React.useCallback((tabIndex) => {
    setActiveTabKey(tabIndex);
  }, []);

  return (
    <div className={backgroundColorClassName}>
      <Tabs
        className={paddingLeftClassName}
        defaultActiveKey={activeTabKey}
        role="region"
        onClick={handleTabClick}
      >
        {props.children}
      </Tabs>
    </div>
  );
};
