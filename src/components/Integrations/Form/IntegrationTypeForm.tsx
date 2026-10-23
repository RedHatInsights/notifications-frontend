import { assertNever } from 'assert-never';
import * as React from 'react';
import { defineMessages, useIntl } from 'react-intl';
import { IntegrationType, UserIntegrationType, isCamelType } from '../../../types/Integration';
import { IntegrationTypeCamelExtrasForm } from './IntegrationTypeCamelExtrasForm';
import { IntegrationTypeCamelForm } from './IntegrationTypeCamelForm';
import { IntegrationTypeGoogleChatForm } from './IntegrationTypeGoogleChatForm';
import { IntegrationTypeHttpForm } from './IntegrationTypeHttpForm';
import { IntegrationTypeSlackForm } from './IntegrationTypeSlackForm';
import { IntegrationTypeTeamsForm } from './IntegrationTypeTeamsForm';
import { OuiaProps } from '@redhat-cloud-services/frontend-components/Ouia/Ouia';

const messages = defineMessages({
  splunkSecretTokenDescription: {
    id: 'integrations.typeForm.splunkSecretTokenDescription',
    defaultMessage: "The defined secret token is sent as a Splunk's HTTP Event Collector token.",
  },
  splunkSecretTokenLabel: {
    id: 'integrations.typeForm.splunkSecretTokenLabel',
    defaultMessage: 'Splunk HEC token',
  },
  serviceNowSecretTokenDescription: {
    id: 'integrations.typeForm.serviceNowSecretTokenDescription',
    defaultMessage: 'Password of a ServiceNow integration user.',
  },
});

export interface IntegrationTypeForm extends OuiaProps {
  type: UserIntegrationType;
}

export const IntegrationTypeForm: React.FunctionComponent<IntegrationTypeForm> = (props) => {
  const intl = useIntl();

  if (isCamelType(props.type)) {
    switch (props.type) {
      case UserIntegrationType.SPLUNK:
        return (
          <IntegrationTypeCamelExtrasForm
            secretTokenDescription={intl.formatMessage(messages.splunkSecretTokenDescription)}
            secretTokenLabel={intl.formatMessage(messages.splunkSecretTokenLabel)}
            secretTokenRequired={true}
            {...props}
          />
        );
      case UserIntegrationType.SERVICE_NOW:
        return (
          <IntegrationTypeCamelExtrasForm
            secretTokenDescription={intl.formatMessage(messages.serviceNowSecretTokenDescription)}
            {...props}
          />
        );
      case UserIntegrationType.SLACK:
        return <IntegrationTypeSlackForm {...props} />;
      case UserIntegrationType.TEAMS:
        return <IntegrationTypeTeamsForm {...props} />;
      case UserIntegrationType.GOOGLE_CHAT:
        return <IntegrationTypeGoogleChatForm {...props} />;
    }

    return <IntegrationTypeCamelForm {...props} />;
  }

  switch (props.type) {
    case IntegrationType.WEBHOOK:
    case IntegrationType.ANSIBLE:
      return <IntegrationTypeHttpForm {...props} />;
    case IntegrationType.PAGERDUTY:
      return null;
    case UserIntegrationType.EMAIL:
      return null; // Email integrations don't need a configuration form
    default:
      assertNever(props.type);
  }
};
