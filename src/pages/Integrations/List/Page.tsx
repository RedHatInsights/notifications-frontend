import { Button, Split, SplitItem } from '@patternfly/react-core';
import PageHeaderTitle from '@redhat-cloud-services/frontend-components/PageHeader/PageHeaderTitle';
import PageHeader from '@redhat-cloud-services/frontend-components/PageHeader/PageHeader';
import Section from '@redhat-cloud-services/frontend-components/Section';
import useChrome from '@redhat-cloud-services/frontend-components/useChrome';
import { useFlag } from '@unleash/proxy-client-react';
import * as React from 'react';
import { defineMessages, useIntl } from 'react-intl';
import { Link } from 'react-router-dom';

import { Messages } from '../../../properties/Messages';
import { linkTo } from '../../../Routes';
import IntegrationsList from './List';

const messages = defineMessages({
  viewEventLog: {
    id: 'integrations.list.viewEventLog',
    defaultMessage: 'View event log',
  },
});

export const IntegrationsListPage: React.FunctionComponent = () => {
  const intl = useIntl();
  const { updateDocumentTitle, getBundle } = useChrome();

  updateDocumentTitle?.('Integrations');

  const notificationsOverhaul = useFlag('platform.notifications.overhaul');

  return (
    <Section className="pf-c-page__main-section pf-m-light">
      <PageHeader>
        <Split>
          <SplitItem isFilled>
            <PageHeaderTitle title={Messages.pages.integrations.list.title} />
          </SplitItem>
          {!notificationsOverhaul && (
            <SplitItem>
              <Button
                variant="secondary"
                component={() => <Link to={`/${getBundle()}/notifications${linkTo.eventLog()}`} />}
              >
                {intl.formatMessage(messages.viewEventLog)}
              </Button>
            </SplitItem>
          )}
        </Split>
      </PageHeader>
      <IntegrationsList />
    </Section>
  );
};
