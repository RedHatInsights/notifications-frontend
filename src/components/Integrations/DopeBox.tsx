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
import useChrome from '@redhat-cloud-services/frontend-components/useChrome';

interface DopeBoxProps {
  category?: IntegrationCategory;
}

const DopeBox: React.FunctionComponent<DopeBoxProps> = ({ category }) => {
  const chrome = useChrome();

  const communicationsDetails = [
    {
      id: 0,
      name: 'Configure Slack',
      onClick: () => {
        chrome.quickStarts.activateQuickstart('integrations-slack-notifs-qs');
      },
    },
    {
      id: 1,
      name: 'Configure Google Chat',
      url: 'https://docs.redhat.com/en/documentation/red_hat_hybrid_cloud_console/1-latest/html-single/integrating_the_red_hat_hybrid_cloud_console_with_third-party_applications/index#assembly-configuring-integration-with-gchat_integrating-communications',
    },
    {
      id: 2,
      name: 'Configure Microsoft Teams',
      url: 'https://docs.redhat.com/en/documentation/red_hat_hybrid_cloud_console/1-latest/html-single/integrating_the_red_hat_hybrid_cloud_console_with_third-party_applications/index#assembly-configuring-integration-with-teams_integrating-communications',
    },
  ];

  const reportingDetails = [
    {
      id: 3,
      name: 'Configure Event-Driven Ansible',
      url: 'https://docs.redhat.com/en/documentation/red_hat_hybrid_cloud_console/1-latest/html-single/integrating_the_red_hat_hybrid_cloud_console_with_third-party_applications/index#assembly-configuring-integration-with-eda_integrating-communications',
    },
    {
      id: 4,
      name: 'Configure PagerDuty',
      url: 'https://docs.redhat.com/en/documentation/red_hat_hybrid_cloud_console/1-latest/html-single/integrating_the_red_hat_hybrid_cloud_console_with_third-party_applications/index#assembly-configuring-integration-with-pagerduty_integrating-communications',
    },
    {
      id: 5,
      name: 'Configure ServiceNow',
      url: 'https://docs.redhat.com/en/documentation/red_hat_hybrid_cloud_console/1-latest/html-single/integrating_the_red_hat_hybrid_cloud_console_with_third-party_applications/index#assembly-installing-configuring-insights-for-snow_integrating-communications',
    },
    {
      id: 6,
      name: 'Configure Splunk',
      url: 'https://docs.redhat.com/en/documentation/red_hat_hybrid_cloud_console/1-latest/html-single/integrating_the_red_hat_hybrid_cloud_console_with_third-party_applications/index#assembly-installing-configuring-insights-for-splunk_integrating-communications',
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
            <Icon size="md" className="pf-v5-u-pl-sm pf-v5-u-pr-md">
              <CogIcon className="pf-v5-u-primary-color-100" />
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
                  <Button
                    variant="link"
                    isInline
                    onClick={() => communication.onClick?.()}
                  >
                    {communication.url ? (
                      <Link to={communication.url} target="_blank">
                        {communication.name}
                      </Link>
                    ) : (
                      communication.name
                    )}{' '}
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
                  to="https://docs.redhat.com/en/documentation/red_hat_hybrid_cloud_console/1-latest/html-single/integrating_the_red_hat_hybrid_cloud_console_with_third-party_applications/index#assembly-configuring-integration-with-webhooks_integrating-communications"
                  target="_blank"
                >
                  Learn more
                  <Icon className="pf-v5-u-ml-sm" isInline>
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
              <LockIcon className="pf-v5-u-primary-color-100" />
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
              <Icon className="pf-v5-u-ml-sm" isInline>
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
                <Icon size="md" className="pf-v5-u-pl-sm pf-v5-u-pr-md">
                  <BellIcon className="pf-v5-u-primary-color-100" />
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
                  <Icon className="pf-v5-u-ml-sm" isInline>
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
