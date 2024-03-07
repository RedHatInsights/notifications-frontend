import React from 'react';
import MultiContentCard, {
  MultiContentCardDividerVariant,
} from '@patternfly/react-component-groups/dist/dynamic/MultiContentCard';
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Icon,
  PageSection,
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
  const communicationsDetails = [
    {
      id: 0,
      name: 'Configure Slack',
      url: 'https://access.redhat.com/documentation/en-us/red_hat_hybrid_cloud_console/2023/html/integrating_the_red_hat_hybrid_cloud_console_with_third-party_applications/assembly-configuring-insights-integration-with-slack_integrations',
    },
    {
      id: 1,
      name: 'Configure Google Chat',
      url: 'https://access.redhat.com/documentation/en-us/red_hat_hybrid_cloud_console/2023/html/integrating_the_red_hat_hybrid_cloud_console_with_third-party_applications/assembly-configuring-integration-with-gchat_integrations',
    },
    {
      id: 2,
      name: 'Configure Microsoft Teams',
      url: 'https://access.redhat.com/documentation/en-us/red_hat_hybrid_cloud_console/2023/html/integrating_the_red_hat_hybrid_cloud_console_with_third-party_applications/assembly-configuring-integration-with-teams_integrations',
    },
  ];

  const reportingDetails = [
    {
      id: 3,
      name: 'Configure Splunk',
      url: 'https://access.redhat.com/documentation/en-us/red_hat_hybrid_cloud_console/2023/html/integrating_the_red_hat_hybrid_cloud_console_with_third-party_applications/assembly-installing-configuring-insights-for-splunk_integrations',
    },
    {
      id: 4,
      name: 'Configure ServiceNow',
      url: 'https://access.redhat.com/documentation/en-us/red_hat_hybrid_cloud_console/2023/html/integrating_the_red_hat_hybrid_cloud_console_with_third-party_applications/assembly-installing-configuring-insights-for-snow_integrations',
    },
    {
      id: 5,
      name: 'Configure Event-Driven Ansible',
      url: 'https://access.redhat.com/documentation/en-us/red_hat_hybrid_cloud_console/2023/html/integrating_the_red_hat_hybrid_cloud_console_with_third-party_applications/assembly-configuring-integration-with-eda_integrations',
    },
  ];

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
            <Icon
              size="md"
              className="pf-v5-u-pl-sm pf-v5-u-pr-md pf-v5-u-color-200"
            >
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
              {communicationsDetails.map((communication) => (
                <TextListItem key={communication.id}>
                  <Button variant="link" isInline>
                    <Link to={communication.url} target="_blank">
                      {communication.name}
                    </Link>{' '}
                  </Button>
                </TextListItem>
              ))}
            </TextList>
          )}
          {category === IntegrationCategory.REPORTING && (
            <TextList className="pf-v5-u-font-size-sm pf-v5-u-link-color pf-v5-u-ml-0">
              {reportingDetails.map((reporting) => (
                <TextListItem key={reporting.id}>
                  <Button variant="link" isInline>
                    <Link to={reporting.url} target="_blank">
                      {reporting.name}
                    </Link>{' '}
                  </Button>
                </TextListItem>
              ))}
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
            <Icon
              size="md"
              className="pf-v5-u-pl-sm pf-v5-u-pr-md pf-v5-u-color-200"
            >
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
    {
      content: (
        <Card isFullHeight isPlain key="card-3">
          <CardHeader>
            <TextContent>
              <Text component={TextVariants.h4}>Next Steps</Text>
            </TextContent>
          </CardHeader>
          <CardBody>
            <TextContent>
              <Text className="pf-v5-u-font-size-sm pf-v5-u-font-weight-bold pf-v5-u-mb-sm pf-v5-u-link-color-hover">
                <Icon
                  size="md"
                  className="pf-v5-u-pl-sm pf-v5-u-pr-md pf-v5-u-color-200"
                >
                  <BellIcon />
                </Icon>
                Configure notifications portal
              </Text>
              <Text className="pf-v5-u-font-size-sm">
                You can configure the Hybrid Cloud Console to send event
                notifications to all users on a new or existing channel in
                Slack, Google Chat, or Microsoft Teams.
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
        </Card>
      ),
      dividerVariant: MultiContentCardDividerVariant.left,
    },
  ];

  return (
    <PageSection className="pf-v5-u-px-0">
      <MultiContentCard
        isExpandable
        defaultExpanded
        toggleText="Making use of Integrations"
        cards={integrationCards}
      />
    </PageSection>
  );
};

export default DopeBox;
