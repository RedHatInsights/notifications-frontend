import { Tab, TabTitleText } from '@patternfly/react-core';
import { ExporterType } from '@redhat-cloud-services/insights-common-typescript';
import { useLocation } from 'react-router-dom';
import * as React from 'react';

import { useAppContext } from '../../../app/AppContext';
import { NotificationsBehaviorGroupTable } from '../../../components/Notifications/NotificationsBehaviorGroupTable';
import { TabComponent } from '../../../components/Notifications/TabComponent';
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

enum TabIndex {
  Configuration = 0,
  BehaviorGroups = 1,
}

const noEvents = [];

export const BundlePageBehaviorGroupContent: React.FunctionComponent<
  React.PropsWithChildren<BundlePageBehaviorGroupContentProps>
> = (props) => {
  const behaviorGroupContent = useBehaviorGroupContent(props.bundle.id);
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const activeTab =
    queryParams.get('activeTab') === 'behaviorGroups'
      ? TabIndex.BehaviorGroups
      : TabIndex.Configuration;

  const { rbac } = useAppContext();

  const onExport = React.useCallback((type: ExporterType) => {
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

  const count = React.useMemo(() => {
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

  React.useEffect(() => {
    if (behaviorGroups) {
      updateBehaviorGroups(behaviorGroups);
    }
  }, [behaviorGroups, updateBehaviorGroups]);

  const onBehaviorGroupLinkUpdated = React.useCallback(
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

  const onStartEditing = React.useCallback(
    (notificationId: UUID) => {
      startEditMode(notificationId);
    },
    [startEditMode]
  );

  const onFinishEditing = React.useCallback(
    (notificationId: UUID) => {
      finishEditMode(notificationId);
    },
    [finishEditMode]
  );

  const onCancelEditing = React.useCallback(
    (notificationId: UUID) => {
      cancelEditMode(notificationId);
    },
    [cancelEditMode]
  );

  return (
    <TabComponent
      configuration={props.children}
      settings={props.children}
      activeKey={activeTab}
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
    </TabComponent>
  );
};
