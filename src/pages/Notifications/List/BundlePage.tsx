import { ButtonVariant, Tab, TabTitleText } from '@patternfly/react-core';
import { Main } from '@redhat-cloud-services/frontend-components';
import useChrome from '@redhat-cloud-services/frontend-components/useChrome';
import {
    getInsights,
    localUrl
} from '@redhat-cloud-services/insights-common-typescript';
import { useFlag } from '@unleash/proxy-client-react';
import { default as React, useMemo } from 'react';

import { useAppContext } from '../../../app/AppContext';
import { AppSkeleton } from '../../../app/AppSkeleton';
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

    const { updateDocumentTitle } = useChrome();

    updateDocumentTitle?.(`${props.bundle.displayName} - Notifications`);

    const notificationsOverhaul = useFlag('platform.notifications.overhaul');

    const { rbac } = useAppContext();
    const eventLogPageUrl = React.useMemo(() => linkTo.eventLog(props.bundle.name), [ props.bundle.name ]);
    const getApplications = useGetApplicationsLazy(); 

    const bundleApplications: Map<string, Array<Facet> | null | undefined > = new Map();

    const mainPage = <Main>
        <BundlePageBehaviorGroupContent applications={ props.applications } bundle={ props.bundle } />
    </Main>;

    const eventLogButton = () => {
        return notificationsOverhaul ? null :
            <ButtonLink isDisabled={ !rbac.canReadEvents } to={ eventLogPageUrl } variant={ ButtonVariant.secondary }>
                {Messages.pages.notifications.list.viewHistory}
            </ButtonLink>;
    };

    const pageTitle = () => {
        if(notificationsOverhaul) {
            console.log(props.bundle)
            return `Configure Events`;
        } else {
            return `${Messages.pages.notifications.list.title} | ${props.bundle.displayName}`;
        }
    }

    const timeConfigPage = <Main>
        <TimeConfigComponent />
    </Main>;

    if (notificationsOverhaul) {

        // const getBundleApplications = (bundleName) => {
        //     getApplications.query(bundleName)
        //     if (getApplications.payload) {
        //         if(getApplications.payload.status === 200) {
        //             return (getApplications.payload.value as Array<Facet>)
        //         } else {
        //             return [];
        //         }
        //     } else {
        //         return [];
        //     }
        // }

        // if(!getBundleApplications) {
        //     return (
        //         <AppSkeleton />
        //     );
        // }

        return (
            <><PageHeader
                title={ pageTitle() }
                subtitle={ <span>This service allows you to configure which notifications different
                    users within your organization will be entitled to receiving. To do this, create behavior groups and apply
                <a href={ localUrl(`/user-preferences/notifications/${props.bundle.name}`,
                    getInsights().chrome.isBeta()) }> User Preferences</a>.</span> }
                action={ eventLogButton() }
            />

            <TabComponent configuration={ props.children } settings={ props.children }>
                <Tab eventKey={ 0 } title={ <TabTitleText>Openshift</TabTitleText> }>
                    <Main>
                        <BundlePageBehaviorGroupContent applications={ props.applications } bundle={ props.bundleTabs[0] } />
                    </Main>;
                </Tab>
                <Tab eventKey={ 1 } title={ <TabTitleText>Red Hat Enterprise Linux</TabTitleText> }>
                    <Main>
                        <BundlePageBehaviorGroupContent applications={ props.applications } bundle={ props.bundleTabs[1] } />
                    </Main>;
                </Tab>
                <Tab eventKey={ 2 } title={ <TabTitleText>Console</TabTitleText> }>
                    <Main>
                        <BundlePageBehaviorGroupContent applications={ props.applications } bundle={ props.bundleTabs[2] } />
                    </Main>;
                </Tab>
            </TabComponent>
            </>
        );
    } else {
        return (
            <><PageHeader
                title={ `${Messages.pages.notifications.list.title} | ${props.bundle.displayName}` }
                subtitle={ <span>This service allows you to configure which notifications different
                    users within your organization will be entitled to receiving. To do this, create behavior groups and apply
                    them to different events. Users will be able to opt-in or out of receiving authorized event notifications in their
                <a href={ localUrl(`/user-preferences/notifications/${props.bundle.name}`,
                    getInsights().chrome.isBeta()) }> User Preferences</a>.</span> }
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
