import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardTitle,
  DataList,
  DataListCell,
  DataListItem,
  DataListItemCells,
  DataListItemRow,
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
import PageHeader from '@redhat-cloud-services/frontend-components/PageHeader';
import PageHeaderTitle from '@redhat-cloud-services/frontend-components/PageHeader/PageHeaderTitle';
import useChrome from '@redhat-cloud-services/frontend-components/useChrome';
import { useFlag } from '@unleash/proxy-client-react';
import React from 'react';
import { useNavigate } from 'react-router-dom';

import notificationsProductIcon from '../../../assets/icons/notifications-product-icon.svg';
import CustomDataListItem, { IconName } from './CustomDataListItem';

// eslint-disable-next-line max-len
const LEARN_MORE =
  'https://access.redhat.com/documentation/en-us/red_hat_hybrid_cloud_console/2023/html/configuring_notifications_on_the_red_hat_hybrid_cloud_console/index';
// eslint-disable-next-line max-len
const CONFIGURE_INTEGRATIONS =
  'https://access.redhat.com/documentation/en-us/red_hat_hybrid_cloud_console/2023/html/configuring_notifications_on_the_red_hat_hybrid_cloud_console/assembly-intro_notifications';
// eslint-disable-next-line max-len
const CONFIGURE_SOURCES =
  'https://access.redhat.com/documentation/en-us/red_hat_hybrid_cloud_console/2023/html/configuring_sources_for_red_hat_services/index';

export const NotificationsOverviewPage: React.FunctionComponent = () => {
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
              A standardized way of notifying users of events for supported
              services on the Hybrid Cloud Console.
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
                      This service allows you to configure which notifications
                      different users within your organization will be entitled
                      to receiving. To do this, create behavior groups and apply
                      them to different events. Users will be able to opt-in or
                      out of receiving authorized event notifications in their{' '}
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
                        User Preferences
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
                      isLarge
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
                          Manage your own notifications with My User Preferences
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
                      isLarge
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
                      Go to My User Preferencesss
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
                        isLarge
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
                heading="Manage your own notifications with My User Preferences"
                linkTitle="Go to My User Preferences"
                linkTarget={`${
                  isBeta() ? '/preview' : ''
                }/${getBundle()}/notifications/user-preferences`}
                expandableContent="This service allows you to opt-in and out of receiving notifications. Your Organization
                            Administrator has configured which notifications you can or can not receive in their Settings."
              />
              <CustomDataListItem
                icon={IconName.RUNNING}
                heading="Monitor all fired events with the Event log"
                linkTitle="View Event log"
                linkTarget={`${
                  isBeta() ? '/preview' : ''
                }/${getBundle()}/notifications/eventlog `}
                expandableContent="See all the events affecting your organization and view details around the events fired."
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
                expandableContent="Notifications and integrations services work together to transmit messages to third-party application
                    endpoints, such as instant messaging platforms and external ticketing systems, when triggering events occur. Integrations
                    include Splunk, Slack, ServiceNow, and more."
              />
              <CustomDataListItem
                icon={IconName.USERS}
                heading="Create behavior groups to easily notify the right users"
                linkTitle="Create new behavior group"
                linkTarget={`${
                  isBeta() ? '/preview' : ''
                }/${getBundle()}/notifications/configure-events`}
                expandableContent="Behavior groups are made up of action/recipient pairings that allow you to configure which notification
                    actions different users will be able to receive. Once you've created a behavior group, you can assign it to an event. You
                    may also prevent users from changing assigned actions by locking action/recipient pairings when creating or editing behavior
                    groups."
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
                            Console. You can receive notifications within the console via the notifications drawer as well as through email and
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
            <DataList
              aria-label="Recommended content list"
              className="pf-u-mb-lg"
            >
              <DataListItem>
                <DataListItemRow>
                  <DataListItemCells
                    dataListCells={[
                      <DataListCell key="row1-col1">
                        <span>Configuring notifications and integrations</span>
                      </DataListCell>,
                      <DataListCell key="row1-col2">
                        <Label color="orange">Documentation</Label>
                      </DataListCell>,
                      <DataListCell alignRight isFilled={false} key="row1-col3">
                        <a
                          href={LEARN_MORE}
                          onClick={(e) => {
                            e.preventDefault();
                            window.open(LEARN_MORE, '_blank');
                          }}
                        >
                          View documentation <ExternalLinkAltIcon />
                        </a>
                      </DataListCell>,
                    ]}
                  />
                </DataListItemRow>
              </DataListItem>
              <DataListItem>
                <DataListItemRow>
                  <DataListItemCells
                    dataListCells={[
                      <DataListCell key="row2-col1">
                        <span>Configuring integrations and events</span>
                      </DataListCell>,
                      <DataListCell key="row2-col2">
                        <Label color="orange">Documentation</Label>
                      </DataListCell>,
                      <DataListCell alignRight isFilled={false} key="row2-col3">
                        <a
                          href={CONFIGURE_INTEGRATIONS}
                          onClick={(e) => {
                            e.preventDefault();
                            window.open(CONFIGURE_INTEGRATIONS, '_blank');
                          }}
                        >
                          View documentation <ExternalLinkAltIcon />
                        </a>
                      </DataListCell>,
                    ]}
                  />
                </DataListItemRow>
              </DataListItem>
              <DataListItem>
                <DataListItemRow>
                  <DataListItemCells
                    dataListCells={[
                      <DataListCell key="row3-col1">
                        <span>Restricting access to a service to a team</span>
                      </DataListCell>,
                      <DataListCell key="row3-col2">
                        <Label color="green">Quick start</Label>
                      </DataListCell>,
                      <DataListCell alignRight isFilled={false} key="row3-col3">
                        <a
                          href={`${
                            isBeta() ? '/preview' : ''
                          }/iam/my-user-access?bundle=rhel&quickstart=rbac-admin-vuln-permissions`}
                        >
                          Begin Quick start <ArrowRightIcon />
                        </a>
                      </DataListCell>,
                    ]}
                  />
                </DataListItemRow>
              </DataListItem>
            </DataList>
          </React.Fragment>
        ) : (
          <React.Fragment>
            <DataList
              aria-label="Recommended content list"
              className="pf-u-mb-lg"
            >
              <DataListItem>
                <DataListItemRow>
                  <DataListItemCells
                    dataListCells={[
                      <DataListCell key="row1-col1">
                        <span>Configuring notifications and integrations</span>
                      </DataListCell>,
                      <DataListCell key="row1-col2">
                        <Label color="orange">Documentation</Label>
                      </DataListCell>,
                      <DataListCell alignRight isFilled={false} key="row1-col3">
                        <a
                          href={CONFIGURE_INTEGRATIONS}
                          onClick={(e) => {
                            e.preventDefault();
                            window.open(CONFIGURE_INTEGRATIONS, '_blank');
                          }}
                        >
                          View documentation <ExternalLinkAltIcon />
                        </a>
                      </DataListCell>,
                    ]}
                  />
                </DataListItemRow>
              </DataListItem>
              <DataListItem>
                <DataListItemRow>
                  <DataListItemCells
                    dataListCells={[
                      <DataListCell key="row2-col1">
                        <span>
                          Configuring integrations for Red Hat services
                        </span>
                      </DataListCell>,
                      <DataListCell key="row2-col2">
                        <Label color="orange">Documentation</Label>
                      </DataListCell>,
                      <DataListCell alignRight isFilled={false} key="row2-col3">
                        <a
                          href={CONFIGURE_SOURCES}
                          onClick={(e) => {
                            e.preventDefault();
                            window.open(CONFIGURE_SOURCES, '_blank');
                          }}
                        >
                          View documentation <ExternalLinkAltIcon />
                        </a>
                      </DataListCell>,
                    ]}
                  />
                </DataListItemRow>
              </DataListItem>
            </DataList>
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
