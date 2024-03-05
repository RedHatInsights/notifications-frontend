import React from 'react';
import MultiContentCard from '@patternfly/react-component-groups/dist/dynamic/MultiContentCard';
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Icon,
  Text,
  TextContent,
  TextList,
  TextListItem,
  TextVariants,
} from '@patternfly/react-core';
import {
  ArrowRightIcon,
  BellIcon,
  CogIcon,
  LockIcon,
} from '@patternfly/react-icons';
import { IntegrationCategory } from '../../types/Integration';
import '../../app/App.scss';
import { Link } from 'react-router-dom';

interface DopeBoxProps {
  category?: IntegrationCategory;
}

const DopeBox: React.FunctionComponent<DopeBoxProps> = ({ category }) => {
  const integrationCards = [
    <Card isFullHeight isPlain key="card-1">
      <CardHeader>
        <TextContent>
          <Text component={TextVariants.h4}>Getting Started</Text>
        </TextContent>
      </CardHeader>
      <CardBody>
        <TextContent>
          <Text className="pf-v5-u-font-size-sm pf-v5-u-font-weight-bold pf-v5-u-mb-sm pf-v5-u-link-color-hover">
            <Icon size="md" className="pf-v5-u-pl-sm pf-v5-u-pr-md">
              <CogIcon />
            </Icon>
            Configure applications
          </Text>
          <Text className="pf-v5-u-font-size-sm">
            To prepare for integration with the Hybrid Cloud Console, you must
            configure incoming webhooks in your third-party applications.
          </Text>
        </TextContent>
      </CardBody>
      <CardFooter>
        <TextContent>
          {category === IntegrationCategory.COMMUNICATIONS && (
            <TextList className="pf-v5-u-font-size-sm pf-v5-u-link-color pf-v5-u-ml-0">
              <TextListItem>
                <Button variant="link" isInline>
                  <Link
                    to="https://access.redhat.com/documentation/en-us/red_hat_hybrid_cloud_console/2023/html/integrating_the_red_hat_hybrid_cloud_console_with_third-party_applications/assembly-configuring-insights-integration-with-slack_integrations"
                    target="_blank"
                  >
                    Configure Slack
                  </Link>{' '}
                </Button>
              </TextListItem>
              <TextListItem>
                <Button variant="link" isInline>
                  <Link
                    to="https://access.redhat.com/documentation/en-us/red_hat_hybrid_cloud_console/2023/html/integrating_the_red_hat_hybrid_cloud_console_with_third-party_applications/assembly-configuring-integration-with-gchat_integrations"
                    target="_blank"
                  >
                    Configure Google Chat
                  </Link>{' '}
                </Button>
              </TextListItem>
              <TextListItem>
                <Button variant="link" isInline>
                  <Link
                    to="https://access.redhat.com/documentation/en-us/red_hat_hybrid_cloud_console/2023/html/integrating_the_red_hat_hybrid_cloud_console_with_third-party_applications/assembly-configuring-integration-with-teams_integrations"
                    target="_blank"
                  >
                    Configure Microsoft Teams
                  </Link>{' '}
                </Button>
              </TextListItem>
            </TextList>
          )}
          {category === IntegrationCategory.REPORTING && (
            <TextList className="pf-v5-u-font-size-sm pf-v5-u-link-color pf-v5-u-ml-0">
              <TextListItem>
                <Button variant="link" isInline>
                  <Link
                    to="https://access.redhat.com/documentation/en-us/red_hat_hybrid_cloud_console/2023/html/integrating_the_red_hat_hybrid_cloud_console_with_third-party_applications/assembly-installing-configuring-insights-for-splunk_integrations"
                    target="_blank"
                  >
                    Configure Splunk
                  </Link>{' '}
                </Button>
              </TextListItem>
              <TextListItem>
                <Button variant="link" isInline>
                  <Link
                    to="https://access.redhat.com/documentation/en-us/red_hat_hybrid_cloud_console/2023/html/integrating_the_red_hat_hybrid_cloud_console_with_third-party_applications/assembly-installing-configuring-insights-for-snow_integrations"
                    target="_blank"
                  >
                    Configure ServiceNow
                  </Link>{' '}
                </Button>
              </TextListItem>
              <TextListItem>
                <Button variant="link" isInline>
                  <Link
                    to="https://access.redhat.com/documentation/en-us/red_hat_hybrid_cloud_console/2023/html/integrating_the_red_hat_hybrid_cloud_console_with_third-party_applications/assembly-configuring-integration-with-eda_integrations"
                    target="_blank"
                  >
                    Configure Event-Driven Ansible
                  </Link>{' '}
                </Button>
              </TextListItem>
            </TextList>
          )}
          {category === IntegrationCategory.WEBHOOKS && (
            <Text>
              <Button variant="link" isInline>
                <Link
                  to="https://access.redhat.com/documentation/en-us/red_hat_hybrid_cloud_console/2023/html/integrating_the_red_hat_hybrid_cloud_console_with_third-party_applications/index"
                  target="_blank"
                >
                  Learn more
                  <Icon className="pf-u-ml-sm" isInline>
                    <ArrowRightIcon />
                  </Icon>
                </Link>
              </Button>
            </Text>
          )}
        </TextContent>
      </CardFooter>
    </Card>,
    <Card isFullHeight isPlain key="card-2">
      <CardBody className="pf-v5-u-pt-3xl-on-md">
        <TextContent>
          <Text className="pf-v5-u-font-size-sm pf-v5-u-font-weight-bold pf-v5-u-mb-sm pf-v5-u-link-color-hover">
            <Icon size="md" className="pf-v5-u-pl-sm pf-v5-u-pr-md">
              <LockIcon />
            </Icon>
            Configure user access
          </Text>
          <Text className="pf-v5-u-font-size-sm">
            To configure notifications and integration settings, you must be a
            member of a group with the Notifications administrator role. This
            group must be configured in User Access by an Organization
            Administrator.
          </Text>
        </TextContent>
      </CardBody>
      <CardFooter>
        <Text>
          <Button variant="link" isInline>
            <Link
              to="https://access.redhat.com/documentation/en-us/red_hat_hybrid_cloud_console/2023/html/user_access_configuration_guide_for_role-based_access_control_rbac/index"
              target="_blank"
            >
              Learn more
              <Icon className="pf-u-ml-sm" isInline>
                <ArrowRightIcon />
              </Icon>
            </Link>
          </Button>
        </Text>
      </CardFooter>
    </Card>,
    <Card isFullHeight isPlain key="card-3">
      <CardHeader>
        <TextContent>
          <Text component={TextVariants.h4}>Next Steps</Text>
        </TextContent>
      </CardHeader>
      <CardBody>
        <TextContent>
          <Text className="pf-v5-u-font-size-sm pf-v5-u-font-weight-bold pf-v5-u-mb-sm pf-v5-u-link-color-hover">
            <Icon size="md" className="pf-v5-u-pl-sm pf-v5-u-pr-md">
              <BellIcon />
            </Icon>
            Configure notifications portal
          </Text>
          <Text className="pf-v5-u-font-size-sm">
            You can configure the Hybrid Cloud Console to send event
            notifications to all users on a new or existing channel in Slack,
            Google Chat, or Microsoft Teams.
          </Text>
        </TextContent>
      </CardBody>
      <CardFooter>
        <Text>
          <Button variant="link" isInline>
            <Link
              to="https://access.redhat.com/documentation/en-us/red_hat_hybrid_cloud_console/2023/html/configuring_notifications_on_the_red_hat_hybrid_cloud_console/index"
              target="_blank"
            >
              Learn more
              <Icon className="pf-u-ml-sm" isInline>
                <ArrowRightIcon />
              </Icon>
            </Link>
          </Button>
        </Text>
      </CardFooter>
    </Card>,
  ];

  return (
    <MultiContentCard
      isExpandable
      defaultExpanded
      withHeaderBorder
      withDividers
      toggleText="Making use of Integrations"
      cards={integrationCards}
    />
  );
};

export default DopeBox;
