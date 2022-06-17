import {
    Card,
    CardActions,
    CardBody,
    CardHeader,
    CardHeaderMain,
    Dropdown,
    DropdownItem,
    DropdownPosition,
    Grid,
    GridItem,
    KebabToggle,
    Popover,
    Skeleton,
    Split,
    SplitItem,
    Text,
    TextContent,
    TextVariants
} from '@patternfly/react-core';
import { LockIcon } from '@patternfly/react-icons';
import { c_form__label_FontSize, global_spacer_sm } from '@patternfly/react-tokens';
import { OuiaComponentProps } from '@redhat-cloud-services/insights-common-typescript';
import * as React from 'react';
import { MarkRequired } from 'ts-essentials';
import { style } from 'typestyle';

import { BehaviorGroup } from '../../../types/Notification';
import { ActionComponent } from '../ActionComponent';
import { Recipient } from '../Recipient';

const cardClassName = style({
    width: 450,
    height: '100%'
});

const lockedSpacer = style({
    marginRight: global_spacer_sm.value
});

const contentTitleStyle = {
    fontSize: c_form__label_FontSize.value
};

export interface BehaviorGroupProps extends OuiaComponentProps {
    behaviorGroup?: BehaviorGroup;
    onEdit?: (behaviorGroup: BehaviorGroup) => void;
    onDelete?: (behaviorGroup: BehaviorGroup) => void;
}

type BehaviorGroupImplProps = MarkRequired<BehaviorGroupProps, 'behaviorGroup'>;

export interface BehaviorGroupCardLayout {
    title: React.ReactNode;
    dropdownItems?: Array<React.ReactNode>;
    isDefaultBehavior?: boolean;
}

const skeletonActions = 3;

const BehaviorGroupCardLayout: React.FunctionComponent<BehaviorGroupCardLayout> = props => {
    const [ isOpen, setOpen ] = React.useState(false);

    const switchOpen = React.useCallback(() => setOpen(prev => !prev), [ setOpen ]);

    return (
        <Card isFlat className={ cardClassName }>
            <CardHeader>
                <CardHeaderMain>
                    <Split>
                        <SplitItem>
                            { props.isDefaultBehavior &&
                            <Popover
                                position='top'
                                appendTo={ () => document.body }
                                headerContent={ 'System required behavior group' }
                                // eslint-disable-next-line max-len
                                bodyContent={ 'This group is system generated and can not be edited, deleted, or removed from being applied to an event' }>
                                <LockIcon className={ lockedSpacer } />
                            </Popover>
                            }
                        </SplitItem>
                        <SplitItem>
                            <TextContent>
                                <Text component={ TextVariants.h4 }> { props.title } </Text>
                            </TextContent>
                        </SplitItem>
                    </Split>
                </CardHeaderMain>
                <CardActions>
                    { !props.isDefaultBehavior &&
                        <Dropdown
                            onSelect={ switchOpen }
                            toggle={ <KebabToggle onToggle={ setOpen } isDisabled={ !props.dropdownItems } /> }
                            isOpen={ isOpen }
                            isPlain
                            dropdownItems={ props.dropdownItems }
                            position={ DropdownPosition.right }
                            menuAppendTo={ () => document.body }
                        />
                    }
                </CardActions>
            </CardHeader>
            <CardBody>
                <Grid hasGutter>
                    <GridItem span={ 6 }>
                        <TextContent>
                            <Text component={ TextVariants.h5 } style={ contentTitleStyle }>Action</Text>
                        </TextContent>
                    </GridItem>
                    <GridItem span={ 6 }>
                        <TextContent>
                            <Text component={ TextVariants.h5 } style={ contentTitleStyle }>Recipient</Text>
                        </TextContent>
                    </GridItem>
                    { props.children }
                </Grid>
            </CardBody>
        </Card>
    );
};

const BehaviorGroupCardImpl: React.FunctionComponent<BehaviorGroupImplProps> = props => {
    const onClickEdit = React.useCallback(() => {
        const onEdit = props.onEdit;
        if (onEdit) {
            onEdit(props.behaviorGroup);
        }
    }, [ props.behaviorGroup, props.onEdit ]);

    const onClickDelete = React.useCallback(() => {
        const onDelete = props.onDelete;
        if (onDelete) {
            onDelete(props.behaviorGroup);
        }
    }, [ props.behaviorGroup, props.onDelete ]);

    const dropdownItems = React.useMemo(() => [
        <DropdownItem key="on-edit" onClick={ onClickEdit } isDisabled={ !onClickEdit } > Edit </DropdownItem>,
        <DropdownItem key="on-delete" onClick={ onClickDelete } isDisabled={ !onClickDelete }> Delete </DropdownItem>
    ], [ onClickEdit, onClickDelete ]);

    return (
        <BehaviorGroupCardLayout
            title={ props.behaviorGroup.displayName }
            dropdownItems={ dropdownItems }
            isDefaultBehavior={ props.behaviorGroup.isDefault }
        >
            { props.behaviorGroup.actions.map((action, index) => (
                <React.Fragment key={ `${index}-${action.type}` }>
                    <GridItem span={ 6 }>
                        <ActionComponent action={ action } />
                    </GridItem>
                    <GridItem span={ 6 }>
                        <Recipient action={ action } />
                    </GridItem>
                </React.Fragment>
            )) }
        </BehaviorGroupCardLayout>
    );
};

const BehaviorGroupCardSkeleton: React.FunctionComponent = () => {
    const contentWidth = '150px';

    return (
        <BehaviorGroupCardLayout
            title={ <Skeleton width="300px" /> }
        >
            { [ ...Array(skeletonActions).values() ].map((_unused, index) => (
                <React.Fragment key={ `skeleton-${index}` }>
                    <GridItem span={ 6 }>
                        <Skeleton width={ contentWidth } />
                    </GridItem>
                    <GridItem span={ 6 }>
                        <Skeleton width={ contentWidth } />
                    </GridItem>
                </React.Fragment>
            )) }
        </BehaviorGroupCardLayout>
    );
};

export const BehaviorGroupCard: React.FunctionComponent<BehaviorGroupProps> = props => {
    if (props.behaviorGroup) {
        return <BehaviorGroupCardImpl
            { ...props }
            behaviorGroup={ props.behaviorGroup }
        />;
    }

    return <BehaviorGroupCardSkeleton />;
};
