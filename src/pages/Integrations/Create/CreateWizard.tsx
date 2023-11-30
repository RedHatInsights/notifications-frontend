import componentMapper from '@data-driven-forms/pf4-component-mapper/component-mapper';
import Pf4FormTemplate from '@data-driven-forms/pf4-component-mapper/form-template';
import FormRenderer from '@data-driven-forms/react-form-renderer/form-renderer';
import * as React from 'react';

import Review from './Review';
import CardSelect from './CustomComponents/CardSelect';
import InlineAlert from './CustomComponents/InlineAlert';
import { schema } from './schema';

export const SUMMARY = 'summary-content';
export const CARD_SELECT = 'card-select';
export const INLINE_ALERT = 'inline-alert';
export interface CreateWizardProps {
  category?: string;
  isOpen: boolean;
  closeModal: () => void;
}

export const CreateWizard: React.FunctionComponent<CreateWizardProps> = ({
  isOpen,
  closeModal,
  category,
}: CreateWizardProps) => {
  const mapperExtension = {
    [SUMMARY]: Review,
    [CARD_SELECT]: CardSelect,
    [INLINE_ALERT]: InlineAlert,
  };
  React.useEffect(() => {
    console.log(`Active category: ${category}`);
  }, [category]);

  return isOpen ? (
    <FormRenderer
      schema={schema(category)}
      FormTemplate={(props) => (
        <Pf4FormTemplate {...props} showFormControls={false} />
      )}
      componentMapper={{ ...componentMapper, ...mapperExtension }}
      onSubmit={({
        'endpoint-url': url,
        'integration-type': intType,
        'integration-name': name,
        'service_now-secret-token': secret_token,
        channel,
      }) => {
        const [type, sub_type] = intType?.split(':') || ['webhook'];
        fetch('/api/integrations/v1.0/endpoints', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json;charset=UTF-8',
          },
          body: JSON.stringify({
            name,
            enabled: true,
            type,
            ...(sub_type && { sub_type }),
            description: '',
            properties: {
              method: 'POST',
              url,
              disable_ssl_verification: false,
              secret_token,
              ...(channel && {
                extras: {
                  channel,
                },
              }),
            },
          }),
        });
        closeModal();
      }}
      onCancel={() => closeModal()}
    />
  ) : null;
};
