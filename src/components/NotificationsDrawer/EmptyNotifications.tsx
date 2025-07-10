import React from 'react';
import {
  EmptyState,
  EmptyStateBody,
} from '@patternfly/react-core/dist/dynamic/components/EmptyState';
import { Content } from '@patternfly/react-core/dist/dynamic/components/Content';
import { Title } from '@patternfly/react-core/dist/dynamic/components/Title';
import BellSlashIcon from '@patternfly/react-icons/dist/dynamic/icons/bell-slash-icon';
import { Link } from 'react-router-dom';
import {
  Stack,
  StackItem,
} from '@patternfly/react-core/dist/dynamic/layouts/Stack';

export const EmptyNotifications = ({
  isOrgAdmin,
  onLinkClick,
}: {
  onLinkClick: () => void;
  isOrgAdmin?: boolean;
}) => (
  <EmptyState
    titleText={
      <Title headingLevel="h4" size="lg">
        No notifications found
      </Title>
    }
    icon={BellSlashIcon}
  >
    <EmptyStateBody>
      {isOrgAdmin ? (
        <Stack>
          <StackItem>
            <Content component="p">
              There are currently no notifications for you.
            </Content>
          </StackItem>
          <StackItem>
            <Content component="p">
              Try&nbsp;
              <Link
                onClick={onLinkClick}
                to="/settings/notifications/user-preferences"
              >
                checking your notification preferences
              </Link>
              &nbsp;and managing the&nbsp;
              <Link
                onClick={onLinkClick}
                to="/settings/notifications/configure-events"
              >
                notification configuration
              </Link>
              &nbsp;for your organization.
            </Content>
          </StackItem>
        </Stack>
      ) : (
        <>
          <Stack>
            <StackItem className="pf-v6-u-pl-lg pf-v6-u-pb-sm">
              <Content component="p">
                There are currently no notifications for you.
              </Content>
            </StackItem>
            <StackItem className="pf-v6-u-pl-lg pf-v6-u-pb-sm">
              <Link
                onClick={onLinkClick}
                to="/settings/notifications/user-preferences"
              >
                Check your Notification Preferences
              </Link>
            </StackItem>
            <StackItem className="pf-v6-u-pl-lg pf-v6-u-pb-sm">
              <Link
                onClick={onLinkClick}
                to="/settings/notifications/notificationslog"
              >
                View the Event log to see all fired events
              </Link>
            </StackItem>
            <StackItem className="pf-v6-u-pl-lg pf-v6-u-pb-sm">
              <Content component="p">
                Contact your organization administrator
              </Content>
            </StackItem>
          </Stack>
        </>
      )}
    </EmptyStateBody>
  </EmptyState>
);
