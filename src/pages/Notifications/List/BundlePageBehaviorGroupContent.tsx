import { Tab, TabTitleText, Tabs } from '@patternfly/react-core';
import { useLocation, useNavigate } from 'react-router-dom';
import React, { useCallback, useEffect, useMemo } from 'react';

import { useAppContext } from '../../../app/AppContext';
import { NotificationsBehaviorGroupTable } from '../../../components/Notifications/NotificationsBehaviorGroupTable';
import { NotificationsToolbar } from '../../../components/Notifications/Toolbar';
import { useListNotificationsOld } from '../../../services/useListNotifications';
import { BehaviorGroup, Facet, NotificationBehaviorGroup, UUID } from '../../../types/Notification';
import { useEventTypesPage } from '../hooks/useEventTypesPage';
import { BehaviorGroupsSection } from './BehaviorGroupsSection';
import { useBehaviorGroupContent } from './useBehaviorGroupContent';
import { useBehaviorGroupNotificationRows } from './useBehaviorGroupNotificationRows';
import { ExporterType } from '../../../utils/insights-common-typescript';
import { useGetOrgPreferences } from '../../../services/Notifications/GetOrgPreferences';
import { useUpdateOrgPreferences } from '../../../services/Notifications/UpdateOrgPreferences';
import {
  CUSTOM_THRESHOLD_DISPLAY_NAME,
  DEFAULT_THRESHOLD,
} from '../../../components/Notifications/constants';
import { useNotification } from '../../../utils/AlertUtils';

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

  const autoEdit = useMemo(
    () => new URLSearchParams(location.search).get('autoEdit') === 'true',
    [location.search]
  );

  const autoEditName = useMemo(
    () => new URLSearchParams(location.search).get('name') ?? '',
    [location.search]
  );

  const { rbac } = useAppContext();
  const { addDangerNotification, addSuccessNotification } = useNotification();

  // Fetch org preferences for threshold value
  const {
    data: orgPreferences,
    loading: orgPrefsLoading,
    error: orgPrefsError,
    refetch: refetchOrgPreferences,
  } = useGetOrgPreferences();
  const updateOrgPreferencesMutation = useUpdateOrgPreferences();

  const currentThreshold = useMemo(() => {
    if (orgPrefsLoading) {
      return DEFAULT_THRESHOLD; // Use default while loading
    }
    if (orgPrefsError) {
      // Log error but continue with default - non-blocking
      console.error('Failed to load org preferences:', orgPrefsError);
      return DEFAULT_THRESHOLD;
    }
    return orgPreferences?.custom_threshold ?? DEFAULT_THRESHOLD;
  }, [orgPreferences, orgPrefsLoading, orgPrefsError]);

  const onExport = useCallback((type: ExporterType) => {
    console.log('Export to', type);
  }, []);

  const eventTypePage = useEventTypesPage(props.bundle, props.applications, true);

  const useNotifications = useListNotificationsOld(eventTypePage.pageController.page);

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
    updateThresholdValue,
    startEditMode,
    finishEditMode,
    cancelEditMode,
    updateBehaviorGroups,
  } = useBehaviorGroupNotificationRows(
    !useNotifications.loading && useNotifications.payload?.type === 'eventTypesArray'
      ? useNotifications.payload.value.data
      : noEvents,
    behaviorGroups,
    currentThreshold
  );

  useEffect(() => {
    if (behaviorGroups) {
      updateBehaviorGroups(behaviorGroups);
    }
  }, [behaviorGroups, updateBehaviorGroups]);

  const autoEditTriggered = React.useRef('');

  useEffect(() => {
    if (
      !autoEdit ||
      !rbac.canWriteNotifications ||
      autoEditTriggered.current === autoEditName ||
      notificationRows.length === 0
    ) {
      return;
    }

    const match = notificationRows.find(
      (row) => row.eventTypeDisplayName.toLowerCase() === autoEditName.toLowerCase()
    );

    if (match) {
      autoEditTriggered.current = autoEditName;
      startEditMode(match.id);
      const newSearchParams = new URLSearchParams(location.search);
      newSearchParams.delete('autoEdit');
      navigate(`${location.pathname}?${newSearchParams.toString()}`, { replace: true });
    }
  }, [
    autoEdit,
    autoEditName,
    notificationRows,
    startEditMode,
    location,
    navigate,
    rbac.canWriteNotifications,
  ]);

  const onBehaviorGroupLinkUpdated = useCallback(
    (notification: NotificationBehaviorGroup, behaviorGroup: BehaviorGroup, isLinked: boolean) => {
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
    async (notificationId: UUID) => {
      // Find the notification to check if threshold changed
      const notification = notificationRows.find((row) => row.id === notificationId);
      const isSubscriptionThreshold =
        notification?.eventTypeDisplayName === CUSTOM_THRESHOLD_DISPLAY_NAME;

      if (
        isSubscriptionThreshold &&
        notification?.isEditMode &&
        notification.thresholdValue !== notification.oldThresholdValue
      ) {
        try {
          // Update org preferences with new threshold
          await updateOrgPreferencesMutation.mutate({
            customThreshold: notification.thresholdValue ?? DEFAULT_THRESHOLD,
          });

          // Refetch org preferences to stay in sync
          refetchOrgPreferences();

          addSuccessNotification(
            'Threshold updated',
            `Custom threshold set to ${notification.thresholdValue}%`
          );
        } catch (error) {
          // Show error but still exit edit mode
          addDangerNotification(
            'Failed to update threshold',
            'Your threshold change could not be saved. Please try again.'
          );
          console.error('Failed to update org preferences:', error);
          // Note: We still call finishEditMode below to prevent UI from being stuck
        }
      }

      finishEditMode(notificationId);
    },
    [
      finishEditMode,
      notificationRows,
      updateOrgPreferencesMutation,
      refetchOrgPreferences,
      addSuccessNotification,
      addDangerNotification,
    ]
  );

  const onCancelEditing = useCallback(
    (notificationId: UUID) => {
      cancelEditMode(notificationId);
    },
    [cancelEditMode]
  );

  const onThresholdChange = useCallback(
    (notificationId: UUID, threshold: number) => {
      updateThresholdValue(notificationId, threshold);
    },
    [updateThresholdValue]
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
          Object.keys(tabMapping).find((key) => tabMapping[key] === tabIndex) ?? 'configuration';
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
            onThresholdChange={rbac.canWriteNotifications ? onThresholdChange : undefined}
            onStartEditing={rbac.canWriteNotifications ? onStartEditing : undefined}
            onFinishEditing={rbac.canWriteNotifications ? onFinishEditing : undefined}
            onCancelEditing={rbac.canWriteNotifications ? onCancelEditing : undefined}
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
