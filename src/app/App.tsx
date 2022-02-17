import './App.scss';

import { Switch } from '@patternfly/react-core';
import { Main, PageHeader, PageHeaderTitle } from '@redhat-cloud-services/frontend-components';
import { Maintenance, NotAuthorized } from '@redhat-cloud-services/frontend-components';
import { NotificationsPortal } from '@redhat-cloud-services/frontend-components-notifications';
import { AppSkeleton, getInsights, InsightsEnvDetector, localUrl, RenderIfTrue, toUtc } from '@redhat-cloud-services/insights-common-typescript';
import format from 'date-fns/format';
import * as React from 'react';
import { useIntl } from 'react-intl';
import { useLocation } from 'react-router';
import { style } from 'typestyle';

import Config from '../config/Config';
import messages from '../properties/DefinedMessages';
import { Routes } from '../Routes';
import { staging } from '../types/Environments';
import { ServerStatus } from '../types/Server';
import { getSubApp } from '../utils/Basename';
import { AppContext } from './AppContext';
import { useApp } from './useApp';

const utcFormat = 'HH:mm';
const regularFormat = 'hh:mma';
const timezoneFormat = 'O';

const switchClassname = style({
    padding: 8
});

const App: React.ComponentType = () => {

    const intl = useIntl();
    const { rbac, server, isOrgAdmin } = useApp();
    const location = useLocation();
    const insights = getInsights();
    const [ usingExperimental, setUsingExperimental ] = React.useState<boolean>(false);

    const url = window.location.pathname;
    const filename = url.substring(url.lastIndexOf('/') + 1);
    const userPreferences = <a href={ localUrl(`/user-preferences/notifications/${ filename }`,
        getInsights().chrome.isBeta()) }> User Preferences </a>;
    const myUserAccess = <a href={ localUrl(`/settings/my-user-access?bundle=${ filename }`,
        getInsights().chrome.isBeta()) }> My User Access </a>;

    const serviceName = React.useMemo(() => {
        switch (getSubApp(location.pathname)) {
            case Config.integrations.subAppId:
                return intl.formatMessage(messages.integrations);
            case Config.notifications.subAppId:
                return intl.formatMessage(messages.notifications);
            default:
                return '';
        }
    }, [ intl, location.pathname ]);

    const pageHeaderTitleProps = {
        title: `${ serviceName }`
    };

    const hasReadPermissions = React.useMemo(() => {
        const appId = getSubApp(location.pathname);
        switch (appId) {
            case Config.integrations.subAppId:
                return rbac?.canWriteIntegrationsEndpoints;
            case Config.notifications.subAppId:
                return rbac?.canWriteNotifications;
        }

        return false;
    }, [ rbac, location.pathname ]);

    const toggleExperimental = React.useCallback((isEnabled) => {
        if (isEnabled) {
            (insights.chrome as any).getEnvironmentOriginal = insights.chrome.getEnvironment;
            insights.chrome.getEnvironment = () => 'ci';
        } else {
            insights.chrome.getEnvironment = ((insights.chrome as any).getEnvironmentOriginal as typeof insights.chrome.getEnvironment);
        }

        setUsingExperimental(isEnabled);
    }, [ insights ]);

    if (!rbac || !server) {
        return (
            <AppSkeleton />
        );
    }

    if (server.status === ServerStatus.MAINTENANCE) {

        const utcStartTime = format(toUtc(server.from), utcFormat);
        const utcEndTime = format(toUtc(server.to), utcFormat);
        const startTime = format(server.from, regularFormat);
        const endTime = format(server.to, regularFormat);
        const timezone = format(server.to, timezoneFormat);

        return <Maintenance
            utcStartTime={ utcStartTime }
            utcEndTime={ utcEndTime }
            startTime={ startTime }
            endTime={ endTime }
            timeZone={ timezone }
        />;
    }

    return (
        <AppContext.Provider value={ {
            rbac,
            server,
            isOrgAdmin: !!isOrgAdmin
        } }>
            { hasReadPermissions ? (
                <>
                    <NotificationsPortal />
                    <InsightsEnvDetector insights={ insights } onEnvironment={ staging }>
                        <RenderIfTrue>
                            <Switch
                                className={ switchClassname }
                                isChecked={ usingExperimental }
                                onChange={ toggleExperimental }
                                labelOff="Enable experimental features"
                                label="Disable experimental features"
                            />
                        </RenderIfTrue>
                    </InsightsEnvDetector>
                    <Routes />
                </>
            ) : (
                <>

                    <PageHeader>
                        <PageHeaderTitle { ...pageHeaderTitleProps }></PageHeaderTitle>
                    </PageHeader>
                    <Main>
                        <NotAuthorized
                            description={ <> Contact your organization administrator for more information or visit
                                { myUserAccess } to learn more about your permissions. To manage your notifications,
                        go to your { userPreferences }. </> }
                            serviceName={ serviceName }
                        />
                    </Main>
                </>
            ) }
        </AppContext.Provider>
    );
};

export default App;
