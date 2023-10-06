import { ButtonVariant, Flex, FlexItem, Tab, Tabs, TabTitleText } from '@patternfly/react-core';
import { global_spacer_lg } from '@patternfly/react-tokens';
import { Main } from '@redhat-cloud-services/frontend-components';
import useChrome from '@redhat-cloud-services/frontend-components/useChrome';
import { useFlag } from '@unleash/proxy-client-react';
import { default as React, useEffect, useMemo, useState } from 'react';
import { style } from 'typestyle';

import { useAppContext } from '../../../app/AppContext';
import { ButtonLink } from '../../../components/ButtonLink';
import { TabComponent } from '../../../components/Notifications/TabComponent';
import { TimeConfigComponent } from '../../../components/Notifications/TimeConfig';
import { PageHeader } from '../../../components/PageHeader';
import { Messages } from '../../../properties/Messages';
import { linkTo } from '../../../Routes';
import { useGetApplicationsLazy } from '../../../services/Notifications/GetApplications';
import { Facet } from '../../../types/Notification';
import { BundlePageBehaviorGroupContent } from './BundlePageBehaviorGroupContent';

interface NotificationListBundlePageProps {
    bundle: Facet;
    bundleTabs: Facet[];
    applications: Array<Facet>;
}

export const NotificationListBundlePage: React.FunctionComponent<NotificationListBundlePageProps> = (props) => {

    const { updateDocumentTitle, isBeta } = useChrome();

    updateDocumentTitle?.(`${props.bundle.displayName} - Notifications`);

    const notificationsOverhaul = useFlag('platform.notifications.overhaul');

    const { rbac } = useAppContext();
    const eventLogPageUrl = React.useMemo(() => linkTo.eventLog(props.bundle.name), [ props.bundle.name ]);
    const getApplications = useGetApplicationsLazy();
    const [ activeTabKey, setActiveTabKey ] = useState(0);

    const mainPage = <Main>
        <BundlePageBehaviorGroupContent applications={ props.applications } bundle={ props.bundle } />
    </Main>;

    const paddingLeftClassName = style({
        paddingLeft: global_spacer_lg.value
    });

    const eventLogButton = () => {
        return notificationsOverhaul ? null :
            <ButtonLink isDisabled={ !rbac.canReadEvents } to={ eventLogPageUrl } variant={ ButtonVariant.secondary }>
                {Messages.pages.notifications.list.viewHistory}
            </ButtonLink>;
    };

    const pageTitle = () => {
        if (notificationsOverhaul) {
            return `Configure Events`;
        } else {
            return `${Messages.pages.notifications.list.title} | ${props.bundle.displayName}`;
        }
    };

    const timeConfigPage = <Main>
        <TimeConfigComponent />
    </Main>;

    useEffect(() => {
        const query = getApplications.query;
        query(props.bundleTabs[activeTabKey].name);
    }, [ activeTabKey, getApplications.query, props.bundleTabs ]);

    const getInitialApplications = useMemo(
        () => {
            if (getApplications.payload) {
                return getApplications.payload.value as Facet[];
            } else {
                return [];
            }
        }, [ getApplications.payload ]);

    if (notificationsOverhaul) {

        const handleTabClick = (event, tabIndex) => {
            setActiveTabKey(tabIndex);
        };

        return (
            <><PageHeader
                title={ pageTitle() }
                subtitle={ <span>This service allows you to configure which notifications different
                    users within your organization will be entitled to receiving. To do this, create behavior groups and apply
                <a href={ `${isBeta() ? '/preview' : ''}/user-preferences/notifications/${props.bundle.name}` }> User Preferences</a>.</span> }
                action={ eventLogButton() }
            />
            <Flex direction={ { default: 'column' } }>
                <FlexItem>
                    <Tabs activeKey={ activeTabKey } onSelect={ handleTabClick } className={ paddingLeftClassName }>
                        <Tab eventKey={ 0 } title={ <TabTitleText>Red Hat Enterprise Linux</TabTitleText> }>
                            <Main><BundlePageBehaviorGroupContent applications={ getInitialApplications } bundle={ props.bundleTabs[0] } /></Main>
                        </Tab>
                        <Tab eventKey={ 1 } title={ <TabTitleText>Console</TabTitleText> }>
                            <Main><BundlePageBehaviorGroupContent applications={ getInitialApplications } bundle={ props.bundleTabs[1] } /></Main>
                        </Tab>
                        <Tab eventKey={ 2 } title={ <TabTitleText>Openshift</TabTitleText> }>
                            <Main><BundlePageBehaviorGroupContent applications={ getInitialApplications } bundle={ props.bundleTabs[2] } /></Main>
                        </Tab>
                    </Tabs>
                </FlexItem>
            </Flex>
            </>
        );
    } else {
        return (
            <><PageHeader
                title={ `${Messages.pages.notifications.list.title} | ${props.bundle.displayName}` }
                subtitle={ <span>This service allows you to configure which notifications different
                    users within your organization will be entitled to receiving. To do this, create behavior groups and apply
                    them to different events. Users will be able to opt-in or out of receiving authorized event notifications in their
                <a href={ `${isBeta() ? '/preview' : ''}/user-preferences/notifications/${props.bundle.name}` }> User Preferences</a>.</span> }
                action={ eventLogButton() }
            />

            <TabComponent configuration={ props.children } settings={ props.children }>
                <Tab eventKey={ 0 } title={ <TabTitleText>Configuration</TabTitleText> }>
                    {mainPage}
                </Tab>
                <Tab eventKey={ 1 } title={ <TabTitleText>Settings</TabTitleText> }>
                    {timeConfigPage}
                </Tab>
            </TabComponent>
            </>
        );
    }
};
