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
import * as React from 'react';
import { FormattedMessage, defineMessages, useIntl } from 'react-intl';

import { useOnDeleteWrapper } from '../../../hooks/useOnDeleteWrapper';
import { OnDelete } from '../../../types/Callbacks';
import { BehaviorGroup, Notification } from '../../../types/Notification';
import {
  ActionModalProps,
  DeleteModal,
  DeleteModalProps,
} from '../../../utils/insights-common-typescript';

const messages = defineMessages({
  cancel: {
    id: 'behaviorGroup.deleteModal.cancel',
    defaultMessage: 'Cancel',
  },
  close: {
    id: 'behaviorGroup.deleteModal.close',
    defaultMessage: 'Close',
  },
  noConflictBody: {
    id: 'behaviorGroup.deleteModal.noConflictBody',
    defaultMessage:
      'Action and recipient pairings assigned in {name} will be lost. You will no longer be able to assign this behavior group to events.',
  },
  conflictBody: {
    id: 'behaviorGroup.deleteModal.conflictBody',
    defaultMessage:
      'You will no longer be able to assign {name} to events, and existing associations to events listed below will be removed.',
  },
  acknowledge: {
    id: 'behaviorGroup.deleteModal.acknowledge',
    defaultMessage: 'I acknowledge that this action cannot be undone',
  },
  viewEvents: {
    id: 'behaviorGroup.deleteModal.viewEvents',
    defaultMessage: 'View {count, plural, one {# event} other {# events}}',
  },
  deleteTitle: {
    id: 'behaviorGroup.deleteModal.deleteTitle',
    defaultMessage: 'Delete behavior group',
  },
});

type UsedProps = 'isOpen' | 'title' | 'content' | 'onDelete';

interface BehaviorGroupDeleteModalProps extends Omit<DeleteModalProps, UsedProps> {
  behaviorGroup: BehaviorGroup;
  onDelete: OnDelete<BehaviorGroup>;
  conflictingNotifications: Array<Notification>;
}

type BehaviorGroupDeleteModalSkeletonProps = Pick<ActionModalProps, 'onClose'>;

export const BehaviorGroupDeleteModal: React.FunctionComponent<BehaviorGroupDeleteModalProps> = (
  props
) => {
  const intl = useIntl();
  const onDelete = useOnDeleteWrapper(props.onDelete, props.behaviorGroup);

  const cancelButtonTitle = React.useMemo(
    () =>
      props.conflictingNotifications.length === 0
        ? intl.formatMessage(messages.cancel)
        : intl.formatMessage(messages.close),
    [props.conflictingNotifications, intl]
  );

  const cancelButtonVariant = React.useMemo(
    () =>
      props.conflictingNotifications.length === 0 ? ButtonVariant.link : ButtonVariant.secondary,
    [props.conflictingNotifications]
  );

  const [ackDelete, setAckDelete] = React.useState(false);

  const content = React.useMemo(() => {
    if (props.conflictingNotifications.length === 0) {
      return (
        <Stack hasGutter>
          <StackItem>
            <FormattedMessage
              {...messages.noConflictBody}
              values={{ name: <b>{props.behaviorGroup.displayName}</b> }}
            />
          </StackItem>
          <StackItem>
            <Checkbox
              id="checkbox-delete-i-acknowledge"
              label={intl.formatMessage(messages.acknowledge)}
              onChange={(_e, checked) => setAckDelete(checked)}
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
            <FormattedMessage
              {...messages.conflictBody}
              values={{ name: <b>{props.behaviorGroup.displayName}</b> }}
            />
          </StackItem>
          <StackItem>
            <ExpandableSection
              toggleText={intl.formatMessage(messages.viewEvents, { count: events.length })}
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
              label={intl.formatMessage(messages.acknowledge)}
              onChange={(_e, checked) => setAckDelete(checked)}
              isChecked={ackDelete}
            />
          </StackItem>
        </Stack>
      );
    }
  }, [props.conflictingNotifications, props.behaviorGroup, ackDelete, setAckDelete, intl]);

  return (
    <DeleteModal
      variant="default"
      isOpen={true}
      isDeleting={props.isDeleting}
      title={intl.formatMessage(messages.deleteTitle)}
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

export const BehaviorGroupDeleteModalSkeleton: React.FunctionComponent<
  BehaviorGroupDeleteModalSkeletonProps
> = (props) => {
  const intl = useIntl();
  return (
    <DeleteModal
      variant="default"
      isOpen={true}
      title={intl.formatMessage(messages.deleteTitle)}
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
