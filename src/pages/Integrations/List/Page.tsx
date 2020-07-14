import * as React from 'react';
import { Main, PageHeader, PageHeaderTitle, Section } from '@redhat-cloud-services/frontend-components';
import { useHistory } from 'react-router-dom';
import { Messages } from '../../../properties/Messages';
import { IntegrationsToolbar } from '../../../components/Integrations/Toolbar';
import { IntegrationsTable } from '../../../components/Integrations/Table';
import { Integration, IntegrationType } from '../../../types/Integration';
import { useIntegrationRows } from './useIntegrationRows';
import { linkTo } from '../../../Routes';
import { useActionResolver } from './useActionResolver';
import { useContext, useState } from 'react';
import { AppContext } from '../../../app/AppContext';
import CreatePage from '../Create/CreatePage';

const onExport = (type: string) => console.log('export to ' + type);
const integrations: Array<Integration> = [
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
];

export const IntegrationsListPage: React.FunctionComponent = () => {

    const { rbac: { canWriteAll }} = useContext(AppContext);
    const integrationRows = useIntegrationRows(integrations);
    const history = useHistory();

    const [activateModal,updateModal] = useState(false);
    const [model,updateModel] = useState([integrationRows.rows]);

    const onAddIntegration = React.useCallback(() => {
        // history.push(linkTo.addIntegration());
        updateModal(true);
    }, [ history ]);

    const onEdit = React.useCallback((integration: Integration) => {
        console.log('edit', integration.id);
    }, [ ]);

    const actionResolver = useActionResolver({
        canWriteAll,
        onEdit
    });

    return (
        <>
            <PageHeader>
                <PageHeaderTitle title={ Messages.pages.integrations.list.title }/>
            </PageHeader>
            <Main>
                <Section>
                    <IntegrationsToolbar onAddIntegration={ onAddIntegration } onExport={ onExport }/>
                    <IntegrationsTable
                        integrations={ integrationRows.rows }
                        onCollapse={ integrationRows.onCollapse }
                        onEnable={ integrationRows.onEnable }
                        actionResolver={ actionResolver }
                    />
                    <CreatePage isModalOpen={activateModal} updateModal={updateModal} updateModel={updateModel} model={model} />
                </Section>
            </Main>
        </>
    );
};
