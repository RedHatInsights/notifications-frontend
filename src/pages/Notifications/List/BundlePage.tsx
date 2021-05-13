import { Button, ButtonVariant, FormGroup, Switch } from '@patternfly/react-core';
import { FlaskIcon } from '@patternfly/react-icons';
import { Main, PageHeader, PageHeaderTitle } from '@redhat-cloud-services/frontend-components';
import {
    getInsights,
    InsightsEnvDetector, RenderIf,
    RenderIfFalse, RenderIfTrue
} from '@redhat-cloud-services/insights-common-typescript';
import { default as React } from 'react';
import { style } from 'typestyle';

import { Messages } from '../../../properties/Messages';
import { stagingAndProd } from '../../../types/Environments';
import { Facet } from '../../../types/Notification';
import { BundlePageBehaviorGroupContent } from './BundlePageBehaviorGroupContent';
import { BundlePageContent } from './BundlePageContent';

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
        title: Messages.pages.notifications.list.title
    };

    const [ isUsingBehaviorGroup, setUsingBehaviorGroup ] = React.useState<boolean>(false);
    const renderIfUsingBehaviorGroupResolver = React.useCallback(() => isUsingBehaviorGroup, [ isUsingBehaviorGroup ]);

    return (
        <>
            <PageHeader>
                <PageHeaderTitle { ...pageHeaderTitleProps } />
                <InsightsEnvDetector insights={ getInsights() } onEnvironment={ stagingAndProd }>
                    <RenderIfFalse>
                        <Button variant={ ButtonVariant.link }>{ Messages.pages.notifications.list.viewHistory }</Button>
                    </RenderIfFalse>
                </InsightsEnvDetector>
                <InsightsEnvDetector insights={ getInsights() } onEnvironment={ stagingAndProd }>
                    <RenderIfFalse>
                        <FormGroup fieldId="use-behavior-group-check">
                            <Switch
                                id="use-behavior-group-check"
                                isChecked={ isUsingBehaviorGroup }
                                label={ <>
                                    <FlaskIcon />
                                    <span>Use behavior groups</span>
                                </> }
                                onChange={ setUsingBehaviorGroup }
                            />
                        </FormGroup>
                    </RenderIfFalse>
                </InsightsEnvDetector>
            </PageHeader>
            <Main>
                <RenderIf renderIf={ renderIfUsingBehaviorGroupResolver }>
                    <RenderIfTrue>
                        <BundlePageBehaviorGroupContent applications={ props.applications } bundle={ props.bundle } />
                    </RenderIfTrue>
                    <RenderIfFalse>
                        <BundlePageContent applications={ props.applications } bundle={ props.bundle } />
                    </RenderIfFalse>
                </RenderIf>
            </Main>
        </>
    );
};
