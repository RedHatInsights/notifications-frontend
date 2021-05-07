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

import { BehaviorGroup } from '../../../types/Notification';
import { ActionComponent } from '../ActionComponent';
import { Recipient } from '../Recipient';

const cardClassName = style({
    width: 450,
    height: '100%'
});

export interface BehaviorGroupProps extends OuiaComponentProps {
    behaviorGroup: BehaviorGroup;
    onEdit: (behaviorGroup: BehaviorGroup) => void;
}

export const BehaviorGroupCard: React.FunctionComponent<BehaviorGroupProps> = props => {

    const onClickEdit = React.useCallback(() => {
        const onEdit = props.onEdit;
        onEdit(props.behaviorGroup);
    }, [ props.behaviorGroup, props.onEdit ]);

    return (
        <Card isFlat className={ cardClassName }>
            <CardHeader>
                <CardHeaderMain><b>{ props.behaviorGroup.displayName }</b></CardHeaderMain>
                <CardActions>
                    <Button variant={ ButtonVariant.link } onClick={ onClickEdit }>Edit</Button>
                </CardActions>
            </CardHeader>
            <CardBody>
                <Grid hasGutter>
                    <GridItem span={ 6 }>
                        <b>Action</b>
                    </GridItem>
                    <GridItem span={ 6 }>
                        <b>Recipient</b>
                    </GridItem>
                    { props.behaviorGroup.actions.map((action, index) => (
                        <React.Fragment key={ `${index}-${action.integrationId}` }>
                            <GridItem span={ 6 }>
                                <ActionComponent isDefault={ false } action={ action } />
                            </GridItem>
                            <GridItem span={ 6 }>
                                <Recipient action={ action } />
                            </GridItem>
                        </React.Fragment>
                    )) }
                </Grid>
            </CardBody>
        </Card>
    );
};
