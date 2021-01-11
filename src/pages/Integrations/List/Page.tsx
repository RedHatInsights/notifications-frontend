import { Main, PageHeader, PageHeaderTitle, Section } from '@redhat-cloud-services/frontend-components';
import {
    addDangerNotification,
    ExporterType,
    Filter,
    Operator,
    Page
} from '@redhat-cloud-services/insights-common-typescript';
import { format } from 'date-fns';
import inBrowserDownload from 'in-browser-download';
import * as React from 'react';
import { useContext } from 'react';

import { AppContext } from '../../../app/AppContext';
import { IntegrationsTable } from '../../../components/Integrations/Table';
import { IntegrationsToolbar } from '../../../components/Integrations/Toolbar';
import { usePage } from '../../../hooks/usePage';
import { Messages } from '../../../properties/Messages';
import { useListIntegrationPQuery, useListIntegrationsQuery } from '../../../services/useListIntegrations';
import { IntegrationType, UserIntegration } from '../../../types/Integration';
import { integrationExporterFactory } from '../../../utils/exporters/Integration/Factory';
import { CreatePage } from '../Create/CreatePage';
import { IntegrationDeleteModalPage } from '../Delete/DeleteModal';
import { useActionResolver } from './useActionResolver';
import { useDeleteModalReducer } from './useDeleteModalReducer';
import { makeCreateAction, makeEditAction, makeNoneAction, useFormModalReducer } from './useFormModalReducer';
import { useIntegrationFilter } from './useIntegrationFilter';
import { useIntegrationRows } from './useIntegrationRows';

const integrationFilterBuilder = (_filters: unknown) => {
    return new Filter().and('type', Operator.EQUAL, IntegrationType.WEBHOOK);
};

export const IntegrationsListPage: React.FunctionComponent = () => {

    const { rbac: { canWriteAll }} = useContext(AppContext);
    const pageData = usePage(10, integrationFilterBuilder);
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

    const integrationRows = useIntegrationRows(integrations.data);
    const integrationFilter = useIntegrationFilter();

    const [ modalIsOpenState, dispatchModalIsOpen ] = useFormModalReducer();
    const [ deleteModalState, dispatchDeleteModal ] = useDeleteModalReducer();

    const onAddIntegrationClicked = React.useCallback(() => {
        dispatchModalIsOpen(makeCreateAction());
    }, [ dispatchModalIsOpen ]);

    const onEdit = React.useCallback((integration: UserIntegration) => {
        dispatchModalIsOpen(makeEditAction(integration));
    }, [ dispatchModalIsOpen ]);

    const onDelete = React.useCallback((integration: UserIntegration) => {
        dispatchDeleteModal(useDeleteModalReducer.makeDeleteAction(integration));
    }, [ dispatchDeleteModal ]);

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
        canWriteAll,
        onEdit,
        onDelete,
        onEnable: integrationRows.onEnable
    });

    const closeFormModal = React.useCallback((saved: boolean) => {
        const query = integrationsQuery.query;
        dispatchModalIsOpen(makeNoneAction());
        if (saved) {
            query();
        }
    }, [ dispatchModalIsOpen, integrationsQuery.query ]);

    const closeDeleteModal = React.useCallback((deleted: boolean) => {
        const query = integrationsQuery.query;
        if (deleted) {
            query();
        }

        dispatchDeleteModal(useDeleteModalReducer.makeNoneAction());
    }, [ dispatchDeleteModal, integrationsQuery.query ]);

    // This is an estimate of how many rows are in the next page (Won't be always correct because a new row could be added while we are browsing)
    // Is used for the skeleton loading
    const loadingCount = Math.min(pageData.page.size, integrations.count - (pageData.page.index - 1) * pageData.page.size)  || 10;

    return (
        <>
            <PageHeader>
                <PageHeaderTitle title={ Messages.pages.integrations.list.title } />
            </PageHeader>
            <Main>
                <Section className='pf-c-page__main-section pf-m-light'>
                    <IntegrationsToolbar
                        onAddIntegration={ canWriteAll ? onAddIntegrationClicked : undefined }
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
                            onEnable={ canWriteAll ? integrationRows.onEnable : undefined }
                            actionResolver={ actionResolver }
                        />
                    </IntegrationsToolbar>
                    { modalIsOpenState.isOpen && (
                        <CreatePage
                            isEdit={ modalIsOpenState.isEdit }
                            initialIntegration={ modalIsOpenState.template || {} }
                            onClose={ closeFormModal }
                        />
                    ) }
                    { deleteModalState.integration && (
                        <IntegrationDeleteModalPage
                            onClose={ closeDeleteModal }
                            integration={ deleteModalState.integration }
                        />
                    )}
                </Section>
            </Main>
        </>
    );
};
