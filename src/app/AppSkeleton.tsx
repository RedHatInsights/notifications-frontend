import { Bullseye } from '@patternfly/react-core';
import {
    PageHeader,
    PageHeaderTitle,
    Section,
    Skeleton,
    Spinner
} from '@redhat-cloud-services/frontend-components';
import * as React from 'react';

import { Main } from '../components/Store/Main';

export const AppSkeleton: React.FunctionComponent = () => {
    return (
        <div>
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
