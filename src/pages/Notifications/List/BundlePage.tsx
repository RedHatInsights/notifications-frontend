import { Button, ButtonVariant, Split, SplitItem } from '@patternfly/react-core';
import { Main, PageHeader, PageHeaderTitle } from '@redhat-cloud-services/frontend-components';
import {
    getInsights,
    InsightsEnvDetector,
    RenderIfFalse
} from '@redhat-cloud-services/insights-common-typescript';
import { default as React } from 'react';
import { Link } from 'react-router-dom';
import { style } from 'typestyle';

import { Messages } from '../../../properties/Messages';
import { linkTo } from '../../../Routes';
import { stagingAndProd } from '../../../types/Environments';
import { Facet } from '../../../types/Notification';
import { BundlePageBehaviorGroupContent } from './BundlePageBehaviorGroupContent';

interface NotificationListBundlePageProps {
    bundle: Facet;
    applications: Array<Facet>;
}

const displayInlineClassName = style({
    display: 'inline'
});

const ButtonLink: React.FunctionComponent<{ navigate: () => void }> = (props) => {
    return <Button variant={ ButtonVariant.secondary } onClick={ props.navigate }>{ props.children }</Button>;
};

export const NotificationListBundlePage: React.FunctionComponent<NotificationListBundlePageProps> = (props) => {

    const pageHeaderTitleProps = {
        className: displayInlineClassName,
        title: Messages.pages.notifications.list.title
    };

    return (
        <>
            <PageHeader>
                <Split>
                    <SplitItem isFilled><PageHeaderTitle { ...pageHeaderTitleProps } /></SplitItem>
                    <SplitItem>
                        <InsightsEnvDetector insights={ getInsights() } onEnvironment={ stagingAndProd }>
                            <RenderIfFalse>
                                <Link component={ ButtonLink } to={ linkTo.eventLog } >{ Messages.pages.notifications.list.viewHistory }</Link>
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
