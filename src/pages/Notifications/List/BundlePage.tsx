import { Split, SplitItem, StackItem } from '@patternfly/react-core';
import { Main, PageHeader, PageHeaderTitle } from '@redhat-cloud-services/frontend-components';
import {
    getInsights,
    InsightsEnvDetector,
    localUrl,
    RenderIfFalse
} from '@redhat-cloud-services/insights-common-typescript';
import { default as React } from 'react';
import { Link } from 'react-router-dom';
import { style } from 'typestyle';

import { ButtonLink } from '../../../components/ButtonLink';
import { Messages } from '../../../properties/Messages';
import { linkTo } from '../../../Routes';
import { stagingAndProdStable } from '../../../types/Environments';
import { Facet } from '../../../types/Notification';
import { BundlePageBehaviorGroupContent } from './BundlePageBehaviorGroupContent';

interface NotificationListBundlePageProps {
    bundle: Facet;
    applications: Array<Facet>;
}

const displayInlineClassName = style({
    display: 'inline'
});

export const NotificationListBundlePage: React.FunctionComponent<NotificationListBundlePageProps> = (props) => {

    const pageHeaderTitleProps = {
        className: displayInlineClassName,
        title: Messages.pages.notifications.list.title + props.bundle.displayName
    };

    const eventLogPageUrl = React.useMemo(() => linkTo.eventLog(props.bundle.name), [ props.bundle.name ]);

    return (
        <>
            <PageHeader>
                <Split>
                    <SplitItem isFilled><PageHeaderTitle { ...pageHeaderTitleProps } />
                        <StackItem>This service allows you to configure which notifications different users within your organization
                            will be entitled to receiving. To do this, create behavior groups and apply them to different events.
                            Users will be able to opt-in or out of receiving authorized event notifications in their
                        <a href={ localUrl(`/user-preferences/notifications/${props.bundle.name}`,
                            getInsights().chrome.isBeta()) }> User Preferences</a>. </StackItem>
                    </SplitItem>
                    <SplitItem>
                        <InsightsEnvDetector insights={ getInsights() } onEnvironment={ stagingAndProdStable }>
                            <RenderIfFalse>
                                <Link component={ ButtonLink } to={ eventLogPageUrl } >{ Messages.pages.notifications.list.viewHistory }</Link>
                            </RenderIfFalse>
                        </InsightsEnvDetector>
                    </SplitItem>
                </Split>
            </PageHeader>
            <Main>
                <BundlePageBehaviorGroupContent applications={ props.applications } bundle={ props.bundle } />
            </Main>
        </>
    );
};
