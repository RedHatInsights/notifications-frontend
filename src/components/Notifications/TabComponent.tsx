import { Tab, Tabs, TabTitleText } from '@patternfly/react-core';
import React from 'react';

import { SplunkBetaEnvironmentBanner } from '../../pages/Banners/SplunkBetaEnvironment';
import { BundlePageBehaviorGroupContent } from '../../pages/Notifications/List/BundlePageBehaviorGroupContent';
import { Main } from '../Store/Main';

export const TabComponent: React.FunctionComponent = () => {

    const [ activeTabKey, setActiveTabKey ] = React.useState(0);

    const handleTabClick = React.useCallback((tabIndex) => {
        setActiveTabKey(tabIndex);
    }, []);

    return (
        <div>
            <Tabs activeKey={ activeTabKey } onSelect={ handleTabClick } className="pf-u-mt-md">
                <Tab eventKey={ 0 } title={ <TabTitleText>Configuration</TabTitleText> }> main
                    {/* <Main>
                        <SplunkBetaEnvironmentBanner />
                        <BundlePageBehaviorGroupContent applications={ props.applications } bundle={ props.bundle } />
                    </Main> */}
                </Tab>
                <Tab eventKey={ 1 } title={ <TabTitleText>Settings</TabTitleText> }>
                    settings
                </Tab>
            </Tabs>
        </div>
    );
};

