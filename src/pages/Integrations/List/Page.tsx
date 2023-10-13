import { Button, Split, SplitItem } from '@patternfly/react-core';
import { PageHeader, PageHeaderTitle, Section } from '@redhat-cloud-services/frontend-components';
import useChrome from '@redhat-cloud-services/frontend-components/useChrome';
import * as React from 'react';
import { Link } from 'react-router-dom';

import { Main } from '../../../components/Store/Main';
import { useNonProdFlag } from '../../../hooks/useNonProdFlag';
import { Messages } from '../../../properties/Messages';
import { linkTo } from '../../../Routes';
import IntegrationsList from './List';

export const IntegrationsListPage: React.FunctionComponent = () => {

    const { updateDocumentTitle, getBundle } = useChrome();

    updateDocumentTitle?.('Integrations');

    const notificationsOverhaul = useNonProdFlag('platform.notifications.overhaul');

    return (
        <Section className='pf-c-page__main-section pf-m-light'>
            <PageHeader>
                <Split>
                    <SplitItem isFilled>
                        <PageHeaderTitle title={ Messages.pages.integrations.list.title } />
                    </SplitItem>
                    { !notificationsOverhaul && <SplitItem>
                        <Button variant='secondary' component={ () =>
                            <Link to={ `/${getBundle()}/notifications${linkTo.eventLog()}` } /> }> View event log </Button>
                    </SplitItem> }
                </Split>
            </PageHeader>
            <Main>
                <IntegrationsList />
            </Main>
        </Section>
    );
};
