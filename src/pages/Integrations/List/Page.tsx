import * as React from 'react';
import { Main, PageHeader, PageHeaderTitle, Section } from '@redhat-cloud-services/frontend-components';
import { Messages } from '../../../properties/Messages';
import { IntegrationsToolbar } from '../../../components/Integrations/Toolbar';
import { IntegrationsTable } from '../../../components/Integrations/Table';
import { Integration, IntegrationType, NewIntegration } from '../../../types/Integration';
import { useIntegrationRows } from './useIntegrationRows';
import { useActionResolver } from './useActionResolver';
import { useContext, useState } from 'react';
import { AppContext } from '../../../app/AppContext';
import { CreatePage } from '../Create/CreatePage';
import { useIntegrationFilter } from './useIntegrationFilter';
import { makeCreateAction, makeEditAction, makeNoneAction, useOpenModalReducer } from './useOpenModalReducer';

const onExport = (type: string) => console.log('export to ' + type);

export const IntegrationsListPage: React.FunctionComponent = () => {

    const { rbac: { canWriteAll }} = useContext(AppContext);

    const [ integrations, setIntegrations ] = useState<Array<Integration>>([
        {
            id: 'foo',
            isEnabled: true,
            name: 'Aha',
            type: IntegrationType.HTTP,
            url: 'https://aha.com'
        },
        {
            id: 'foo-2',
            isEnabled: true,
            name: 'Pager duty',
            type: IntegrationType.HTTP,
            url: 'https://pagerduty.com/weebhook/thatthis'
        }
    ]);
    const integrationRows = useIntegrationRows(integrations);
    const integrationFilter = useIntegrationFilter();

    const [ modalIsOpenState, dispatchModalIsOpen ] = useOpenModalReducer();

    const onAddIntegrationClicked = React.useCallback(() => {
        dispatchModalIsOpen(makeCreateAction());
    }, [ dispatchModalIsOpen ]);

    const onEdit = React.useCallback((integration: Integration) => {
        dispatchModalIsOpen(makeEditAction(integration));
    }, [ dispatchModalIsOpen ]);

    const actionResolver = useActionResolver({
        canWriteAll,
        onEdit
    });

    const closeModal = React.useCallback(() => {
        dispatchModalIsOpen(makeNoneAction());
    }, [ dispatchModalIsOpen ]);

    const onSaveIntegration = React.useCallback((integration: NewIntegration) => {
        if (integration.id) {
            setIntegrations(prev => {
                return prev.map(i => {
                    if (i.id === integration.id) {
                        return {
                            ...i,
                            ...integration
                        };
                    }

                    return i;
                });
            });
        } else {
            setIntegrations(prev => {
                return prev.concat([{
                    ...integration,
                    isEnabled: true,
                    id: 'random' + Math.random() * 5000
                }]);
            });
        }

        closeModal();
    }, [ closeModal, setIntegrations ]);

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
                        onClose={ closeModal }
                        onSave={ onSaveIntegration }
                    />
                </Section>
            </Main>
        </>
    );
};
