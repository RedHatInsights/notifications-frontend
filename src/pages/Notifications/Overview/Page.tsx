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
import { useLocation, useNavigate } from 'react-router-dom';

import notificationsProductIcon from '../../../assets/icons/notifications-product-icon.svg';
import CustomDataListItem, { IconName } from './CustomDataListItem';
import { Table, Tbody, Td, Tr } from '@patternfly/react-table';

// eslint-disable-next-line max-len
const LEARN_MORE =
  'https://access.redhat.com/documentation/en-us/red_hat_hybrid_cloud_console/1-latest/html-single/configuring_notifications_on_the_red_hat_hybrid_cloud_console/index';
// eslint-disable-next-line max-len
const CONFIGURE_INTEGRATIONS =
  'https://access.redhat.com/documentation/en-us/red_hat_hybrid_cloud_console/1-latest/html-single/integrating_the_red_hat_hybrid_cloud_console_with_third-party_applications/index#doc-wrapper';
// eslint-disable-next-line max-len
const CONFIGURE_SOURCES =
  'https://access.redhat.com/documentation/en-us/red_hat_hybrid_cloud_console/2023/html/configuring_sources_for_red_hat_services/index';

export const NotificationsOverviewPage: React.FunctionComponent = () => {
  const params = useLocation();
  console.log(params, 'this is params!');
  const navigate = useNavigate();
  const isSourcesIntegrations = useFlag('platform.sources.integrations');
  const [isOrgAdmin, setIsOrgAdmin] = React.useState(null);
  const { auth, isBeta, getBundle } = useChrome();
  const notificationsOverhaul = useFlag('platform.notifications.overhaul');
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
        <Flex className="pf-u-flex-nowrap">
          <FlexItem>
            <img src={notificationsProductIcon} />
          </FlexItem>
          <Divider
            orientation={{
              default: 'vertical',
            }}
          />
          <FlexItem className="pf-u-align-self-flex-start">
            <PageHeaderTitle title="Notifications" className="pf-u-mb-sm" />
            <p className="pf-u-mb-sm">
              Receive notifications about events that occur in your console
              services. You can choose to receive notifications by email, in
              third-party applications, or from a combination of these methods.
            </p>
          </FlexItem>
        </Flex>
      </PageHeader>
      <Main>
        {isOrgAdmin ? (
          <React.Fragment>
            <Card className="pf-u-mb-lg">
              <Grid hasGutter>
                <GridItem sm={12} md={6} lg={8}>
                  <CardTitle>
                    <Title headingLevel="h2">
                      Manage events for your organization
                    </Title>
                  </CardTitle>
                  <CardBody>
                    <p>
                      Control which notifications different users within your
                      organization can receive by creating behavior groups and
                      associating them with specific events. Users can then
                      select the event notifications they want to receive and
                      how to be notified in their{' '}
                      <a
                        href={`${
                          isBeta() ? '/preview' : ''
                        }/${getBundle()}/notifications/user-preferences`}
                        onClick={(e) => {
                          e.preventDefault();
                          navigate(
                            `/${getBundle()}/notifications/user-preferences`
                          );
                        }}
                      >
                        Notification Preferences
                      </a>
                      .
                    </p>
                  </CardBody>
                  <CardFooter>
                    <Button
                      variant="primary"
                      component="a"
                      href={`${
                        isBeta() ? '/preview' : ''
                      }/${getBundle()}/notifications/configure-events`}
                      size="lg"
                      onClick={(e) => {
                        e.preventDefault();
                        navigate(
                          `/${getBundle()}/notifications/configure-events`
                        );
                      }}
                    >
                      Configure events
                    </Button>
                  </CardFooter>
                </GridItem>
                <GridItem
                  md={6}
                  lg={4}
                  className="pf-u-display-none pf-u-display-block-on-md pf-c-card__cover-image"
                ></GridItem>
              </Grid>
            </Card>
          </React.Fragment>
        ) : (
          <React.Fragment>
            <Title headingLevel="h2" className="pf-u-mb-md">
              Get started with Notifications on the Hybrid Cloud Console
            </Title>
            <Grid hasGutter className="pf-u-mb-lg">
              <GridItem sm={12} md={6}>
                <Card className="pf-u-h-100">
                  <CardTitle>
                    <Flex className="pf-u-flex-nowrap">
                      <FlexItem>
                        <Icon size="lg">
                          <UserIcon className="pf-u-primary-color-100" />
                        </Icon>
                      </FlexItem>
                      <FlexItem>
                        <Title headingLevel="h2">
                          Manage your own notifications with Notification
                          Preferences
                        </Title>
                      </FlexItem>
                    </Flex>
                  </CardTitle>
                  <CardBody>
                    <p>
                      This service allows you to opt-in and out of receiving
                      notifications. Your Organization Administrator has
                      configured which notifications you can or can not receive
                      in their Settings.
                    </p>
                  </CardBody>
                  <CardFooter>
                    <Button
                      variant="primary"
                      size="lg"
                      component="a"
                      href={`${
                        isBeta() ? '/preview' : ''
                      }/${getBundle()}/notifications/user-preferences`}
                      onClick={(e) => {
                        e.preventDefault();
                        navigate(
                          `/${getBundle()}/notifications/user-preferences`
                        );
                      }}
                    >
                      Go to Notification Preferences
                    </Button>
                  </CardFooter>
                </Card>
              </GridItem>
              <GridItem sm={12} md={6}>
                <Card className="pf-u-h-100">
                  <CardTitle>
                    <Flex className="pf-u-flex-nowrap">
                      <FlexItem>
                        <Icon size="lg">
                          <RunningIcon className="pf-u-primary-color-100" />
                        </Icon>
                      </FlexItem>
                      <FlexItem>
                        <Title headingLevel="h2">
                          Monitor all fired events with the Event log
                        </Title>
                      </FlexItem>
                    </Flex>
                  </CardTitle>
                  <CardBody>
                    <p>
                      See all the events affecting your organization and view
                      details around the events fired.
                    </p>
                  </CardBody>
                  <CardFooter>
                    {!notificationsOverhaul && (
                      <Button
                        variant="secondary"
                        size="lg"
                        component="a"
                        href={`${
                          isBeta() ? '/preview' : ''
                        }/${getBundle()}/notifications/user-preferences`}
                        onClick={(e) => {
                          e.preventDefault();
                          navigate(`/${getBundle()}/notifications/eventlog`);
                        }}
                      >
                        View Event log
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
            <Title headingLevel="h2" className="pf-u-mb-md">
              Supporting features
            </Title>

            <DataList
              aria-label="Supporting features list"
              className="pf-u-mb-lg"
            >
              <CustomDataListItem
                icon={IconName.USER}
                isExpanded
                heading="Manage your own notifications with Notification Preferences"
                linkTitle="Go to Notification Preferences"
                linkTarget={`${
                  isBeta() ? '/preview' : ''
                }/${getBundle()}/notifications/user-preferences`}
                expandableContent="Select the events you want to be notified about, and how to receive notifications. Your Organization Administrator has configured which notifications you can or can’t receive in their Settings."
              />
              <CustomDataListItem
                icon={IconName.RUNNING}
                heading="Monitor all fired events with the Event log"
                linkTitle="View Event log"
                linkTarget={`${
                  isBeta() ? '/preview' : ''
                }/${getBundle()}/notifications/eventlog `}
                expandableContent="See all the events occurring in your organization and view details about the triggered events."
              />
              <CustomDataListItem
                icon={IconName.INTEGRATION}
                heading="Set up Integrations to customize your notifications"
                linkTitle="Set up Integrations"
                {...(isSourcesIntegrations && { isRedirect: true })}
                linkTarget={
                  isSourcesIntegrations
                    ? `${
                        isBeta() ? '/preview' : ''
                      }/settings/sources?category=Integrations`
                    : `${
                        isBeta() ? '/preview' : ''
                      }/${getBundle()}/notifications/integrations`
                }
                expandableContent={
                  <span>
                    The notifications and integrations services work together to
                    transmit messages to third-party applications, such as
                    instant messaging platforms and external ticketing systems,
                    when events occur. Integrations include Splunk, Slack,
                    ServiceNow,{' '}
                    <a
                      href={
                        'https://access.redhat.com/documentation/en-us/red_hat_hybrid_cloud_console/2023/html/integrating_the_red_hat_hybrid_cloud_console_with_third-party_applications/index'
                      }
                    >
                      and more
                    </a>
                    .
                  </span>
                }
              />
              <CustomDataListItem
                icon={IconName.USERS}
                heading="Create behavior groups to easily notify the right users"
                linkTitle="Create new behavior group"
                linkTarget={`${
                  isBeta() ? '/preview' : ''
                }/${getBundle()}/notifications/configure-events?activeTab=behaviorGroups`}
                expandableContent="Configure which notifications different users in your organization can receive, and how to notify groups of users when selected events occur."
              />
            </DataList>
          </React.Fragment>
        ) : (
          <React.Fragment>
            <DataList
              aria-label="Supporting features list"
              className="pf-u-mb-lg"
            >
              <CustomDataListItem
                icon={IconName.BELL}
                heading="About Notifications"
                expandableContent="Notifications are a way for users to be alerted of important events that occur in the Hybrid Cloud
                            Console. You can receive notifications through email and
                            third-party integrations, such as Slack or ServiceNow."
              />
            </DataList>
          </React.Fragment>
        )}

        <Title headingLevel="h2" className="pf-u-mb-md">
          Recommended content
        </Title>

        {isOrgAdmin ? (
          <React.Fragment>
            <Table aria-label="Recommended content" className="pf-u-mb-lg">
              <Tbody>
                <Tr className="noti-c-table-border-top">
                  <Td>Configuring Notifications</Td>
                  <Td>
                    <Label color="orange">Documentation</Label>
                  </Td>
                  <Td className="pf-v5-u-text-align-right">
                    <a
                      href={LEARN_MORE}
                      onClick={(e) => {
                        e.preventDefault();
                        window.open(LEARN_MORE, '_blank');
                      }}
                    >
                      View documentation <ExternalLinkAltIcon />
                    </a>
                  </Td>
                </Tr>
                <Tr>
                  <Td>Configuring Integrations</Td>
                  <Td>
                    <Label color="orange">Documentation</Label>
                  </Td>
                  <Td className="pf-v5-u-text-align-right">
                    <a
                      href={CONFIGURE_INTEGRATIONS}
                      onClick={(e) => {
                        e.preventDefault();
                        window.open(CONFIGURE_INTEGRATIONS, '_blank');
                      }}
                    >
                      View documentation <ExternalLinkAltIcon />
                    </a>
                  </Td>
                </Tr>
                <Tr>
                  <Td>Restricting access to a service to a team</Td>
                  <Td>
                    <Label color="green">Quick start</Label>
                  </Td>
                  <Td className="pf-v5-u-text-align-right">
                    <a
                      href={`${
                        isBeta() ? '/preview' : ''
                      }/iam/my-user-access?bundle=rhel&quickstart=rbac-admin-vuln-permissions`}
                    >
                      Begin Quick start <ArrowRightIcon />
                    </a>
                  </Td>
                </Tr>
              </Tbody>
            </Table>
          </React.Fragment>
        ) : (
          <React.Fragment>
            <Table aria-label="Recommended content" className="pf-u-mb-lg">
              <Tbody>
                <Tr className="noti-c-table-border-top">
                  <Td>Configuring notifications and integrations</Td>
                  <Td>
                    <Label color="orange">Documentation</Label>
                  </Td>
                  <Td className="pf-v5-u-text-align-right">
                    <a
                      href={CONFIGURE_INTEGRATIONS}
                      onClick={(e) => {
                        e.preventDefault();
                        window.open(CONFIGURE_INTEGRATIONS, '_blank');
                      }}
                    >
                      View documentation <ExternalLinkAltIcon />
                    </a>
                  </Td>
                </Tr>
                <Tr>
                  <Td>Configuring integrations for Red Hat services</Td>
                  <Td>
                    <Label color="orange">Documentation</Label>
                  </Td>
                  <Td className="pf-v5-u-text-align-right">
                    <a
                      href={CONFIGURE_SOURCES}
                      onClick={(e) => {
                        e.preventDefault();
                        window.open(CONFIGURE_SOURCES, '_blank');
                      }}
                    >
                      View documentation <ExternalLinkAltIcon />
                    </a>
                  </Td>
                </Tr>
              </Tbody>
            </Table>
          </React.Fragment>
        )}
        <a
          href={`${isBeta() ? '/preview' : ''}/settings/learning-resources`}
          className="pf-u-mb-lg"
        >
          View all Settings Learning Resources
        </a>
      </Main>
    </React.Fragment>
  );
};
