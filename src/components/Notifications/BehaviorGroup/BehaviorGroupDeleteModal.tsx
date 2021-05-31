import {
    ButtonVariant,
    Checkbox,
    ExpandableSection,
    List,
    ListItem,
    Skeleton,
    Stack,
    StackItem
} from '@patternfly/react-core';
import { ActionModalProps, DeleteModal, DeleteModalProps } from '@redhat-cloud-services/insights-common-typescript';
import * as React from 'react';

import { useOnDeleteWrapper } from '../../../hooks/useOnDeleteWrapper';
import { OnDelete } from '../../../types/Callbacks';
import { BehaviorGroup, Notification } from '../../../types/Notification';

type UsedProps = 'isOpen' | 'title' | 'content' | 'onDelete';

interface BehaviorGroupDeleteModalProps extends Omit<DeleteModalProps, UsedProps> {
    behaviorGroup: BehaviorGroup;
    onDelete: OnDelete<BehaviorGroup>;
    conflictingNotifications: Array<Notification>;
}

type BehaviorGroupDeleteModalSkeletonProps = Pick<ActionModalProps, 'onClose'>;

export const BehaviorGroupDeleteModal: React.FunctionComponent<BehaviorGroupDeleteModalProps> = props => {
    const onDelete = useOnDeleteWrapper(props.onDelete, props.behaviorGroup);

    const cancelButtonTitle = React.useMemo(
        () => props.conflictingNotifications.length === 0 ? 'Close' : 'Cancel',
        [ props.conflictingNotifications ]
    );

    const cancelButtonVariant = React.useMemo(
        () => props.conflictingNotifications.length === 0 ? ButtonVariant.plain : ButtonVariant.link,
        [ props.conflictingNotifications ]
    );

    const content = React.useMemo(() => {
        if (props.conflictingNotifications.length === 0) {
            return (
                <Stack>
                    <StackItem>
                        Action and recipient pairings assigned in <b>{ props.behaviorGroup.displayName }</b> will lost. You
                        will no longer be able to assign this behavior group to events.
                    </StackItem>
                    <StackItem>
                        <Checkbox id="checkbox-delete-i-acknowledge" label="I acknowledge that this action cannot be undone" />
                    </StackItem>
                </Stack>
            );
        } else {
            const events = props.conflictingNotifications;

            return (
                <Stack>
                    <StackItem>
                        <b>{ props.behaviorGroup.displayName }</b> is associated to { events.length } events.
                        Please remove the behavior group from these events in order  to continue.
                    </StackItem>
                    <StackItem>
                        <ExpandableSection
                            toggleText={ `View ${ events.length } event${ events.length === 0 ? '' : 's' }` }
                        >
                            <List>
                                { events.map(event =>
                                    (<ListItem key={ event.id }>{ `${event.applicationDisplayName} - ${event.eventTypeDisplayName}` }</ListItem>)
                                ) }
                            </List>
                        </ExpandableSection>
                    </StackItem>
                </Stack>
            );
        }
    }, [ props.conflictingNotifications, props.behaviorGroup ]);

    return (
        <DeleteModal
            isOpen={ true }
            isDeleting={ props.isDeleting }
            title="Delete behavior group"
            content={ content }
            onClose={ props.onClose }
            onDelete={ onDelete }
            error={ props.error }
            titleIconVariant="warning"
            cancelButtonTitle={ cancelButtonTitle }
            cancelButtonVariant={ cancelButtonVariant }
        />
    );
};

const onDelete = () => false;

export const BehaviorGroupDeleteModalSkeleton: React.FunctionComponent<BehaviorGroupDeleteModalSkeletonProps> = props => {
    return (
        <DeleteModal
            isOpen={ true }
            title="Delete behavior group"
            actionButtonDisabled={ true }
            titleIconVariant="warning"
            content={ <Stack>
                <StackItem><Skeleton width="200px" /></StackItem>
                <StackItem><Skeleton width="200px" /></StackItem>
            </Stack> }
            onClose={ props.onClose }
            isDeleting={ false }
            onDelete={ onDelete }
        />
    );
};
