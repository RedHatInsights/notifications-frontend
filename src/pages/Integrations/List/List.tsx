import {
  ExporterType,
  Filter,
  Operator,
  Page,
  addDangerNotification,
  stringValue,
  useSort,
} from '@redhat-cloud-services/insights-common-typescript';
import { format } from 'date-fns';
import inBrowserDownload from 'in-browser-download';
import * as React from 'react';
import { useContext, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppContext } from '../../../app/AppContext';
import { IntegrationsEmptyState } from '../../../components/Integrations/EmptyState';
import { IntegrationFilters } from '../../../components/Integrations/Filters';
import {
  IntegrationRow,
  IntegrationsTable,
} from '../../../components/Integrations/Table';
import { IntegrationsToolbar } from '../../../components/Integrations/Toolbar';
import { useDeleteModalReducer } from '../../../hooks/useDeleteModalReducer';
import { useFormModalReducer } from '../../../hooks/useFormModalReducer';
import { useIntegrations } from '../../../hooks/useIntegrations';
import { usePage } from '../../../hooks/usePage';
import {
  useListIntegrationPQuery,
  useListIntegrationsQuery,
} from '../../../services/useListIntegrations';
import { NotificationAppState } from '../../../store/types/NotificationAppState';
import {
  IntegrationCategory,
  UserIntegration,
} from '../../../types/Integration';
import { integrationExporterFactory } from '../../../utils/exporters/Integration/Factory';
import { CreatePage } from '../Create/CreatePage';
import { IntegrationWizard } from '../Create/IntegrationWizard';
import IntegrationTestProvider from '../../../components/Integrations/Table/IntegrationTestProvider';
import { IntegrationDeleteModalPage } from '../Delete/DeleteModal';
import { useActionResolver } from './useActionResolver';
import { useIntegrationFilter } from './useIntegrationFilter';
import { useIntegrationRows } from './useIntegrationRows';
import { useFlag } from '@unleash/proxy-client-react';
import DopeBox from '../../../components/Integrations/DopeBox';
import { DataViewIntegrationsTable } from '../../../components/Integrations/IntegrationsTable';
import { DataViewEventsProvider } from '@patternfly/react-data-view/dist/dynamic/DataViewEventsContext';
import {
  Drawer,
  DrawerContent,
  DrawerContentBody,
} from '@patternfly/react-core';
import IntegrationsDrawer from '../../../components/Integrations/IntegrationsDrawer';

const userIntegrationCopier = (userIntegration: Partial<UserIntegration>) => ({
  ...userIntegration,
  name: `Copy of ${userIntegration.name}`,
});

const selector = (state: NotificationAppState) => ({
  savedNotificationScope: state.savedNotificationScope,
});

interface IntegrationListProps {
  category?: IntegrationCategory;
}

const IntegrationsList: React.FunctionComponent<IntegrationListProps> = ({
  category,
}: IntegrationListProps) => {
  const dispatch = useDispatch();
  const wizardEnabled = useFlag('insights.integrations.wizard');
  const isBehaviorGroupsEnabled = useFlag(
    'platform.integrations.behavior-groups-move'
  );
  const { savedNotificationScope } = useSelector(selector);
  const [selectedIntegration, setSelectedIntegration] =
    useState<UserIntegration>();
  const [isTestModalOpen, setIsTestModalOpen] = useState(true);
  const [focusedIntegration, setFocusedIntegration] =
    useState<IntegrationRow>();
  const drawerRef = React.useRef<HTMLDivElement>(null);
  const {
    rbac: { canWriteIntegrationsEndpoints },
  } = useContext(AppContext);

  const integrationFilter = useIntegrationFilter();
  const userIntegrations = useIntegrations(category);
  const integrationFilterBuilder = React.useCallback(
    (filters?: IntegrationFilters) => {
      const filter = new Filter();
      if (filters?.enabled?.length === 1) {
        const isEnabled = filters.enabled[0].toLocaleLowerCase() === 'enabled';
        filter.and('active', Operator.EQUAL, isEnabled.toString());
      }

      if (filters?.name) {
        const name = stringValue(filters.name);
        filter.and('name', Operator.EQUAL, name);
      }

      return filter.and(
        'type',
        Operator.EQUAL,
        userIntegrations as Array<string>
      );
    },
    [userIntegrations]
  );

  const [modalIsOpenState, modalIsOpenActions] =
    useFormModalReducer<UserIntegration>(userIntegrationCopier);
  const [deleteModalState, deleteModalActions] =
    useDeleteModalReducer<UserIntegration>();

  const sort = useSort();

  const pageData = usePage<IntegrationFilters>(
    20,
    integrationFilterBuilder,
    integrationFilter.filters,
    sort.sortBy,
    category
  );
  const integrationsQuery = useListIntegrationsQuery(pageData.page);
  const exportIntegrationsQuery = useListIntegrationPQuery();

  const integrations = React.useMemo(() => {
    const payload = integrationsQuery.payload;
    if (payload?.type === 'IntegrationPage') {
      return payload.value;
    }

    return {
      data: [],
      count: 0,
    };
  }, [integrationsQuery.payload]);

  const integrationRows = useIntegrationRows(
    integrations.data,
    dispatch,
    savedNotificationScope
  );

  const focusedIntegrationEnabled = integrationRows.rows.find(
    ({ id }) => id === focusedIntegration?.id
  )?.isEnabled;

  React.useEffect(() => {
    if (focusedIntegration) {
      setFocusedIntegration(
        integrationRows.rows.find(({ id }) => id === focusedIntegration?.id)
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [focusedIntegrationEnabled]);

  const onAddIntegrationClicked = React.useCallback(() => {
    modalIsOpenActions.create();
  }, [modalIsOpenActions]);

  const onEdit = React.useCallback(
    (integration: UserIntegration) => {
      modalIsOpenActions.edit(integration);
    },
    [modalIsOpenActions]
  );

  const onTest = React.useCallback(
    (integration: UserIntegration) => {
      setSelectedIntegration(integration);
      modalIsOpenActions.test(integration);
    },
    [modalIsOpenActions]
  );

  const onDelete = React.useCallback(
    (integration: UserIntegration) => {
      deleteModalActions.delete(integration);
    },
    [deleteModalActions]
  );

  const onExport = React.useCallback(
    async (type: ExporterType) => {
      const query = exportIntegrationsQuery.query;
      const exporter = integrationExporterFactory(type);
      const exportedIntegrations: Array<UserIntegration> = [];
      let page = Page.of(
        1,
        100,
        new Filter().and('type', Operator.EQUAL, 'webhook')
      );
      // eslint-disable-next-line no-constant-condition
      while (true) {
        const data = await query(page);
        if (data?.payload?.status !== 200) {
          if (exportedIntegrations.length === 0) {
            addDangerNotification(
              'Unable to download integrations',
              'We were unable to download the integrations for exporting. Please try again.'
            );
            return;
          } else {
            addDangerNotification(
              'Unable to download all integrations',
              `We were unable to download all the integrations for exporting. Downloading: ${exportedIntegrations.length}.`
            );
            break;
          }
        }

        if (data.payload.value.data.length === 0) {
          break;
        }

        page = page.nextPage();
        exportedIntegrations.push(...data.payload.value.data);
      }
      if (exportedIntegrations) {
        inBrowserDownload(
          exporter.export(exportedIntegrations),
          `integrations-${format(new Date(Date.now()), 'y-dd-MM')}.${
            exporter.type
          }`
        );
      }
    },
    [exportIntegrationsQuery]
  );

  const actionResolver = useActionResolver({
    canWrite: canWriteIntegrationsEndpoints,
    onEdit,
    onTest,
    onDelete,
    onEnable: integrationRows.onEnable,
  });

  const closeFormModal = React.useCallback(
    (saved: boolean) => {
      const query = integrationsQuery.query;
      modalIsOpenActions.reset();
      if (saved) {
        query();
      }
    },
    [modalIsOpenActions, integrationsQuery.query]
  );

  const closeDeleteModal = React.useCallback(
    (deleted: boolean) => {
      const query = integrationsQuery.query;
      if (deleted) {
        query();
      }

      deleteModalActions.reset();
    },
    [deleteModalActions, integrationsQuery.query]
  );

  useEffect(() => {
    modalIsOpenState.isTest && setIsTestModalOpen(true);
  }, [modalIsOpenState]);

  // This is an estimate of how many rows are in the next page (Won't be always correct because a new row could be added while we are browsing)
  // Is used for the skeleton loading
  const loadingCount =
    Math.min(
      pageData.page.size,
      integrations.count - (pageData.page.index - 1) * pageData.page.size
    ) || 10;

  const integrationsEmpty =
    integrations.count < 1 &&
    !integrationsQuery.loading &&
    Object.values(integrationFilter.filters).every((filter) => !filter);

  return (
    <>
      {integrationsEmpty && (
        <IntegrationsEmptyState
          onAddIntegration={
            canWriteIntegrationsEndpoints ? onAddIntegrationClicked : undefined
          }
        />
      )}
      {!integrationsEmpty && (
        <>
          <DopeBox category={category} />
          <IntegrationsToolbar
            onAddIntegration={
              canWriteIntegrationsEndpoints
                ? onAddIntegrationClicked
                : undefined
            }
            onExport={onExport}
            filters={integrationFilter.filters}
            setFilters={integrationFilter.setFilters}
            clearFilters={integrationFilter.clearFilter}
            count={integrations.count || 0}
            pageCount={integrations.data.length}
            page={pageData.page.index}
            perPage={pageData.page.size}
            pageChanged={pageData.changePage}
            perPageChanged={pageData.changeItemsPerPage}
          >
            {!isBehaviorGroupsEnabled ? (
              <IntegrationsTable
                isLoading={integrationsQuery.loading}
                loadingCount={loadingCount}
                integrations={integrationRows.rows}
                onCollapse={integrationRows.onCollapse}
                onEnable={
                  canWriteIntegrationsEndpoints
                    ? integrationRows.onEnable
                    : undefined
                }
                actionResolver={actionResolver}
                onSort={sort.onSort}
                sortBy={sort.sortBy}
              />
            ) : (
              <DataViewEventsProvider>
                <Drawer
                  isExpanded={Boolean(focusedIntegration)}
                  onExpand={() => drawerRef.current?.focus()}
                  data-ouia-component-id="integration-detail-drawer"
                >
                  <DrawerContent
                    panelContent={
                      <IntegrationsDrawer
                        actionResolver={actionResolver}
                        selectedIndex={integrationRows.rows?.findIndex(
                          ({ id }) =>
                            focusedIntegration && id === focusedIntegration.id
                        )}
                        selectedIntegration={focusedIntegration}
                        setSelectedIntegration={setFocusedIntegration}
                      />
                    }
                  >
                    <DrawerContentBody>
                      <DataViewIntegrationsTable
                        isLoading={integrationsQuery.loading}
                        loadingCount={loadingCount}
                        integrations={integrationRows.rows}
                        onCollapse={integrationRows.onCollapse}
                        onEnable={
                          canWriteIntegrationsEndpoints
                            ? integrationRows.onEnable
                            : undefined
                        }
                        actionResolver={actionResolver}
                        onSort={sort.onSort}
                        sortBy={sort.sortBy}
                        setFocusedIntegration={setFocusedIntegration}
                        selectedIntegration={focusedIntegration}
                      />
                    </DrawerContentBody>
                  </DrawerContent>
                </Drawer>
              </DataViewEventsProvider>
            )}
          </IntegrationsToolbar>
        </>
      )}
      {modalIsOpenState.isOpen && !wizardEnabled && (
        <CreatePage
          isEdit={modalIsOpenState.isEdit}
          initialIntegration={modalIsOpenState.template || {}}
          onClose={closeFormModal}
        />
      )}
      {modalIsOpenState.isTest && (
        <IntegrationTestProvider
          integrationId={selectedIntegration?.id}
          integrationType={selectedIntegration?.type}
          onClose={() => setIsTestModalOpen(false)}
          isModalOpen={isTestModalOpen}
        />
      )}
      {wizardEnabled && category && (
        <IntegrationWizard
          isOpen={modalIsOpenState.isOpen}
          isEdit={modalIsOpenState.isEdit}
          template={modalIsOpenState.template}
          closeModal={modalIsOpenActions.reset}
          afterSubmit={integrationsQuery.query}
          category={category}
        />
      )}
      {deleteModalState.data && (
        <IntegrationDeleteModalPage
          onClose={closeDeleteModal}
          integration={deleteModalState.data}
        />
      )}
    </>
  );
};

export default IntegrationsList;
