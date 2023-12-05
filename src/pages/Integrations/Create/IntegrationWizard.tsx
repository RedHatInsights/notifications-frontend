import componentMapper from '@data-driven-forms/pf4-component-mapper/component-mapper';
import Pf4FormTemplate from '@data-driven-forms/pf4-component-mapper/form-template';
import FormRenderer from '@data-driven-forms/react-form-renderer/form-renderer';
import * as React from 'react';

import Review from './Review';
import CardSelect from './CustomComponents/CardSelect';
import InlineAlert from './CustomComponents/InlineAlert';
import { schema } from './schema';
import { CARD_SELECT, INLINE_ALERT, INTEGRATION_TYPE, REVIEW } from './helpers';
import { Integration } from '../../../types/Integration';

export interface IntegrationWizardProps {
  category: string;
  isOpen: boolean;
  isEdit: boolean;
  template?: Partial<
    Integration & {
      secretToken: string;
      id: string;
      extras?: {
        channel?: string;
      };
    }
  >;
  closeModal: () => void;
}

export const IntegrationWizard: React.FunctionComponent<IntegrationWizardProps> =
  ({
    isOpen,
    isEdit,
    template,
    closeModal,
    category,
  }: IntegrationWizardProps) => {
    const mapperExtension = {
      [REVIEW]: Review,
      [CARD_SELECT]: CardSelect,
      [INLINE_ALERT]: InlineAlert,
    };

    return isOpen ? (
      <FormRenderer
        schema={schema(category, isEdit)}
        componentMapper={{ ...componentMapper, ...mapperExtension }}
        onSubmit={({
          url,
          [INTEGRATION_TYPE]: intType,
          name,
          'secret-token': secret_token,
          channel,
        }) => {
          const [type, sub_type] = intType?.split(':') || ['webhook'];
          fetch(
            `/api/integrations/v1.0/endpoints${
              isEdit ? `/${template?.id}` : ''
            }`,
            {
              method: isEdit ? 'PUT' : 'POST',
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
            }
          );
          closeModal();
        }}
        initialValues={
          isEdit
            ? {
                ...template,
                channel: template?.extras?.channel,
                'secret-token': template?.secretToken,
              }
            : {}
        }
        onCancel={closeModal}
      >
        {(props) => {
          return <Pf4FormTemplate {...props} showFormControls={false} />;
        }}
      </FormRenderer>
    ) : null;
  };
