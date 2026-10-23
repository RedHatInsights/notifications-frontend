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
  Content,
  ContentVariants,
  Icon,
  PageSection,
} from '@patternfly/react-core';
import { ArrowRightIcon, BellIcon, CogIcon, LockIcon } from '@patternfly/react-icons';
import { IntegrationCategory } from '../../types/Integration';
import '../../app/App.scss';
import { Link } from 'react-router-dom';
import useChrome from '@redhat-cloud-services/frontend-components/useChrome';
import { defineMessages, useIntl } from 'react-intl';

const messages = defineMessages({
  gettingStarted: {
    id: 'integrations.dopeBox.gettingStarted',
    defaultMessage: 'Getting Started',
  },
  configureApplications: {
    id: 'integrations.dopeBox.configureApplications',
    defaultMessage: 'Configure applications',
  },
  configureApplicationsBody: {
    id: 'integrations.dopeBox.configureApplicationsBody',
    defaultMessage:
      'To prepare for integration with the Hybrid Cloud Console, you must configure incoming webhooks in your third-party applications.',
  },
  configureSlack: {
    id: 'integrations.dopeBox.configureSlack',
    defaultMessage: 'Configure Slack',
  },
  configureGoogleChat: {
    id: 'integrations.dopeBox.configureGoogleChat',
    defaultMessage: 'Configure Google Chat',
  },
  configureTeams: {
    id: 'integrations.dopeBox.configureTeams',
    defaultMessage: 'Configure Microsoft Teams',
  },
  configureEda: {
    id: 'integrations.dopeBox.configureEda',
    defaultMessage: 'Configure Event-Driven Ansible',
  },
  configurePagerDuty: {
    id: 'integrations.dopeBox.configurePagerDuty',
    defaultMessage: 'Configure PagerDuty',
  },
  configureServiceNow: {
    id: 'integrations.dopeBox.configureServiceNow',
    defaultMessage: 'Configure ServiceNow',
  },
  configureSplunk: {
    id: 'integrations.dopeBox.configureSplunk',
    defaultMessage: 'Configure Splunk',
  },
  learnMore: {
    id: 'integrations.dopeBox.learnMore',
    defaultMessage: 'Learn more',
  },
  configureUserAccess: {
    id: 'integrations.dopeBox.configureUserAccess',
    defaultMessage: 'Configure user access',
  },
  configureUserAccessBody: {
    id: 'integrations.dopeBox.configureUserAccessBody',
    defaultMessage:
      'To configure notifications and integration settings, you must be a member of a group with the Notifications administrator role. This group must be configured in User Access by an Organization Administrator.',
  },
  nextSteps: {
    id: 'integrations.dopeBox.nextSteps',
    defaultMessage: 'Next Steps',
  },
  configureNotificationsPortal: {
    id: 'integrations.dopeBox.configureNotificationsPortal',
    defaultMessage: 'Configure notifications portal',
  },
  configureNotificationsPortalBody: {
    id: 'integrations.dopeBox.configureNotificationsPortalBody',
    defaultMessage:
      'You can configure the Hybrid Cloud Console to send event notifications to all users on a new or existing channel in Slack, Google Chat, or Microsoft Teams.',
  },
  toggleText: {
    id: 'integrations.dopeBox.toggleText',
    defaultMessage: 'Making use of Integrations',
  },
});

interface DopeBoxProps {
  category?: IntegrationCategory;
}

const DopeBox: React.FunctionComponent<DopeBoxProps> = ({ category }) => {
  const chrome = useChrome();
  const intl = useIntl();

  const communicationsDetails = [
    {
      id: 0,
      name: intl.formatMessage(messages.configureSlack),
      onClick: () => {
        chrome.quickStarts.activateQuickstart('integrations-slack-notifs-qs');
      },
    },
    {
      id: 1,
      name: intl.formatMessage(messages.configureGoogleChat),
      url: 'https://docs.redhat.com/en/documentation/red_hat_hybrid_cloud_console/1-latest/extend-set_up_google_chat_integration',
    },
    {
      id: 2,
      name: intl.formatMessage(messages.configureTeams),
      url: 'https://docs.redhat.com/en/documentation/red_hat_hybrid_cloud_console/1-latest/extend-set_up_microsoft_teams_integration',
    },
  ];

  const reportingDetails = [
    {
      id: 3,
      name: intl.formatMessage(messages.configureEda),
      url: 'https://docs.redhat.com/en/documentation/red_hat_hybrid_cloud_console/1-latest/extend-configure_eda_integration',
    },
    {
      id: 4,
      name: intl.formatMessage(messages.configurePagerDuty),
      url: 'https://docs.redhat.com/en/documentation/red_hat_hybrid_cloud_console/1-latest/extend-configure_pagerduty_integration',
    },
    {
      id: 5,
      name: intl.formatMessage(messages.configureServiceNow),
      url: 'https://docs.redhat.com/en/documentation/red_hat_hybrid_cloud_console/1-latest/extend-configure_servicenow_integration',
    },
    {
      id: 6,
      name: intl.formatMessage(messages.configureSplunk),
      url: 'https://docs.redhat.com/en/documentation/red_hat_hybrid_cloud_console/1-latest/extend-configure_splunk_integration',
    },
  ];

  const LearnMoreLink = ({ to }: { to: string }) => (
    <Button variant="link" isInline>
      <Link to={to} target="_blank">
        {intl.formatMessage(messages.learnMore)}
        <Icon className="pf-v6-u-ml-sm" isInline>
          <ArrowRightIcon />
        </Icon>
      </Link>
    </Button>
  );

  const integrationCards = [
    <Card isFullHeight isPlain key="card-1">
      <CardHeader>
        <Content>
          <Content component={ContentVariants.h4}>
            {intl.formatMessage(messages.gettingStarted)}
          </Content>
        </Content>
      </CardHeader>
      <CardBody>
        <Content>
          <Content
            component="p"
            className="pf-v6-u-font-size-sm pf-v6-u-font-weight-bold pf-v6-u-mb-sm pf-v6-u-text-color-link-hover"
          >
            <Icon size="md" className="pf-v6-u-pl-sm pf-v6-u-pr-md">
              <CogIcon className="pf-v6-u-icon-color-brand" />
            </Icon>
            {intl.formatMessage(messages.configureApplications)}
          </Content>
          <Content component="p" className="pf-v6-u-font-size-sm">
            {intl.formatMessage(messages.configureApplicationsBody)}
          </Content>
        </Content>
      </CardBody>
      <CardFooter>
        <Content>
          {category === IntegrationCategory.COMMUNICATIONS && (
            <Content
              component="ul"
              className="pf-v6-u-font-size-sm pf-v6-u-text-color-link pf-v6-u-ml-0"
            >
              {communicationsDetails.map((communication) => (
                <Content component="li" key={communication.id}>
                  <Button variant="link" isInline onClick={() => communication.onClick?.()}>
                    {communication.url ? (
                      <Link to={communication.url} target="_blank">
                        {communication.name}
                      </Link>
                    ) : (
                      communication.name
                    )}{' '}
                  </Button>
                </Content>
              ))}
            </Content>
          )}
          {category === IntegrationCategory.REPORTING && (
            <Content
              component="ul"
              className="pf-v6-u-font-size-sm pf-v6-u-text-color-link pf-v6-u-ml-0"
            >
              {reportingDetails.map((reporting) => (
                <Content component="li" key={reporting.id}>
                  <Button variant="link" isInline>
                    <Link to={reporting.url} target="_blank">
                      {reporting.name}
                    </Link>{' '}
                  </Button>
                </Content>
              ))}
            </Content>
          )}
          {category === IntegrationCategory.WEBHOOKS && (
            <Content component="p">
              <LearnMoreLink to="https://docs.redhat.com/en/documentation/red_hat_hybrid_cloud_console/1-latest/extend-integrate_other_apps_with_webhooks" />
            </Content>
          )}
        </Content>
      </CardFooter>
    </Card>,
    <Card isFullHeight isPlain key="card-2">
      <CardBody className="pf-v6-u-pt-3xl-on-md">
        <Content>
          <Content
            component="p"
            className="pf-v6-u-font-size-sm pf-v6-u-font-weight-bold pf-v6-u-mb-sm pf-v6-u-text-color-link-hover"
          >
            <Icon size="md" className="pf-v6-u-pl-sm pf-v6-u-pr-md">
              <LockIcon className="pf-v6-u-icon-color-brand" />
            </Icon>
            {intl.formatMessage(messages.configureUserAccess)}
          </Content>
          <Content component="p" className="pf-v6-u-font-size-sm">
            {intl.formatMessage(messages.configureUserAccessBody)}
          </Content>
        </Content>
      </CardBody>
      <CardFooter>
        <Content component="p">
          <LearnMoreLink to="https://docs.redhat.com/en/documentation/red_hat_hybrid_cloud_console/1-latest/administer-manage_user_permissions_rbac_models" />
        </Content>
      </CardFooter>
    </Card>,
    {
      content: (
        <Card isFullHeight isPlain key="card-3">
          <CardHeader>
            <Content>
              <Content component={ContentVariants.h4}>
                {intl.formatMessage(messages.nextSteps)}
              </Content>
            </Content>
          </CardHeader>
          <CardBody>
            <Content>
              <Content
                component="p"
                className="pf-v6-u-font-size-sm pf-v6-u-font-weight-bold pf-v6-u-mb-sm pf-v6-u-text-color-link-hover"
              >
                <Icon size="md" className="pf-v6-u-pl-sm pf-v6-u-pr-md">
                  <BellIcon className="pf-v6-u-icon-color-brand" />
                </Icon>
                {intl.formatMessage(messages.configureNotificationsPortal)}
              </Content>
              <Content component="p" className="pf-v6-u-font-size-sm">
                {intl.formatMessage(messages.configureNotificationsPortalBody)}
              </Content>
            </Content>
          </CardBody>
          <CardFooter>
            <Content component="p">
              <LearnMoreLink to="https://docs.redhat.com/en/documentation/red_hat_hybrid_cloud_console/1-latest/observe-configure_notifications_hcc_services" />
            </Content>
          </CardFooter>
        </Card>
      ),
      dividerVariant: MultiContentCardDividerVariant.left,
    },
  ];

  return (
    <PageSection hasBodyWrapper={false} className="pf-v6-u-px-0">
      <MultiContentCard
        isExpandable
        defaultExpanded
        toggleText={intl.formatMessage(messages.toggleText)}
        cards={integrationCards}
      />
    </PageSection>
  );
};

export default DopeBox;
