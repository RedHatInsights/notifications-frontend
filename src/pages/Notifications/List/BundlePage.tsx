import {
  ButtonVariant,
  Flex,
  FlexItem,
  Tab,
  TabTitleText,
  Tabs,
} from '@patternfly/react-core';
import { global_spacer_lg } from '@patternfly/react-tokens';
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

interface NotificationListBundlePageProps {
  bundle: Facet;
  bundleTabs: Facet[];
  applications: Array<Facet>;
}

export const NotificationListBundlePage: React.FunctionComponent<NotificationListBundlePageProps> =
  (props) => {
    const { updateDocumentTitle } = useChrome();

    updateDocumentTitle?.(`${props.bundle.displayName} - Notifications`);

    const notificationsOverhaul = useFlag('platform.notifications.overhaul');

    const { rbac } = useAppContext();
    const eventLogPageUrl = React.useMemo(
      () => linkTo.eventLog(props.bundle.name),
      [props.bundle.name]
    );
    const getApplications = useGetApplicationsLazy();
    const [activeTabKey, setActiveTabKey] = useState(0);

    const mainPage = (
      <Main>
        <BundlePageBehaviorGroupContent
          applications={props.applications}
          bundle={props.bundle}
        />
      </Main>
    );

    const paddingLeftClassName = style({
      paddingLeft: global_spacer_lg.value,
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
      if (notificationsOverhaul) {
        const query = getApplications.query;
        query(props.bundleTabs[activeTabKey].name);
      }
    }, [
      activeTabKey,
      getApplications.query,
      props.bundleTabs,
      notificationsOverhaul,
    ]);

    const getInitialApplications = useMemo(() => {
      if (getApplications.payload) {
        return getApplications.payload.value as Facet[];
      } else {
        return [];
      }
    }, [getApplications.payload]);

    if (notificationsOverhaul) {
      const handleTabClick = (event, tabIndex) => {
        setActiveTabKey(tabIndex);
      };

      return (
        <>
          <PageHeader
            title={pageTitle()}
            subtitle={
              <span>
                Configure which event notifications different users within your
                organization are entitled to receive.
              </span>
            }
            action={eventLogButton()}
          />
          <Flex direction={{ default: 'column' }}>
            <FlexItem>
              <Tabs
                activeKey={activeTabKey}
                onSelect={handleTabClick}
                className={paddingLeftClassName}
              >
                <Tab
                  eventKey={2}
                  title={<TabTitleText>OpenShift</TabTitleText>}
                >
                  <Main>
                    <BundlePageBehaviorGroupContent
                      applications={getInitialApplications}
                      bundle={props.bundleTabs[2]}
                    />
                  </Main>
                </Tab>
                <Tab
                  eventKey={0}
                  title={<TabTitleText>Red Hat Enterprise Linux</TabTitleText>}
                >
                  <Main>
                    <BundlePageBehaviorGroupContent
                      applications={getInitialApplications}
                      bundle={props.bundleTabs[0]}
                    />
                  </Main>
                </Tab>
                <Tab eventKey={1} title={<TabTitleText>Console</TabTitleText>}>
                  <Main>
                    <BundlePageBehaviorGroupContent
                      applications={getInitialApplications}
                      bundle={props.bundleTabs[1]}
                    />
                  </Main>
                </Tab>
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

          <TabComponent
            configuration={props.children}
            settings={props.children}
          >
            <Tab
              eventKey={0}
              title={<TabTitleText>Configuration</TabTitleText>}
            >
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
