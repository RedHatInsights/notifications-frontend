import * as React from 'react';
import { Main, PageHeader, PageHeaderTitle, Section } from '@redhat-cloud-services/frontend-components';
import { Messages } from '../../../properties/Messages';
import { IntegrationsToolbar } from '../../../components/Integrations/Toolbar';
import { IntegrationsTable } from '../../../components/Integrations/Table';
import { Integration, NewIntegration } from '../../../types/Integration';
import { useIntegrationRows } from './useIntegrationRows';
import { useActionResolver } from './useActionResolver';
import { useContext } from 'react';
import { AppContext } from '../../../app/AppContext';
import { CreatePage } from '../Create/CreatePage';
import { useIntegrationFilter } from './useIntegrationFilter';
import { useListIntegrationsQuery } from '../../../services/useListIntegrations';
import { makeCreateAction, makeEditAction, makeNoneAction, useFormModalReducer } from './useFormModalReducer';
import { useSaveIntegrationMutation } from '../../../services/useSaveIntegration';
import { toServerIntegrationRequest } from '../../../types/adapters/IntegrationAdapter';
import { DeleteIntegrationModal } from '../Delete/DeleteModal';
import { useDeleteModalReducer } from './useDeleteModalReducer';

const onExport = (type: string) => console.log('export to ' + type);

export const IntegrationsListPage: React.FunctionComponent = () => {

    const { rbac: { canWriteAll }} = useContext(AppContext);
    const integrationsQuery = useListIntegrationsQuery();

    const saveIntegrationMutation = useSaveIntegrationMutation();
    const integrationRows = useIntegrationRows(integrationsQuery.payload);
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

    const actionResolver = useActionResolver({
        canWriteAll,
        onEdit,
        onDelete
    });

    const closeFormModal = React.useCallback(() => {
        dispatchModalIsOpen(makeNoneAction());
    }, [ dispatchModalIsOpen ]);

    const closeDeleteModal = React.useCallback((deleted: boolean) => {
        const query = integrationsQuery.query;
        if (deleted) {
            query();
        }

        dispatchDeleteModal(useDeleteModalReducer.makeNoneAction());
    }, [ dispatchDeleteModal, integrationsQuery.query ]);

    const onSaveIntegration = React.useCallback((integration: NewIntegration) => {
        const query = integrationsQuery.query;
        const closeAndReload = () => {
            closeFormModal();
            query();
        };

        if (integration.id) {
            // Todo: Update integration flow
            closeFormModal();
        } else {
            saveIntegrationMutation.mutate(toServerIntegrationRequest(integration)).then(closeAndReload);
        }

        closeFormModal();
    }, [ closeFormModal, saveIntegrationMutation, integrationsQuery.query ]);

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
                    <CreatePage
                        isModalOpen={ modalIsOpenState.isOpen }
                        isEdit={ modalIsOpenState.isEdit }
                        initialValue={ modalIsOpenState.template || {} }
                        onClose={ closeFormModal }
                        onSave={ onSaveIntegration }
                    />
                    { deleteModalState.integration && (
                        <DeleteIntegrationModal
                            isOpen={ deleteModalState.isOpen }
                            onClose={ closeDeleteModal }
                            integration={ deleteModalState.integration }
                        />
                    )}
                </Section>
            </Main>
        </>
    );
};
