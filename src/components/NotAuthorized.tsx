import { Skeleton, Split, SplitItem, StackItem } from '@patternfly/react-core';
import { Main, PageHeader, PageHeaderTitle } from '@redhat-cloud-services/frontend-components';
import { NotAuthorized } from '@redhat-cloud-services/frontend-components';
import { getInsights, localUrl } from '@redhat-cloud-services/insights-common-typescript';
import { default as React, useMemo } from 'react';
import { useIntl } from 'react-intl';
import { useLocation, useParams } from 'react-router-dom';

import Config from '../config/Config';
import messages from '../properties/DefinedMessages';
import { linkTo } from '../Routes';
import { useGetBundles } from '../services/Notifications/GetBundles';
import { Facet } from '../types/Notification';
import { getSubApp } from '../utils/Basename';

interface NotificationListPageParams {
    bundleName: string;
}

const eventLogService = 'Event Log';

export const NotAuthorizedPage: React.FunctionComponent = () => {

    const { bundleName } = useParams<NotificationListPageParams>();
    const getBundles = useGetBundles();
    const bundles: Facet | undefined = useMemo (() => {
        if (getBundles.payload?.status === 200) {
            return getBundles.payload.value.find(b => b.name === bundleName);
        }
    }, [ bundleName, getBundles.payload?.status, getBundles.payload?.value ]);

    const location = useLocation();
    const intl = useIntl();

    const userPreferences = <a href={ localUrl(`/user-preferences/notifications/`,
        getInsights().chrome.isBeta()) }> User Preferences</a>;
    const myUserAccess = <a href={ localUrl(`/settings/my-user-access?bundle=rhel }`,
        getInsights().chrome.isBeta()) }> My User Access </a>;

    const serviceName = React.useMemo(() => {
        switch (getSubApp(location.pathname)) {
            case Config.integrations.subAppId:
                return intl.formatMessage(messages.integrations);
            case Config.notifications.subAppId:
                if (location.pathname === linkTo.eventLog()) {
                    return eventLogService;
                }

                return intl.formatMessage(messages.notifications);
            default:
                return '';
        }
    }, [ intl, location.pathname ]);

    const pageHeaderTitleProps = {
        paddingBottom: '8px'
    };

    const title = React.useMemo(() => {
        if (serviceName === 'Notifications') {
            return `${ serviceName } | ${ bundles ? bundles.displayName : <Skeleton /> }`;
        } else {
            return `${ serviceName }`;
        }
    }, [ bundles, serviceName ]);

    const description = React.useMemo(() => {
        if (serviceName === 'Notifications') {
            return <span>This service allows you to configure which notifications different users within your organization
            will be entitled to receiving. To do this, create behavior groups and apply them to different events.
            Users will be able to opt-in or out of receiving authorized event notifications in their
            { <a href={ localUrl(`/user-preferences/notifications/`,
                getInsights().chrome.isBeta()) }> User Preferences</a>}.</span>;
        } else {
            return <span></span>;
        }
    }, [ serviceName ]);

    return (
        <>
            <PageHeader>
                <Split>
                    <SplitItem isFilled>
                        <PageHeaderTitle title={ title }
                            { ...pageHeaderTitleProps }> </PageHeaderTitle>
                        <StackItem>{ description }</StackItem>
                    </SplitItem>
                </Split>
            </PageHeader>
            <Main>
                <NotAuthorized
                    description={ <> Contact your organization administrator for more information or visit
                        {myUserAccess} to learn more about your permissions. To manage your notifications,
                        go to your {userPreferences}.</> }
                    serviceName={ serviceName } />
            </Main>
        </>);
};

