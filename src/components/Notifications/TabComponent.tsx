import { Tab, Tabs, TabTitleText } from '@patternfly/react-core';
import React from 'react';

import { SplunkBetaEnvironmentBanner } from '../../pages/Banners/SplunkBetaEnvironment';
import { BundlePageBehaviorGroupContent } from '../../pages/Notifications/List/BundlePageBehaviorGroupContent';
import { Facet } from '../../types/Notification';
import { Main } from '../Store/Main';
import { TimeConfigComponent } from './TimeConfig';

interface TabProps {
    bundle: Facet;
    applications: Array<Facet>;
}

export const TabComponent: React.FunctionComponent<TabProps> = (props) => {

    const [ activeTabKey, setActiveTabKey ] = React.useState(0);

    const handleTabClick = React.useCallback((tabIndex) => {
        setActiveTabKey(tabIndex);
    }, []);

    return (
        <div>
            <Tabs defaultActiveKey={ activeTabKey } role="region" onClick={ handleTabClick } className="pf-u-mt-md">
                <Tab eventKey={ 0 } title={ <TabTitleText>Configuration</TabTitleText> }>
                    <Main>
                        <SplunkBetaEnvironmentBanner />
                        <BundlePageBehaviorGroupContent applications={ props.applications } bundle={ props.bundle } />
                    </Main>
                </Tab>
                <Tab eventKey={ 1 } title={ <TabTitleText>Settings</TabTitleText> }>
                    <TimeConfigComponent />
                </Tab>
            </Tabs>
        </div>
    );
};

