import { Bullseye } from '@patternfly/react-core';
import PageHeader from '@redhat-cloud-services/frontend-components/PageHeader';
import PageHeaderTitle from '@redhat-cloud-services/frontend-components/PageHeader/PageHeaderTitle';
import Section from '@redhat-cloud-services/frontend-components/Section';
import Skeleton from '@redhat-cloud-services/frontend-components/Skeleton';
import Spinner from '@redhat-cloud-services/frontend-components/Spinner';
import useOuia from '@redhat-cloud-services/frontend-components/Ouia/useOuia';
import * as React from 'react';

import { Main } from '../components/Store/Main';

export const AppSkeleton: React.FunctionComponent = () => {
  const ouia = useOuia({
    type: 'AppSkeleton',
  });

  return (
    <div {...ouia}>
      <PageHeader>
        <div className="pf-c-content">
          <PageHeaderTitle title={<Skeleton size="sm" />} />
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
