import { Bullseye } from '@patternfly/react-core';
import {
    PageHeader,
    PageHeaderTitle,
    Section,
    Skeleton,
    Spinner, useOuia
} from '@redhat-cloud-services/frontend-components';
import * as React from 'react';

import { Main } from '../components/Store/Main';

export const AppSkeleton: React.FunctionComponent = () => {
    const ouia = useOuia({
        type: 'AppSkeleton'
    });

    return (
        <div { ...ouia }>
            <PageHeader>
                <div className="pf-c-content">
                    <PageHeaderTitle title={ <Skeleton size="sm" /> } />
                </div>
            </PageHeader>
            <Main>
                <Section>
                    <Bullseye>
                        <Spinner centered />
                    </Bullseye>
                </Section>
            </Main>
        </div>
    );
};
