import { Tab, TabTitleText, Tabs } from '@patternfly/react-core';
import { ExporterType } from '@redhat-cloud-services/insights-common-typescript';
import { useLocation, useNavigate } from 'react-router-dom';
import React, { useCallback, useEffect, useMemo } from 'react';

import { useAppContext } from '../../../app/AppContext';
import { NotificationsBehaviorGroupTable } from '../../../components/Notifications/NotificationsBehaviorGroupTable';
import { NotificationsToolbar } from '../../../components/Notifications/Toolbar';
import { useListNotifications } from '../../../services/useListNotifications';
import {
  BehaviorGroup,
  Facet,
  NotificationBehaviorGroup,
  UUID,
} from '../../../types/Notification';
import { useEventTypesPage } from '../hooks/useEventTypesPage';
import { BehaviorGroupsSection } from './BehaviorGroupsSection';
import { useBehaviorGroupContent } from './useBehaviorGroupContent';
import { useBehaviorGroupNotificationRows } from './useBehaviorGroupNotificationRows';

interface BundlePageBehaviorGroupContentProps {
  applications: Array<Facet>;
  bundle: Facet;
}

const tabMapping = {
  configuration: 0,
  behaviorGroups: 1,
};

const noEvents = [];

export const BundlePageBehaviorGroupContent: React.FunctionComponent<
  React.PropsWithChildren<BundlePageBehaviorGroupContentProps>
> = (props) => {
  const behaviorGroupContent = useBehaviorGroupContent(props.bundle.id);

  const navigate = useNavigate();
  const location = useLocation();

  const tab = useMemo(
    () => new URLSearchParams(location.search).get('tab') ?? 'configuration',
    [location.search]
  );

  const { rbac } = useAppContext();

  const onExport = useCallback((type: ExporterType) => {
    console.log('Export to', type);
  }, []);

  const eventTypePage = useEventTypesPage(
    props.bundle,
    props.applications,
    true
  );

  const useNotifications = useListNotifications(
    eventTypePage.pageController.page
  );

  const count = useMemo(() => {
    const payload = useNotifications.payload;
    if (payload?.status === 200) {
      return payload.value.meta.count;
    }

    return 0;
  }, [useNotifications.payload]);

  const behaviorGroups =
    !behaviorGroupContent.isLoading && !behaviorGroupContent.hasError
      ? behaviorGroupContent.content
      : undefined;

  const {
    rows: notificationRows,
    updateBehaviorGroupLink,
    startEditMode,
    finishEditMode,
    cancelEditMode,
    updateBehaviorGroups,
  } = useBehaviorGroupNotificationRows(
    !useNotifications.loading &&
      useNotifications.payload?.type === 'eventTypesArray'
      ? useNotifications.payload.value.data
      : noEvents,
    behaviorGroups
  );

  useEffect(() => {
    if (behaviorGroups) {
      updateBehaviorGroups(behaviorGroups);
    }
  }, [behaviorGroups, updateBehaviorGroups]);

  const onBehaviorGroupLinkUpdated = useCallback(
    (
      notification: NotificationBehaviorGroup,
      behaviorGroup: BehaviorGroup,
      isLinked: boolean
    ) => {
      if (behaviorGroup) {
        updateBehaviorGroupLink(notification.id, behaviorGroup, isLinked);
      }
    },
    [updateBehaviorGroupLink]
  );

  const onStartEditing = useCallback(
    (notificationId: UUID) => {
      startEditMode(notificationId);
    },
    [startEditMode]
  );

  const onFinishEditing = useCallback(
    (notificationId: UUID) => {
      finishEditMode(notificationId);
    },
    [finishEditMode]
  );

  const onCancelEditing = useCallback(
    (notificationId: UUID) => {
      cancelEditMode(notificationId);
    },
    [cancelEditMode]
  );

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    if (!searchParams.has('tab')) {
      searchParams.set('tab', 'configuration');
      navigate(`${location.pathname}?${searchParams.toString()}`, {
        replace: true,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.search, navigate]);

  return (
    <Tabs
      className="pf-v5-u-background-color-100 pf-v5-u-pl-lg"
      activeKey={tabMapping[tab]}
      onSelect={(event, tabIndex) => {
        const newSearchParams = new URLSearchParams(location.search);
        const selectedTab =
          Object.keys(tabMapping).find((key) => tabMapping[key] === tabIndex) ??
          'configuration';
        newSearchParams.set('tab', selectedTab);
        navigate(`${location.pathname}?${newSearchParams.toString()}`, {
          replace: true,
        });
      }}
    >
      <Tab eventKey={0} title={<TabTitleText>Configuration</TabTitleText>}>
        <NotificationsToolbar
          filters={eventTypePage.filters}
          setFilters={eventTypePage.setFilters}
          clearFilter={eventTypePage.clearFilters}
          appFilterOptions={props.applications}
          onExport={onExport}
          count={count}
          pageAdapter={eventTypePage.pageController}
        >
          <NotificationsBehaviorGroupTable
            notifications={notificationRows}
            behaviorGroupContent={behaviorGroupContent}
            onBehaviorGroupLinkUpdated={onBehaviorGroupLinkUpdated}
            onStartEditing={
              rbac.canWriteNotifications ? onStartEditing : undefined
            }
            onFinishEditing={
              rbac.canWriteNotifications ? onFinishEditing : undefined
            }
            onCancelEditing={
              rbac.canWriteNotifications ? onCancelEditing : undefined
            }
            onSort={eventTypePage.onSort}
            sortBy={eventTypePage.sortBy}
            sortDirection={eventTypePage.sortDirection}
          />
        </NotificationsToolbar>
      </Tab>
      <Tab eventKey={1} title={<TabTitleText>Behavior Groups</TabTitleText>}>
        <div className="pf-v5-u-mb-xl">
          <BehaviorGroupsSection
            bundle={props.bundle}
            applications={props.applications}
            behaviorGroupContent={behaviorGroupContent}
          />
        </div>
      </Tab>
    </Tabs>
  );
};
