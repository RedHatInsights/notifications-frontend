import { OuiaComponentProps } from '@redhat-cloud-services/insights-common-typescript';
import * as React from 'react';

import { Action } from '../../../types/Notification';
import { Button, ButtonVariant, Card, CardActions, CardBody, CardHeader, CardHeaderMain } from '@patternfly/react-core';
import { style } from 'typestyle';

const cardClassName = style({
    width: 300
});

export interface BehaviorGroupProps extends OuiaComponentProps {
    behaviorGroupId?: string;
    name: string;
    actions: Array<Action>;
}

export const BehaviorGroup: React.FunctionComponent<BehaviorGroupProps> = props => {
    return (
        <Card isFlat className={ cardClassName }>
            <CardHeader>
                <CardHeaderMain><b>{ props.name }</b></CardHeaderMain>
                <CardActions>
                    { props.behaviorGroupId && (
                        <Button variant={ ButtonVariant.link }>Edit</Button>
                    ) }
                </CardActions>
            </CardHeader>
            <CardBody>
                Actions be here
            </CardBody>
        </Card>
    );
};
