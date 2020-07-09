import * as React from 'react';
import { Main, PageHeader, PageHeaderTitle, Section } from '@redhat-cloud-services/frontend-components';
import { Messages } from '../../../properties/Messages';

export const IntegrationsListPage: React.FunctionComponent = () => {

    return (
        <>
            <PageHeader>
                <PageHeaderTitle title={ Messages.pages.integrations.list.title }/>
            </PageHeader>
            <Main>
                <Section>

                </Section>
            </Main>
        </>
    );
};
