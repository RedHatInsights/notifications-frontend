import {
  ExpandableSection,
  List,
  ListItem,
  Skeleton,
} from '@patternfly/react-core';
import * as React from 'react';

import { UserIntegration } from '../../types/Integration';
import { BehaviorGroup } from '../../types/Notification';
import {
  DeleteModal,
  DeleteModalProps,
} from '../../utils/insights-common-typescript';

type UsedProps = 'isOpen' | 'title' | 'content' | 'onDelete';

interface IntegrationDeleteModalProps
  extends Omit<DeleteModalProps, UsedProps> {
  integration?: UserIntegration;
  onDelete: (integration: UserIntegration) => boolean | Promise<boolean>;
  behaviorGroups?: Array<BehaviorGroup>;
}

export const IntegrationDeleteModal: React.FunctionComponent<
  IntegrationDeleteModalProps
> = (props) => {
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
          Deleting integration <strong>{props.integration?.name}</strong> does
          not affect any behavior group.
        </span>
      );
    } else {
      const behaviorGroupText =
        props.behaviorGroups.length !== 1
          ? 'behavior groups'
          : 'behavior group';
      return (
        <span
          data-testid={`removing-integration-with-notifications-${props.behaviorGroups.length}`}
        >
          Delete integration <strong>{props.integration?.name}</strong> affects{' '}
          {props.behaviorGroups.length} {behaviorGroupText}. The end point
          associated with this integration will not recieve notifications for
          the following events.
          {props.behaviorGroups.length > 0 && (
            <ExpandableSection
              toggleText={`View ${props.behaviorGroups.length} ${behaviorGroupText}`}
            >
              <List>
                {props.behaviorGroups.map((behaviorGroup) => (
                  <ListItem key={behaviorGroup.id}>
                    {behaviorGroup.bundleName}: {behaviorGroup.displayName}
                  </ListItem>
                ))}
              </List>
            </ExpandableSection>
          )}
        </span>
      );
    }
  }, [props.behaviorGroups, props.integration]);

  if (!props.integration) {
    return null;
  }

  return (
    <DeleteModal
      isOpen={true}
      isDeleting={props.isDeleting}
      title={'Delete integration'}
      content={content}
      onClose={props.onClose}
      onDelete={onDeleteInternal}
      error={props.error}
      titleIconVariant="warning"
      actionButtonTitle="Delete"
    />
  );
};
