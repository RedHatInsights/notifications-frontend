import {
  ButtonVariant,
  Checkbox,
  ExpandableSection,
  List,
  ListItem,
  Skeleton,
  Stack,
  StackItem,
} from '@patternfly/react-core';
import {
  ActionModalProps,
  DeleteModal,
  DeleteModalProps,
} from '@redhat-cloud-services/insights-common-typescript';
import * as React from 'react';

import { useOnDeleteWrapper } from '../../../hooks/useOnDeleteWrapper';
import { OnDelete } from '../../../types/Callbacks';
import { BehaviorGroup, Notification } from '../../../types/Notification';

type UsedProps = 'isOpen' | 'title' | 'content' | 'onDelete';

interface BehaviorGroupDeleteModalProps
  extends Omit<DeleteModalProps, UsedProps> {
  behaviorGroup: BehaviorGroup;
  onDelete: OnDelete<BehaviorGroup>;
  conflictingNotifications: Array<Notification>;
}

type BehaviorGroupDeleteModalSkeletonProps = Pick<ActionModalProps, 'onClose'>;

export const BehaviorGroupDeleteModal: React.FunctionComponent<BehaviorGroupDeleteModalProps> =
  (props) => {
    const onDelete = useOnDeleteWrapper(props.onDelete, props.behaviorGroup);

    const cancelButtonTitle = React.useMemo(
      () => (props.conflictingNotifications.length === 0 ? 'Cancel' : 'Close'),
      [props.conflictingNotifications]
    );

    const cancelButtonVariant = React.useMemo(
      () =>
        props.conflictingNotifications.length === 0
          ? ButtonVariant.link
          : ButtonVariant.secondary,
      [props.conflictingNotifications]
    );

    const [ackDelete, setAckDelete] = React.useState(false);

    const content = React.useMemo(() => {
      if (props.conflictingNotifications.length === 0) {
        return (
          <Stack hasGutter>
            <StackItem>
              Action and recipient pairings assigned in{' '}
              <b>{props.behaviorGroup.displayName}</b> will lost. You will no
              longer be able to assign this behavior group to events.
            </StackItem>
            <StackItem>
              <Checkbox
                id="checkbox-delete-i-acknowledge"
                label="I acknowledge that this action cannot be undone"
                onChange={setAckDelete}
                isChecked={ackDelete}
              />
            </StackItem>
          </Stack>
        );
      } else {
        const events = props.conflictingNotifications;

        return (
          <Stack hasGutter>
            <StackItem>
              You will no longer be able to assign{' '}
              <b>{props.behaviorGroup.displayName}</b> to events, and existing
              associations to events listed below will be removed.
            </StackItem>
            <StackItem>
              <ExpandableSection
                toggleText={`View ${events.length} event${
                  events.length === 0 ? '' : 's'
                }`}
              >
                <List>
                  {events.map((event) => (
                    <ListItem
                      key={event.id}
                    >{`${event.applicationDisplayName} - ${event.eventTypeDisplayName}`}</ListItem>
                  ))}
                </List>
              </ExpandableSection>
            </StackItem>
            <StackItem>
              <Checkbox
                id="checkbox-delete-i-acknowledge"
                label="I acknowledge that this action cannot be undone"
                onChange={setAckDelete}
                isChecked={ackDelete}
              />
            </StackItem>
          </Stack>
        );
      }
    }, [
      props.conflictingNotifications,
      props.behaviorGroup,
      ackDelete,
      setAckDelete,
    ]);

    return (
      <DeleteModal
        isOpen={true}
        isDeleting={props.isDeleting}
        title="Delete behavior group"
        content={content}
        onClose={props.onClose}
        onDelete={onDelete}
        error={props.error}
        titleIconVariant="warning"
        actionButtonDisabled={!ackDelete}
        cancelButtonTitle={cancelButtonTitle}
        cancelButtonVariant={cancelButtonVariant}
      />
    );
  };

const onDelete = () => false;

export const BehaviorGroupDeleteModalSkeleton: React.FunctionComponent<BehaviorGroupDeleteModalSkeletonProps> =
  (props) => {
    return (
      <DeleteModal
        isOpen={true}
        title="Delete behavior group"
        actionButtonDisabled={true}
        titleIconVariant="warning"
        content={
          <Stack hasGutter>
            <StackItem>
              <Skeleton width="500px" />
            </StackItem>
            <StackItem>
              <Skeleton width="500px" />
            </StackItem>
          </Stack>
        }
        onClose={props.onClose}
        isDeleting={false}
        onDelete={onDelete}
      />
    );
  };
