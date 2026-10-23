import { ExpandableSection, List, ListItem, Skeleton } from '@patternfly/react-core';
import * as React from 'react';
import { FormattedMessage, defineMessages, useIntl } from 'react-intl';

import { UserIntegration } from '../../types/Integration';
import { BehaviorGroup } from '../../types/Notification';
import { DeleteModal, DeleteModalProps } from '../../utils/insights-common-typescript';

const messages = defineMessages({
  noBehaviorGroupsBody: {
    id: 'integrations.deleteModal.noBehaviorGroupsBody',
    defaultMessage: 'Deleting integration {name} does not affect any behavior group.',
  },
  behaviorGroupsBody: {
    id: 'integrations.deleteModal.behaviorGroupsBody',
    defaultMessage:
      'Delete integration {name} affects {count, plural, one {# behavior group} other {# behavior groups}}. The end point associated with this integration will not receive notifications for the following events.',
  },
  viewBehaviorGroups: {
    id: 'integrations.deleteModal.viewBehaviorGroups',
    defaultMessage: 'View {count, plural, one {# behavior group} other {# behavior groups}}',
  },
  behaviorGroupEntry: {
    id: 'integrations.deleteModal.behaviorGroupEntry',
    defaultMessage: '{bundle}: {name}',
  },
  title: {
    id: 'integrations.deleteModal.title',
    defaultMessage: 'Delete integration',
  },
  actionButtonTitle: {
    id: 'integrations.deleteModal.actionButtonTitle',
    defaultMessage: 'Delete',
  },
});

type UsedProps = 'isOpen' | 'title' | 'content' | 'onDelete';

interface IntegrationDeleteModalProps extends Omit<DeleteModalProps, UsedProps> {
  integration?: UserIntegration;
  onDelete: (integration: UserIntegration) => boolean | Promise<boolean>;
  behaviorGroups?: Array<BehaviorGroup>;
}

export const IntegrationDeleteModal: React.FunctionComponent<IntegrationDeleteModalProps> = (
  props
) => {
  const intl = useIntl();
  const onDeleteInternal = React.useCallback(() => {
    const integration = props.integration;
    const onDelete = props.onDelete;
    if (integration) {
      return onDelete(integration);
    }

    return false;
  }, [props.onDelete, props.integration]);

  const content = React.useMemo(() => {
    if (props.behaviorGroups === undefined) {
      return (
        <span data-testid="loading">
          <Skeleton />
        </span>
      );
    } else if (props.behaviorGroups.length === 0) {
      return (
        <span data-testid="removing-integration-without-notifications">
          <FormattedMessage
            {...messages.noBehaviorGroupsBody}
            values={{ name: <strong>{props.integration?.name}</strong> }}
          />
        </span>
      );
    } else {
      return (
        <span
          data-testid={`removing-integration-with-notifications-${props.behaviorGroups.length}`}
        >
          <FormattedMessage
            {...messages.behaviorGroupsBody}
            values={{
              name: <strong>{props.integration?.name}</strong>,
              count: props.behaviorGroups.length,
            }}
          />
          {props.behaviorGroups.length > 0 && (
            <ExpandableSection
              toggleText={intl.formatMessage(messages.viewBehaviorGroups, {
                count: props.behaviorGroups.length,
              })}
            >
              <List>
                {props.behaviorGroups.map((behaviorGroup) => (
                  <ListItem key={behaviorGroup.id}>
                    <FormattedMessage
                      {...messages.behaviorGroupEntry}
                      values={{
                        bundle: behaviorGroup.bundleName,
                        name: behaviorGroup.displayName,
                      }}
                    />
                  </ListItem>
                ))}
              </List>
            </ExpandableSection>
          )}
        </span>
      );
    }
  }, [props.behaviorGroups, props.integration, intl]);

  if (!props.integration) {
    return null;
  }

  return (
    <DeleteModal
      isOpen={true}
      isDeleting={props.isDeleting}
      title={intl.formatMessage(messages.title)}
      content={content}
      onClose={props.onClose}
      onDelete={onDeleteInternal}
      error={props.error}
      titleIconVariant="warning"
      actionButtonTitle={intl.formatMessage(messages.actionButtonTitle)}
    />
  );
};
