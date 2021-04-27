import {
    Button,
    ButtonVariant,
    ExpandableSection,
    Flex,
    FlexItem,
    Split,
    SplitItem,
    Stack,
    StackItem,
    TextInput
} from '@patternfly/react-core';
import { global_spacer_lg } from '@patternfly/react-tokens';
import { getInsights, InsightsEnvDetector, RenderIfTrue } from '@redhat-cloud-services/insights-common-typescript';
import * as React from 'react';
import { style } from 'typestyle';

import { BehaviorGroup } from '../../../components/Notifications/BehaviorGroup/BehaviorGroup';
import { UserIntegrationType } from '../../../types/Integration';
import { NotificationType } from '../../../types/Notification';

const sectionClassName = style({
    backgroundColor: 'white',
    padding: global_spacer_lg.var
});

export const BehaviorGroupsSection = () => {

    const [ isExpanded, setExpanded ] = React.useState(true);

    return (
        <InsightsEnvDetector insights={ getInsights() } onEnvironment={ [ 'ci', 'ci-beta', 'qa', 'qa-beta' ] }>
            <RenderIfTrue>
                <ExpandableSection className={ sectionClassName } toggleText="Behavior Groups" isExpanded={ isExpanded } onToggle={ setExpanded }>
                    <Stack hasGutter>
                        <StackItem>
                            Configure default actions for notifications recipients. Keep in mind that users will be able
                            to change settings for all entitled events in User Preferences. You can prevent users from
                            changing assigned actions by locking action / recipient pairings when creating or editing
                            behavior groups.
                        </StackItem>
                        <StackItem>
                            <Split hasGutter>
                                <SplitItem>
                                    <TextInput
                                        value=""
                                        type="text"
                                        iconVariant='search'
                                        onChange={(_value) => {}}
                                        aria-label="Search by name"
                                        placeholder="Search by name"
                                    />
                                </SplitItem>
                                <SplitItem>
                                    <Button variant={ ButtonVariant.primary }>Create new group</Button>
                                </SplitItem>
                            </Split>
                        </StackItem>
                        <StackItem>
                            <Flex alignItems={
                                {
                                    default: 'alignItemsStretch'
                                }
                            }>
                                <FlexItem><BehaviorGroup behaviorGroupId="123456" name="Default - RHEL" actions={ [
                                    {
                                        integrationId: 'foobar',
                                        integration: {
                                            isEnabled: true,
                                            name: 'My integration',
                                            type: UserIntegrationType.WEBHOOK,
                                            id: 'foobar'
                                        },
                                        type: NotificationType.INTEGRATION
                                    },
                                    {
                                        integrationId: 'fobarbaz',
                                        type: NotificationType.EMAIL_SUBSCRIPTION,
                                        recipient: []
                                    }
                                ] } /></FlexItem>
                                <FlexItem><BehaviorGroup behaviorGroupId="7890123" name="Custom 1" actions={ [
                                    {
                                        integrationId: 'fobarbaz',
                                        type: NotificationType.EMAIL_SUBSCRIPTION,
                                        recipient: []
                                    }
                                ] } /></FlexItem>
                            </Flex>
                        </StackItem>
                    </Stack>
                </ExpandableSection>
            </RenderIfTrue>
        </InsightsEnvDetector>
    );
};
