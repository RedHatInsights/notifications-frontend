import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardTitle,
  DataList,
  Divider,
  Flex,
  FlexItem,
  Grid,
  GridItem,
  Icon,
  Label,
  Title,
} from '@patternfly/react-core';
import {
  ArrowRightIcon,
  ExternalLinkAltIcon,
  RunningIcon,
  UserIcon,
} from '@patternfly/react-icons';
import Main from '@redhat-cloud-services/frontend-components/Main';
import PageHeaderTitle from '@redhat-cloud-services/frontend-components/PageHeader/PageHeaderTitle';
import PageHeader from '@redhat-cloud-services/frontend-components/PageHeader/PageHeader';
import useChrome from '@redhat-cloud-services/frontend-components/useChrome';
import { useFlag } from '@unleash/proxy-client-react';
import React from 'react';
import { FormattedMessage, defineMessages, useIntl } from 'react-intl';
import { useNavigate } from 'react-router-dom';

import notificationsProductIcon from '../../../assets/icons/notifications-product-icon.svg';
import CustomDataListItem, { IconName } from './CustomDataListItem';
import { Table, Tbody, Td, Tr } from '@patternfly/react-table';

const VERTICAL = { default: 'vertical' } as const;
const LEARN_MORE =
  'https://docs.redhat.com/en/documentation/red_hat_hybrid_cloud_console/1-latest/observe-configure_notifications_hcc_services';
const CONFIGURE_INTEGRATIONS =
  'https://docs.redhat.com/en/documentation/red_hat_hybrid_cloud_console/1-latest/extend-manage_alerts_preferred_platform';

const messages = defineMessages({
  pageTitle: {
    id: 'notifications.overview.pageTitle',
    defaultMessage: 'Notifications',
  },
  pageDescription: {
    id: 'notifications.overview.pageDescription',
    defaultMessage:
      'Receive notifications about events that occur in your console services. You can choose to receive notifications by email, in third-party applications, or from a combination of these methods.',
  },
  manageEventsTitle: {
    id: 'notifications.overview.manageEvents.title',
    defaultMessage: 'Manage events for your organization',
  },
  manageEventsBody: {
    id: 'notifications.overview.manageEvents.body',
    defaultMessage:
      'Control which notifications different users within your organization can receive by creating behavior groups and associating them with specific events. Users can then select the event notifications they want to receive and how to be notified in their {link}.',
  },
  notificationPreferencesLink: {
    id: 'notifications.overview.manageEvents.notificationPreferencesLink',
    defaultMessage: 'Notification Preferences',
  },
  configureEventsButton: {
    id: 'notifications.overview.manageEvents.configureEventsButton',
    defaultMessage: 'Configure events',
  },
  getStartedTitle: {
    id: 'notifications.overview.getStarted.title',
    defaultMessage: 'Get started with Notifications on the Hybrid Cloud Console',
  },
  manageOwnTitle: {
    id: 'notifications.overview.getStarted.manageOwn.title',
    defaultMessage: 'Manage your own notifications with Notification Preferences',
  },
  manageOwnBody: {
    id: 'notifications.overview.getStarted.manageOwn.body',
    defaultMessage:
      'This service allows you to opt-in and out of receiving notifications. Your Organization Administrator has configured which notifications you can or can not receive in their Settings.',
  },
  goToPreferencesButton: {
    id: 'notifications.overview.getStarted.manageOwn.button',
    defaultMessage: 'Go to Notification Preferences',
  },
  eventLogTitle: {
    id: 'notifications.overview.getStarted.eventLog.title',
    defaultMessage: 'Monitor all fired events with the Event log',
  },
  eventLogBody: {
    id: 'notifications.overview.getStarted.eventLog.body',
    defaultMessage:
      'See all the events affecting your organization and view details around the events fired.',
  },
  viewEventLogButton: {
    id: 'notifications.overview.getStarted.eventLog.button',
    defaultMessage: 'View Event log',
  },
  supportingFeaturesTitle: {
    id: 'notifications.overview.supportingFeatures.title',
    defaultMessage: 'Supporting features',
  },
  supportingFeaturesAria: {
    id: 'notifications.overview.supportingFeatures.aria',
    defaultMessage: 'Supporting features list',
  },
  supportingPrefsHeading: {
    id: 'notifications.overview.supportingFeatures.prefs.heading',
    defaultMessage: 'Manage your own notifications with Notification Preferences',
  },
  supportingPrefsLink: {
    id: 'notifications.overview.supportingFeatures.prefs.link',
    defaultMessage: 'Go to Notification Preferences',
  },
  supportingPrefsContent: {
    id: 'notifications.overview.supportingFeatures.prefs.content',
    defaultMessage:
      'Select the events you want to be notified about, and how to receive notifications. Your Organization Administrator has configured which notifications you can or can\u2019t receive in their Settings.',
  },
  supportingEventLogHeading: {
    id: 'notifications.overview.supportingFeatures.eventLog.heading',
    defaultMessage: 'Monitor all fired events with the Event log',
  },
  supportingEventLogLink: {
    id: 'notifications.overview.supportingFeatures.eventLog.link',
    defaultMessage: 'View Event log',
  },
  supportingEventLogContent: {
    id: 'notifications.overview.supportingFeatures.eventLog.content',
    defaultMessage:
      'See all the events occurring in your organization and view details about the triggered events.',
  },
  supportingIntegrationsHeading: {
    id: 'notifications.overview.supportingFeatures.integrations.heading',
    defaultMessage: 'Set up Integrations to customize your notifications',
  },
  supportingIntegrationsLink: {
    id: 'notifications.overview.supportingFeatures.integrations.link',
    defaultMessage: 'Set up Integrations',
  },
  supportingIntegrationsContent: {
    id: 'notifications.overview.supportingFeatures.integrations.content',
    defaultMessage:
      'The notifications and integrations services work together to transmit messages to third-party applications, such as instant messaging platforms and external ticketing systems, when events occur. Integrations include Splunk, Slack, ServiceNow, {link}.',
  },
  supportingIntegrationsMoreLink: {
    id: 'notifications.overview.supportingFeatures.integrations.moreLink',
    defaultMessage: 'and more',
  },
  supportingBehaviorGroupsHeading: {
    id: 'notifications.overview.supportingFeatures.behaviorGroups.heading',
    defaultMessage: 'Create behavior groups to easily notify the right users',
  },
  supportingBehaviorGroupsLink: {
    id: 'notifications.overview.supportingFeatures.behaviorGroups.link',
    defaultMessage: 'Create new behavior group',
  },
  supportingBehaviorGroupsContent: {
    id: 'notifications.overview.supportingFeatures.behaviorGroups.content',
    defaultMessage:
      'Configure which notifications different users in your organization can receive, and how to notify groups of users when selected events occur.',
  },
  supportingErrataHeading: {
    id: 'notifications.overview.supportingFeatures.errata.heading',
    defaultMessage: 'Manage errata for your Subscriptions',
  },
  supportingErrataLink: {
    id: 'notifications.overview.supportingFeatures.errata.link',
    defaultMessage: 'Manage subscriptions errata',
  },
  supportingErrataContent: {
    id: 'notifications.overview.supportingFeatures.errata.content',
    defaultMessage:
      'Configure notifications for product advisories that affect your purchased subscriptions. Managing these notifications can be done in your {link}.',
  },
  supportingErrataPrefsLink: {
    id: 'notifications.overview.supportingFeatures.errata.prefsLink',
    defaultMessage: 'Notifications preferences',
  },
  aboutNotificationsHeading: {
    id: 'notifications.overview.about.heading',
    defaultMessage: 'About Notifications',
  },
  aboutNotificationsContent: {
    id: 'notifications.overview.about.content',
    defaultMessage:
      'Notifications are a way for users to be alerted of important events that occur in the Hybrid Cloud Console. You can receive notifications through email and third-party integrations, such as Slack or ServiceNow.',
  },
  recommendedContentTitle: {
    id: 'notifications.overview.recommendedContent.title',
    defaultMessage: 'Recommended content',
  },
  recommendedContentAria: {
    id: 'notifications.overview.recommendedContent.aria',
    defaultMessage: 'Recommended content',
  },
  configuringNotificationsLabel: {
    id: 'notifications.overview.recommendedContent.configuringNotifications',
    defaultMessage: 'Configuring Notifications',
  },
  configuringIntegrationsLabel: {
    id: 'notifications.overview.recommendedContent.configuringIntegrations',
    defaultMessage: 'Configuring Integrations',
  },
  restrictingAccessLabel: {
    id: 'notifications.overview.recommendedContent.restrictingAccess',
    defaultMessage: 'Restricting access to a service to a team',
  },
  configuringNotificationsIntegrationsLabel: {
    id: 'notifications.overview.recommendedContent.configuringNotificationsIntegrations',
    defaultMessage: 'Configuring notifications and integrations',
  },
  configuringIntegrationsServicesLabel: {
    id: 'notifications.overview.recommendedContent.configuringIntegrationsServices',
    defaultMessage: 'Configuring integrations for Red Hat services',
  },
  documentationLabel: {
    id: 'notifications.overview.recommendedContent.documentation',
    defaultMessage: 'Documentation',
  },
  quickStartLabel: {
    id: 'notifications.overview.recommendedContent.quickStart',
    defaultMessage: 'Quick start',
  },
  viewDocumentationLink: {
    id: 'notifications.overview.recommendedContent.viewDocumentation',
    defaultMessage: 'View documentation',
  },
  beginQuickStartLink: {
    id: 'notifications.overview.recommendedContent.beginQuickStart',
    defaultMessage: 'Begin Quick start',
  },
  viewAllLearningResources: {
    id: 'notifications.overview.recommendedContent.viewAll',
    defaultMessage: 'View all Settings Learning Resources',
  },
});

export const NotificationsOverviewPage: React.FunctionComponent = () => {
  const navigate = useNavigate();
  const isSourcesIntegrations = useFlag('platform.sources.integrations');
  const [isOrgAdmin, setIsOrgAdmin] = React.useState(null);
  const { auth, isBeta, getBundle } = useChrome();
  const notificationsOverhaul = useFlag('platform.notifications.overhaul');
  const errataNotifications = useFlag('platform.notifications.errata.userpreferences');
  const intl = useIntl();
  const basePath = isBeta() ? '/preview' : '';
  React.useEffect(() => {
    const getUser = async () => {
      const {
        identity: { user },
      }: // eslint-disable-next-line @typescript-eslint/no-explicit-any
      any = await auth.getUser();
      setIsOrgAdmin(user.is_org_admin);
    };

    if (auth) {
      getUser();
    }
  }, [auth]);

  return (
    <React.Fragment>
      <PageHeader>
        <Flex className="pf-v6-u-flex-nowrap">
          <FlexItem>
            <img src={notificationsProductIcon} />
          </FlexItem>
          <Divider orientation={VERTICAL} />
          <FlexItem className="pf-v6-u-align-self-flex-start">
            <PageHeaderTitle
              title={intl.formatMessage(messages.pageTitle)}
              className="pf-v6-u-mb-sm"
            />
            <p className="pf-v6-u-mb-sm">
              <FormattedMessage {...messages.pageDescription} />
            </p>
          </FlexItem>
        </Flex>
      </PageHeader>
      <Main>
        {isOrgAdmin ? (
          <React.Fragment>
            <Card className="pf-v6-u-mb-lg">
              <Grid hasGutter>
                <GridItem sm={12} md={6} lg={8}>
                  <CardTitle>
                    <Title headingLevel="h2">
                      <FormattedMessage {...messages.manageEventsTitle} />
                    </Title>
                  </CardTitle>
                  <CardBody>
                    <p>
                      <FormattedMessage
                        {...messages.manageEventsBody}
                        values={{
                          link: (
                            <a
                              href={`${basePath}/${getBundle()}/notifications/user-preferences`}
                              onClick={(e) => {
                                e.preventDefault();
                                navigate(`/${getBundle()}/notifications/user-preferences`);
                              }}
                            >
                              <FormattedMessage {...messages.notificationPreferencesLink} />
                            </a>
                          ),
                        }}
                      />
                    </p>
                  </CardBody>
                  <CardFooter>
                    <Button
                      variant="primary"
                      component="a"
                      href={`${basePath}/${getBundle()}/notifications/configure-events`}
                      size="lg"
                      onClick={(e) => {
                        e.preventDefault();
                        navigate(`/${getBundle()}/notifications/configure-events`);
                      }}
                    >
                      <FormattedMessage {...messages.configureEventsButton} />
                    </Button>
                  </CardFooter>
                </GridItem>
                <GridItem
                  md={6}
                  lg={4}
                  className="pf-v6-u-display-none pf-v6-u-display-block-on-md pf-v6-c-card__cover-image"
                ></GridItem>
              </Grid>
            </Card>
          </React.Fragment>
        ) : (
          <React.Fragment>
            <Title headingLevel="h2" className="pf-v6-u-mb-md">
              <FormattedMessage {...messages.getStartedTitle} />
            </Title>
            <Grid hasGutter className="pf-v6-u-mb-lg">
              <GridItem sm={12} md={6}>
                <Card className="pf-v6-u-h-100">
                  <CardTitle>
                    <Flex className="pf-v6-u-flex-nowrap">
                      <FlexItem>
                        <Icon size="lg">
                          <UserIcon className="pf-v6-u-icon-color-brand" />
                        </Icon>
                      </FlexItem>
                      <FlexItem>
                        <Title headingLevel="h2">
                          <FormattedMessage {...messages.manageOwnTitle} />
                        </Title>
                      </FlexItem>
                    </Flex>
                  </CardTitle>
                  <CardBody>
                    <p>
                      <FormattedMessage {...messages.manageOwnBody} />
                    </p>
                  </CardBody>
                  <CardFooter>
                    <Button
                      variant="primary"
                      size="lg"
                      component="a"
                      href={`${basePath}/${getBundle()}/notifications/user-preferences`}
                      onClick={(e) => {
                        e.preventDefault();
                        navigate(`/${getBundle()}/notifications/user-preferences`);
                      }}
                    >
                      <FormattedMessage {...messages.goToPreferencesButton} />
                    </Button>
                  </CardFooter>
                </Card>
              </GridItem>
              <GridItem sm={12} md={6}>
                <Card className="pf-v6-u-h-100">
                  <CardTitle>
                    <Flex className="pf-v6-u-flex-nowrap">
                      <FlexItem>
                        <Icon size="lg">
                          <RunningIcon className="pf-v6-u-icon-color-brand" />
                        </Icon>
                      </FlexItem>
                      <FlexItem>
                        <Title headingLevel="h2">
                          <FormattedMessage {...messages.eventLogTitle} />
                        </Title>
                      </FlexItem>
                    </Flex>
                  </CardTitle>
                  <CardBody>
                    <p>
                      <FormattedMessage {...messages.eventLogBody} />
                    </p>
                  </CardBody>
                  <CardFooter>
                    {!notificationsOverhaul && (
                      <Button
                        variant="secondary"
                        size="lg"
                        component="a"
                        href={`${basePath}/${getBundle()}/notifications/user-preferences`}
                        onClick={(e) => {
                          e.preventDefault();
                          navigate(`/${getBundle()}/notifications/eventlog`);
                        }}
                      >
                        <FormattedMessage {...messages.viewEventLogButton} />
                      </Button>
                    )}
                  </CardFooter>
                </Card>
              </GridItem>
            </Grid>
          </React.Fragment>
        )}

        {isOrgAdmin ? (
          <React.Fragment>
            <Title headingLevel="h2" className="pf-v6-u-mb-md">
              <FormattedMessage {...messages.supportingFeaturesTitle} />
            </Title>

            <DataList
              aria-label={intl.formatMessage(messages.supportingFeaturesAria)}
              className="pf-v6-u-mb-lg"
            >
              <CustomDataListItem
                icon={IconName.USER}
                isExpanded
                heading={intl.formatMessage(messages.supportingPrefsHeading)}
                linkTitle={intl.formatMessage(messages.supportingPrefsLink)}
                linkTarget={`${basePath}/${getBundle()}/notifications/user-preferences`}
                expandableContent={intl.formatMessage(messages.supportingPrefsContent)}
              />
              <CustomDataListItem
                icon={IconName.RUNNING}
                heading={intl.formatMessage(messages.supportingEventLogHeading)}
                linkTitle={intl.formatMessage(messages.supportingEventLogLink)}
                linkTarget={`${basePath}/${getBundle()}/notifications/eventlog `}
                expandableContent={intl.formatMessage(messages.supportingEventLogContent)}
              />
              <CustomDataListItem
                icon={IconName.INTEGRATION}
                heading={intl.formatMessage(messages.supportingIntegrationsHeading)}
                linkTitle={intl.formatMessage(messages.supportingIntegrationsLink)}
                {...(isSourcesIntegrations && { isRedirect: true })}
                linkTarget={
                  isSourcesIntegrations
                    ? `${basePath}/settings/sources?category=Communications`
                    : `${basePath}/${getBundle()}/notifications/integrations`
                }
                expandableContent={
                  <span>
                    <FormattedMessage
                      {...messages.supportingIntegrationsContent}
                      values={{
                        link: (
                          <a
                            href={
                              'https://docs.redhat.com/en/documentation/red_hat_hybrid_cloud_console/1-latest/extend-manage_alerts_preferred_platform'
                            }
                          >
                            <FormattedMessage {...messages.supportingIntegrationsMoreLink} />
                          </a>
                        ),
                      }}
                    />
                  </span>
                }
              />
              <CustomDataListItem
                icon={IconName.USERS}
                heading={intl.formatMessage(messages.supportingBehaviorGroupsHeading)}
                linkTitle={intl.formatMessage(messages.supportingBehaviorGroupsLink)}
                linkTarget={`${basePath}/${getBundle()}/notifications/configure-events?activeTab=behaviorGroups`}
                expandableContent={intl.formatMessage(messages.supportingBehaviorGroupsContent)}
              />
              {errataNotifications && (
                <CustomDataListItem
                  icon={IconName.BUG}
                  heading={intl.formatMessage(messages.supportingErrataHeading)}
                  linkTitle={intl.formatMessage(messages.supportingErrataLink)}
                  linkTarget={`${basePath}/${getBundle()}/notifications/user-preferences?bundle=subscription-services&app=errata-notifications`}
                  expandableContent={
                    <span>
                      <FormattedMessage
                        {...messages.supportingErrataContent}
                        values={{
                          link: (
                            <Button
                              component="a"
                              href={`${basePath}/${getBundle()}/notifications/user-preferences`}
                              className="pf-v6-u-px-0"
                              variant="link"
                              onClick={(e) => {
                                e.preventDefault();
                                navigate(
                                  `${basePath}/${getBundle()}/notifications/user-preferences`
                                );
                              }}
                            >
                              <FormattedMessage {...messages.supportingErrataPrefsLink} />
                            </Button>
                          ),
                        }}
                      />
                    </span>
                  }
                />
              )}
            </DataList>
          </React.Fragment>
        ) : (
          <React.Fragment>
            <DataList
              aria-label={intl.formatMessage(messages.supportingFeaturesAria)}
              className="pf-v6-u-mb-lg"
            >
              <CustomDataListItem
                icon={IconName.BELL}
                heading={intl.formatMessage(messages.aboutNotificationsHeading)}
                expandableContent={intl.formatMessage(messages.aboutNotificationsContent)}
              />
            </DataList>
          </React.Fragment>
        )}

        <Title headingLevel="h2" className="pf-v6-u-mb-md">
          <FormattedMessage {...messages.recommendedContentTitle} />
        </Title>

        {isOrgAdmin ? (
          <React.Fragment>
            <Table
              aria-label={intl.formatMessage(messages.recommendedContentAria)}
              className="pf-v6-u-mb-lg"
            >
              <Tbody>
                <Tr className="noti-c-table-border-top">
                  <Td>
                    <FormattedMessage {...messages.configuringNotificationsLabel} />
                  </Td>
                  <Td>
                    <Label color="orange">
                      <FormattedMessage {...messages.documentationLabel} />
                    </Label>
                  </Td>
                  <Td className="pf-v6-u-text-align-end">
                    <a
                      href={LEARN_MORE}
                      onClick={(e) => {
                        e.preventDefault();
                        window.open(LEARN_MORE, '_blank');
                      }}
                    >
                      <FormattedMessage {...messages.viewDocumentationLink} />
                      <ExternalLinkAltIcon />
                    </a>
                  </Td>
                </Tr>
                <Tr>
                  <Td>
                    <FormattedMessage {...messages.configuringIntegrationsLabel} />
                  </Td>
                  <Td>
                    <Label color="orange">
                      <FormattedMessage {...messages.documentationLabel} />
                    </Label>
                  </Td>
                  <Td className="pf-v6-u-text-align-end">
                    <a
                      href={CONFIGURE_INTEGRATIONS}
                      onClick={(e) => {
                        e.preventDefault();
                        window.open(CONFIGURE_INTEGRATIONS, '_blank');
                      }}
                    >
                      <FormattedMessage {...messages.viewDocumentationLink} />
                      <ExternalLinkAltIcon />
                    </a>
                  </Td>
                </Tr>
                <Tr>
                  <Td>
                    <FormattedMessage {...messages.restrictingAccessLabel} />
                  </Td>
                  <Td>
                    <Label color="green">
                      <FormattedMessage {...messages.quickStartLabel} />
                    </Label>
                  </Td>
                  <Td className="pf-v6-u-text-align-end">
                    <a
                      href={`${basePath}/iam/my-user-access?bundle=rhel&quickstart=rbac-admin-vuln-permissions`}
                    >
                      <FormattedMessage {...messages.beginQuickStartLink} />
                      <ArrowRightIcon />
                    </a>
                  </Td>
                </Tr>
              </Tbody>
            </Table>
          </React.Fragment>
        ) : (
          <React.Fragment>
            <Table
              aria-label={intl.formatMessage(messages.recommendedContentAria)}
              className="pf-v6-u-mb-lg"
            >
              <Tbody>
                <Tr className="noti-c-table-border-top">
                  <Td>
                    <FormattedMessage {...messages.configuringNotificationsIntegrationsLabel} />
                  </Td>
                  <Td>
                    <Label color="orange">
                      <FormattedMessage {...messages.documentationLabel} />
                    </Label>
                  </Td>
                  <Td className="pf-v6-u-text-align-end">
                    <a
                      href={LEARN_MORE}
                      onClick={(e) => {
                        e.preventDefault();
                        window.open(LEARN_MORE, '_blank');
                      }}
                    >
                      <FormattedMessage {...messages.viewDocumentationLink} />
                      <ExternalLinkAltIcon />
                    </a>
                  </Td>
                </Tr>
                <Tr>
                  <Td>
                    <FormattedMessage {...messages.configuringIntegrationsServicesLabel} />
                  </Td>
                  <Td>
                    <Label color="orange">
                      <FormattedMessage {...messages.documentationLabel} />
                    </Label>
                  </Td>
                  <Td className="pf-v6-u-text-align-end">
                    <a
                      href={CONFIGURE_INTEGRATIONS}
                      onClick={(e) => {
                        e.preventDefault();
                        window.open(CONFIGURE_INTEGRATIONS, '_blank');
                      }}
                    >
                      <FormattedMessage {...messages.viewDocumentationLink} />
                      <ExternalLinkAltIcon />
                    </a>
                  </Td>
                </Tr>
              </Tbody>
            </Table>
          </React.Fragment>
        )}
        <a href={`${basePath}/settings/learning-resources`} className="pf-v6-u-mb-lg">
          <FormattedMessage {...messages.viewAllLearningResources} />
        </a>
      </Main>
    </React.Fragment>
  );
};
