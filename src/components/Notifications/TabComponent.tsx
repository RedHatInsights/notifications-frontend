import { Tab, Tabs, TabTitleText } from '@patternfly/react-core';
import React from 'react';

interface MyTabComponentProps {
    elements: Array<React.ReactNode>;
  }

export const TabComponent: React.FunctionComponent<MyTabComponentProps> = (props) => {
    const [ activeTabKey, setActiveTabKey ] = React.useState(0);

    const handleTabClick = React.useCallback((tabIndex) => {
        setActiveTabKey(tabIndex);
    }, []);

    return (
        <div>
            <Tabs defaultActiveKey={ activeTabKey } role="region" onClick={ handleTabClick } className="pf-u-mt-md">
                <Tab eventKey={ 0 } title={ <TabTitleText>Configuration</TabTitleText> }>
                    { props.elements}
                </Tab>
                <Tab eventKey={ 1 } title={ <TabTitleText>Settings</TabTitleText> }>
                    { props.elements }
                </Tab>
            </Tabs>
        </div>
    );
};

