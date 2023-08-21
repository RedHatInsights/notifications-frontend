import { ButtonVariant, Tab, TabTitleText } from '@patternfly/react-core';
import { Main } from '@redhat-cloud-services/frontend-components';
import useChrome from '@redhat-cloud-services/frontend-components/useChrome';
import {
    getInsights, getInsightsEnvironment,
    localUrl
} from '@redhat-cloud-services/insights-common-typescript';
import { useFlag } from '@unleash/proxy-client-react';
import { default as React } from 'react';

import { useAppContext } from '../../../app/AppContext';
import { ButtonLink } from '../../../components/ButtonLink';
import { TabComponent } from '../../../components/Notifications/TabComponent';
import { TimeConfigComponent } from '../../../components/Notifications/TimeConfig';
import { PageHeader } from '../../../components/PageHeader';
import { Messages } from '../../../properties/Messages';
import { linkTo } from '../../../Routes';
import { stagingAndProdBeta } from '../../../types/Environments';
import { Facet } from '../../../types/Notification';
import { BundlePageBehaviorGroupContent } from './BundlePageBehaviorGroupContent';

interface NotificationListBundlePageProps {
    bundle: Facet;
    applications: Array<Facet>;
}

export const NotificationListBundlePage: React.FunctionComponent<NotificationListBundlePageProps> = (props) => {

    const { updateDocumentTitle } = useChrome();

    updateDocumentTitle?.(`${props.bundle.displayName} - Notifications`);

    const notificationsOverhaul = useFlag('platform.notifications.overhaul');

    const { rbac } = useAppContext();
    const eventLogPageUrl = React.useMemo(() => linkTo.eventLog(props.bundle.name), [ props.bundle.name ]);
    const insights = getInsights();
    const isProdOrStageBeta = stagingAndProdBeta.includes(getInsightsEnvironment(insights));

    const mainPage = <Main>
        <BundlePageBehaviorGroupContent applications={ props.applications } bundle={ props.bundle } />
    </Main>;

    const eventLogButton = () => {
        console.log(notificationsOverhaul)
        return notificationsOverhaul ? null : <ButtonLink isDisabled={ !rbac.canReadEvents } to={ eventLogPageUrl } variant={ ButtonVariant.secondary }>
            {Messages.pages.notifications.list.viewHistory}
        </ButtonLink>
    }

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

        { isProdOrStageBeta ? (
            <TabComponent configuration={ props.children } settings={ props.children }>
                <Tab eventKey={ 0 } title={ <TabTitleText>Configuration</TabTitleText> }>
                    {mainPage}
                </Tab>
                <Tab eventKey={ 1 } title={ <TabTitleText>Settings</TabTitleText> }>
                    <Main>
                        <TimeConfigComponent />
                    </Main>
                </Tab>
            </TabComponent>
        ) : mainPage }
        </>
    );
};
