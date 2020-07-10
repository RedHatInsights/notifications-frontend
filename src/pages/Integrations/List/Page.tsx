import * as React from 'react';
import { Main, PageHeader, PageHeaderTitle, Section } from '@redhat-cloud-services/frontend-components';
import { Messages } from '../../../properties/Messages';
import { IntegrationsToolbar } from '../../../components/Integrations/Toolbar';
import { IntegrationsTable } from '../../../components/Integrations/Table';
import { Integration, IntegrationType } from '../../../types/Integration';
import { useIntegrationRows } from './useIntegrationRows';

const onAddIntegration = () => console.log('add integration');
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

    const integrationRows = useIntegrationRows(integrations);

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
                    />
                </Section>
            </Main>
        </>
    );
};
