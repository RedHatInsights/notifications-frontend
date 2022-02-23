import { Split, SplitItem, StackItem } from '@patternfly/react-core';
import { Main, PageHeader, PageHeaderTitle } from '@redhat-cloud-services/frontend-components';
import { NotAuthorized } from '@redhat-cloud-services/frontend-components';
import { getInsights, localUrl } from '@redhat-cloud-services/insights-common-typescript';
import { default as React } from 'react';
import { useParams } from 'react-router-dom';

import { useApp } from '../../app/useApp';
import Config from '../../config/Config';
import { NotificationsListPage } from '../../pages/Notifications/List/Page';
import { Messages } from '../../properties/Messages';
import { getSubApp } from '../../utils/Basename';

interface NotificationsPermissionsParams {
    bundleName: string;
}

export const NotificationsPermissionsPage: React.FunctionComponent = () => {

    const { bundleName } = useParams<NotificationsPermissionsParams>();
    const { rbac } = useApp();
    const userPreferences = <a href={ localUrl(`/user-preferences/notifications/`,
        getInsights().chrome.isBeta()) }> User Preferences </a>;
    const myUserAccess = <a href={ localUrl(`/settings/my-user-access?bundle=rhel }`,
        getInsights().chrome.isBeta()) }> My User Access </a>;

    const pageHeaderTitleProps = {
        title: `${ Messages.pages.notifications.list.title } | ${ bundleName }`,
        paddingBottom: '8px'
    };

    const hasReadPermissions = React.useMemo(() => {
        const appId = getSubApp(location.pathname);
        switch (appId) {
            case Config.integrations.subAppId:
                return rbac?.canReadIntegrationsEndpoints;
            case Config.notifications.subAppId:
                return rbac?.canReadNotifications;
        }

        return false;
    }, [ rbac ]);

    return (
        <>
            { hasReadPermissions ? (
                <NotificationsListPage />) : (
                <><PageHeader>
                    <Split>
                        <SplitItem isFilled>
                            <PageHeaderTitle { ...pageHeaderTitleProps }></PageHeaderTitle>
                            <StackItem>This service allows you to configure which notifications different users within your organization
                                    will be entitled to receiving. To do this, create behavior groups and apply them to different events.
                                    Users will be able to opt-in or out of receiving authorized event notifications in their
                            {userPreferences}.</StackItem>
                        </SplitItem>
                    </Split>
                </PageHeader><Main>
                    <NotAuthorized
                        description={ <> Contact your organization administrator for more information or visit
                            {myUserAccess} to learn more about your permissions. To manage your notifications,
                                    go to your {userPreferences}.</> }
                        serviceName={ 'Notifications' } />
                </Main></>
            )} </>);
};

