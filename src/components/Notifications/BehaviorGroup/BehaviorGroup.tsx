import {
    Button,
    ButtonVariant,
    Card,
    CardActions,
    CardBody,
    CardHeader,
    CardHeaderMain,
    Grid, GridItem
} from '@patternfly/react-core';
import { OuiaComponentProps } from '@redhat-cloud-services/insights-common-typescript';
import * as React from 'react';
import { style } from 'typestyle';

import { Action } from '../../../types/Notification';
import { ActionComponent } from '../ActionComponent';
import { Recipient } from '../Recipient';

const cardClassName = style({
    width: 450,
    height: '100%'
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
                <Grid hasGutter>
                    { props.actions.map(action => (
                        <>
                            <GridItem span={ 6 }>
                                <ActionComponent isDefault={ false } action={ action } />
                            </GridItem>
                            <GridItem span={ 6 }>
                                <Recipient action={ action } />
                            </GridItem>
                        </>
                    )) }
                </Grid>
            </CardBody>
        </Card>
    );
};
