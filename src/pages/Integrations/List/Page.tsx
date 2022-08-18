import { global_spacer_xl } from '@patternfly/react-tokens';
import { Main, PageHeader, PageHeaderTitle, Section } from '@redhat-cloud-services/frontend-components';
import { addDangerNotification, ExporterType, Filter, Operator, Page, stringValue, useSort } from '@redhat-cloud-services/insights-common-typescript';
import { format } from 'date-fns';
import inBrowserDownload from 'in-browser-download';
import * as React from 'react';
import { useContext } from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { style } from 'typestyle';

import { AppContext } from '../../../app/AppContext';
import { IntegrationFilters } from '../../../components/Integrations/Filters';
import { IntegrationsTable } from '../../../components/Integrations/Table';
import { IntegrationsToolbar } from '../../../components/Integrations/Toolbar';
import { useDeleteModalReducer } from '../../../hooks/useDeleteModalReducer';
import { useFormModalReducer } from '../../../hooks/useFormModalReducer';
import { useIntegrations } from '../../../hooks/useIntegrations';
import { usePage } from '../../../hooks/usePage';
import { Messages } from '../../../properties/Messages';
import { useListIntegrationPQuery, useListIntegrationsQuery } from '../../../services/useListIntegrations';
import { NotificationAppState } from '../../../store/types/NotificationAppState';
import { SavedNotificationScopeState } from '../../../store/types/SavedNotificationScopeTypes';
import { UserIntegration } from '../../../types/Integration';
import { integrationExporterFactory } from '../../../utils/exporters/Integration/Factory';
import { SplunkBetaEnvironmentBanner } from '../../Banners/SplunkBetaEnvironment';
import { CreatePage } from '../Create/CreatePage';
import { IntegrationDeleteModalPage } from '../Delete/DeleteModal';
import { useActionResolver } from './useActionResolver';
import { useIntegrationFilter } from './useIntegrationFilter';
import { useIntegrationRows } from './useIntegrationRows';

const userIntegrationCopier = (userIntegration: Partial<UserIntegration>) => ({
    ...userIntegration,
    name: `Copy of ${userIntegration.name}`
});

interface IntegrationsListPageProps {
    reduxDispatch: Dispatch;
    savedNotificationScope: SavedNotificationScopeState;
}

const bannerSectionClassname = style({
    marginBottom: global_spacer_xl.var
});

export const IntegrationsListPage: React.FunctionComponent<IntegrationsListPageProps> = props => {

    const { rbac: { canWriteIntegrationsEndpoints }} = useContext(AppContext);
    const integrationFilter = useIntegrationFilter();

    const userIntegrations = useIntegrations();
    const integrationFilterBuilder = React.useCallback((filters?: IntegrationFilters) => {
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
    }, [ userIntegrations ]);

    const sort = useSort();

    const pageData = usePage<IntegrationFilters>(10, integrationFilterBuilder, integrationFilter.filters, sort.sortBy);
    const integrationsQuery = useListIntegrationsQuery(pageData.page);
    const exportIntegrationsQuery = useListIntegrationPQuery();

    const integrations = React.useMemo(() => {
        const payload = integrationsQuery.payload;
        if (payload?.type === 'IntegrationPage') {
            return payload.value;
        }

        return {
            data: [],
            count: 0
        };
    }, [ integrationsQuery.payload ]);

    const integrationRows = useIntegrationRows(integrations.data, props.reduxDispatch, props.savedNotificationScope);
    const [ modalIsOpenState, modalIsOpenActions ] = useFormModalReducer<UserIntegration>(userIntegrationCopier);
    const [ deleteModalState, deleteModalActions ] = useDeleteModalReducer<UserIntegration>();

    const onAddIntegrationClicked = React.useCallback(() => {
        modalIsOpenActions.create();
    }, [ modalIsOpenActions ]);

    const onEdit = React.useCallback((integration: UserIntegration) => {
        modalIsOpenActions.edit(integration);
    }, [ modalIsOpenActions ]);

    const onDelete = React.useCallback((integration: UserIntegration) => {
        deleteModalActions.delete(integration);
    }, [ deleteModalActions ]);

    const onExport = React.useCallback(async (type: ExporterType) => {
        const query = exportIntegrationsQuery.query;
        const exporter = integrationExporterFactory(type);
        const exportedIntegrations: Array<UserIntegration> = [];
        let page = Page.of(1, 100, new Filter().and('type', Operator.EQUAL, 'webhook'));
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
                `integrations-${format(new Date(Date.now()), 'y-dd-MM')}.${exporter.type}`
            );
        }
    }, [ exportIntegrationsQuery ]);

    const actionResolver = useActionResolver({
        canWrite: canWriteIntegrationsEndpoints,
        onEdit,
        onDelete,
        onEnable: integrationRows.onEnable
    });

    const closeFormModal = React.useCallback((saved: boolean) => {
        const query = integrationsQuery.query;
        modalIsOpenActions.reset();
        if (saved) {
            query();
        }
    }, [ modalIsOpenActions, integrationsQuery.query ]);

    const closeDeleteModal = React.useCallback((deleted: boolean) => {
        const query = integrationsQuery.query;
        if (deleted) {
            query();
        }

        deleteModalActions.reset();
    }, [ deleteModalActions, integrationsQuery.query ]);

    // This is an estimate of how many rows are in the next page (Won't be always correct because a new row could be added while we are browsing)
    // Is used for the skeleton loading
    const loadingCount = Math.min(pageData.page.size, integrations.count - (pageData.page.index - 1) * pageData.page.size)  || 10;

    return (
        <>
            <PageHeader>
                <PageHeaderTitle title={ Messages.pages.integrations.list.title } />
            </PageHeader>
            <Main>
                <Section className={ bannerSectionClassname }>
                    <SplunkBetaEnvironmentBanner />
                </Section>
                <Section className='pf-c-page__main-section pf-m-light'>
                    <IntegrationsToolbar
                        onAddIntegration={ canWriteIntegrationsEndpoints ? onAddIntegrationClicked : undefined }
                        onExport={ onExport }
                        filters={ integrationFilter.filters }
                        setFilters={ integrationFilter.setFilters }
                        clearFilters={ integrationFilter.clearFilter }
                        count={ integrations.count || 0 }
                        pageCount={ integrations.data.length }
                        page={ pageData.page.index }
                        perPage={ pageData.page.size }
                        pageChanged={ pageData.changePage }
                        perPageChanged={ pageData.changeItemsPerPage }
                    >
                        <IntegrationsTable
                            isLoading={ integrationsQuery.loading }
                            loadingCount={ loadingCount }
                            integrations={ integrationRows.rows }
                            onCollapse={ integrationRows.onCollapse }
                            onEnable={ canWriteIntegrationsEndpoints ? integrationRows.onEnable : undefined }
                            actionResolver={ actionResolver }
                            onSort={ sort.onSort }
                            sortBy={ sort.sortBy }
                        />
                    </IntegrationsToolbar>
                    { modalIsOpenState.isOpen && (
                        <CreatePage
                            isEdit={ modalIsOpenState.isEdit }
                            initialIntegration={ modalIsOpenState.template || {} }
                            onClose={ closeFormModal }
                        />
                    ) }
                    { deleteModalState.data && (
                        <IntegrationDeleteModalPage
                            onClose={ closeDeleteModal }
                            integration={ deleteModalState.data }
                        />
                    )}
                </Section>
            </Main>
        </>
    );
};

const notificationAppStateSelector = (state: NotificationAppState) => ({
    savedNotificationScope: state.savedNotificationScope
});

export const ConnectedIntegrationsListPage = connect(
    notificationAppStateSelector,
    dispatch => ({
        reduxDispatch: dispatch
    })
)(IntegrationsListPage);
