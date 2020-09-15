import * as React from 'react';
import { Main, PageHeader, PageHeaderTitle, Section } from '@redhat-cloud-services/frontend-components';
import { Messages } from '../../../properties/Messages';
import { IntegrationsToolbar } from '../../../components/Integrations/Toolbar';
import { IntegrationsTable } from '../../../components/Integrations/Table';
import { Integration } from '../../../types/Integration';
import { useIntegrationRows } from './useIntegrationRows';
import { useActionResolver } from './useActionResolver';
import { useContext } from 'react';
import { AppContext } from '../../../app/AppContext';
import { CreatePage } from '../Create/CreatePage';
import { useIntegrationFilter } from './useIntegrationFilter';
import { useListIntegrationsQuery } from '../../../services/useListIntegrations';
import { makeCreateAction, makeEditAction, makeNoneAction, useFormModalReducer } from './useFormModalReducer';
import { IntegrationDeleteModalPage } from '../Delete/DeleteModal';
import { useDeleteModalReducer } from './useDeleteModalReducer';
import {
    addDangerNotification,
    exporterTypeFromString
} from '@redhat-cloud-services/insights-common-typescript';
import { integrationExporterFactory } from '../../../utils/exporters/Integration/Factory';
import inBrowserDownload from 'in-browser-download';
import { format } from 'date-fns';

export const IntegrationsListPage: React.FunctionComponent = () => {

    const { rbac: { canWriteAll }} = useContext(AppContext);
    const integrationsQuery = useListIntegrationsQuery();

    const integrations = React.useMemo(() => {
        const payload = integrationsQuery.payload;
        if (payload?.type === 'integrationArray') {
            return payload.value;
        }

        return [];
    }, [ integrationsQuery.payload ]);

    const integrationRows = useIntegrationRows(integrations);
    const integrationFilter = useIntegrationFilter();

    const [ modalIsOpenState, dispatchModalIsOpen ] = useFormModalReducer();
    const [ deleteModalState, dispatchDeleteModal ] = useDeleteModalReducer();

    const onAddIntegrationClicked = React.useCallback(() => {
        dispatchModalIsOpen(makeCreateAction());
    }, [ dispatchModalIsOpen ]);

    const onEdit = React.useCallback((integration: Integration) => {
        dispatchModalIsOpen(makeEditAction(integration));
    }, [ dispatchModalIsOpen ]);

    const onDelete = React.useCallback((integration: Integration) => {
        dispatchDeleteModal(useDeleteModalReducer.makeDeleteAction(integration));
    }, [ dispatchDeleteModal ]);

    const onExport = React.useCallback((type: string) => {
        // Todo: When we have pagination, we will need a way to query all pages.
        const exporter = integrationExporterFactory(exporterTypeFromString(type));
        if (integrations) {
            inBrowserDownload(
                exporter.export(integrations),
                `integrations-${format(new Date(Date.now()), 'y-dd-MM')}.${exporter.type}`
            );
        } else {
            addDangerNotification('Unable to download integrations', 'We were unable to download the integrations for exporting. Please try again.');
        }
    }, [ integrations ]);

    const actionResolver = useActionResolver({
        canWriteAll,
        onEdit,
        onDelete
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

    return (
        <>
            <PageHeader>
                <PageHeaderTitle title={ Messages.pages.integrations.list.title }/>
            </PageHeader>
            <Main>
                <Section>
                    <IntegrationsToolbar
                        onAddIntegration={ onAddIntegrationClicked }
                        onExport={ onExport }
                        filters={ integrationFilter.filters }
                        setFilters={ integrationFilter.setFilters }
                        clearFilters={ integrationFilter.clearFilter }
                    >
                        <IntegrationsTable
                            integrations={ integrationRows.rows }
                            onCollapse={ integrationRows.onCollapse }
                            onEnable={ integrationRows.onEnable }
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
