import {
  ButtonVariant,
  Content,
  ContentVariants,
  Flex,
  FlexItem,
  Tab,
  TabTitleText,
  Tabs,
} from '@patternfly/react-core';
import { t_global_spacer_lg } from '@patternfly/react-tokens';
import Main from '@redhat-cloud-services/frontend-components/Main';
import useChrome from '@redhat-cloud-services/frontend-components/useChrome';
import { useFlag } from '@unleash/proxy-client-react';
import { default as React, useEffect, useMemo, useState } from 'react';
import { style } from 'typestyle';

import { useAppContext } from '../../../app/AppContext';
import { ButtonLink } from '../../../components/ButtonLink';
import { TabComponent } from '../../../components/Notifications/TabComponent';
import { TimeConfigComponent } from '../../../components/Notifications/TimeConfig';
import { PageHeader } from '../../../components/PageHeader';
import { Messages } from '../../../properties/Messages';
import { linkTo } from '../../../Routes';
import { useGetApplicationsLazy } from '../../../services/Notifications/GetApplications';
import { Facet } from '../../../types/Notification';
import { BundlePageBehaviorGroupContent } from './BundlePageBehaviorGroupContent';
import { useLocation, useNavigate } from 'react-router-dom';

interface NotificationListBundlePageProps {
  bundle: Facet;
  bundleTabs: Facet[];
  applications: Array<Facet>;
}

export const NotificationListBundlePage: React.FunctionComponent<
  React.PropsWithChildren<NotificationListBundlePageProps>
> = (props) => {
  const { updateDocumentTitle, auth } = useChrome();
  const navigate = useNavigate();
  const location = useLocation();

  const [isOrgAdmin, setIsOrgAdmin] = useState(false);

  useEffect(() => {
    auth.getUser().then((user) => {
      if (user) {
        setIsOrgAdmin(!!user.identity.user?.is_org_admin);
      }
    });
  }, [auth]);

  const bundle = useMemo(
    () => new URLSearchParams(location.search).get('bundle') ?? 'rhel',
    [location.search]
  );

  updateDocumentTitle?.(`${props.bundle.displayName} - Notifications`);

  const notificationsOverhaul = useFlag('platform.notifications.overhaul');

  const { rbac } = useAppContext();
  const eventLogPageUrl = React.useMemo(
    () => linkTo.eventLog(props.bundle.name),
    [props.bundle.name]
  );
  const getApplications = useGetApplicationsLazy();

  const mainPage = (
    <Main>
      <BundlePageBehaviorGroupContent
        applications={props.applications}
        bundle={props.bundle}
      />
    </Main>
  );

  const paddingLeftClassName = style({
    paddingLeft: t_global_spacer_lg.value,
  });

  const eventLogButton = () => {
    return notificationsOverhaul ? null : (
      <ButtonLink
        isDisabled={!rbac.canReadEvents}
        to={eventLogPageUrl}
        variant={ButtonVariant.secondary}
      >
        {Messages.pages.notifications.list.viewHistory}
      </ButtonLink>
    );
  };

  const pageTitle = () => {
    if (notificationsOverhaul) {
      return `Configure Events`;
    } else {
      return `${Messages.pages.notifications.list.title} | ${props.bundle.displayName}`;
    }
  };

  const timeConfigPage = (
    <Main>
      <TimeConfigComponent />
    </Main>
  );

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    if (!searchParams.has('bundle')) {
      searchParams.set('bundle', 'rhel');
      navigate(`${location.pathname}?${searchParams.toString()}`, {
        replace: true,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.search, navigate]);

  useEffect(() => {
    if (notificationsOverhaul) {
      const query = getApplications.query;
      query(props.bundleTabs.find(({ name }) => name === bundle)?.name);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bundle]);

  const getInitialApplications = useMemo(() => {
    if (getApplications.payload) {
      return getApplications.payload.value as Facet[];
    } else {
      return [];
    }
  }, [getApplications.payload]);

  if (notificationsOverhaul) {
    return (
      <>
        <PageHeader
          title={pageTitle()}
          subtitle={
            isOrgAdmin ? (
              <span>
                Configure which event notifications different users within your
                organization are entitled to receive. To manage your own
                personal notification settings, go to{' '}
                <Content
                  component={ContentVariants.a}
                  href="/settings/notifications/user-preferences/"
                >
                  Notification Preferences
                </Content>
                .
              </span>
            ) : (
              <span>
                View how notifications are configured by your organization
                admin. Contact your organization admin if you need access to
                edit these configurations. To manage your own personal
                notification settings, go to{' '}
                <Content
                  component={ContentVariants.a}
                  href="/settings/notifications/user-preferences/"
                >
                  Notification Preferences
                </Content>
                .
              </span>
            )
          }
          action={eventLogButton()}
        />
        <Flex direction={{ default: 'column' }}>
          <FlexItem>
            <Tabs
              activeKey={props.bundleTabs.findIndex(
                ({ name }) => name === bundle
              )}
              onSelect={(event, tabIndex) => {
                const newSearchParams = new URLSearchParams(location.search);
                const selectedBundle = props.bundleTabs[tabIndex]?.name;
                newSearchParams.set('bundle', selectedBundle ?? 'rhel');
                navigate(`${location.pathname}?${newSearchParams.toString()}`, {
                  replace: true,
                });
              }}
              className={paddingLeftClassName}
            >
              {props.bundleTabs.map((item, key) => (
                <Tab
                  key={key}
                  eventKey={key}
                  title={<TabTitleText>{item.displayName}</TabTitleText>}
                >
                  <Main>
                    <BundlePageBehaviorGroupContent
                      applications={getInitialApplications}
                      bundle={item}
                    />
                  </Main>
                </Tab>
              ))}
            </Tabs>
          </FlexItem>
        </Flex>
      </>
    );
  } else {
    return (
      <>
        <PageHeader
          title={`${Messages.pages.notifications.list.title} | ${props.bundle.displayName}`}
          subtitle={
            <span>
              Configure which event notifications different users within your
              organization are entitled to receive.
            </span>
          }
          action={eventLogButton()}
        />

        <TabComponent configuration={props.children} settings={props.children}>
          <Tab eventKey={0} title={<TabTitleText>Configuration</TabTitleText>}>
            {mainPage}
          </Tab>
          <Tab eventKey={1} title={<TabTitleText>Settings</TabTitleText>}>
            {timeConfigPage}
          </Tab>
        </TabComponent>
      </>
    );
  }
};
