import { ExpandableSection, Flex, FlexItem } from '@patternfly/react-core';
import { getInsights, InsightsEnvDetector, RenderIfTrue } from '@redhat-cloud-services/insights-common-typescript';
import * as React from 'react';
import { global_spacer_lg } from '@patternfly/react-tokens';

import { BehaviorGroup } from '../../../components/Notifications/BehaviorGroup/BehaviorGroup';
import { style } from 'typestyle';

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
                    <Flex>
                        <FlexItem><BehaviorGroup behaviorGroupId="123456" name="Default - RHEL" actions={ [] } /></FlexItem>
                        <FlexItem><BehaviorGroup behaviorGroupId="7890123" name="Custom 1" actions={ [] } /></FlexItem>
                    </Flex>
                </ExpandableSection>
            </RenderIfTrue>
        </InsightsEnvDetector>
    );
};
