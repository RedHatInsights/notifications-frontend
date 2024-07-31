import componentMapper from '@data-driven-forms/pf4-component-mapper/component-mapper';
import Pf4FormTemplate from '@data-driven-forms/pf4-component-mapper/form-template';
import FormRenderer from '@data-driven-forms/react-form-renderer/form-renderer';
import * as React from 'react';
import Review from './Review';
import CardSelect from './CustomComponents/CardSelect';
import InlineAlert from './CustomComponents/InlineAlert';
import SelectableTable from './CustomComponents/SelectableTable';
import { schema } from './schema';
import {
  CARD_SELECT,
  INLINE_ALERT,
  INTEGRATION_TYPE,
  REVIEW,
  SELECTABLE_TABLE,
  TABLE_TOOLBAR,
} from './helpers';
import { Integration } from '../../../types/Integration';
import TableToolbar from './CustomComponents/TableToolbar';
import { useFlag } from '@unleash/proxy-client-react';
import { IntegrationsData } from './CustomComponents/FinalStep';
import { FinalWizard } from './FinalWizard';
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
  afterSubmit: () => void;
}
export const IntegrationWizard: React.FunctionComponent<
  IntegrationWizardProps
> = ({
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
    [SELECTABLE_TABLE]: SelectableTable,
    [TABLE_TOOLBAR]: TableToolbar,
  };
  const isBehaviorGroupsEnabled = useFlag(
    'platform.integrations.behavior-groups-move'
  );
  const [wizardOpen, setWizardOpen] = React.useState<boolean>(isOpen);
  const [wizardState, setWizardState] = React.useState<
    IntegrationsData | undefined
  >();
  React.useEffect(() => {
    setWizardOpen(isOpen);
  }, [isOpen]);
  return (
    <React.Fragment>
      {wizardOpen ? (
        <FormRenderer
          schema={schema(category, isEdit, isBehaviorGroupsEnabled)}
          componentMapper={{ ...componentMapper, ...mapperExtension }}
          onSubmit={({
            url,
            [INTEGRATION_TYPE]: intType,
            name,
            'secret-token': secret_token,
            'event-types-table': event_type_id,
            'product-family': bundle_name,
          }) => {
            const [type, sub_type] = intType?.split(':') || ['webhook'];
            if (!isBehaviorGroupsEnabled) {
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
                    },
                  }),
                }
              );
              closeModal();
            } else {
              setWizardState({
                isEdit,
                url,
                type,
                sub_type,
                name,
                secret_token,
                event_type_id,
                bundle_name,
              });
              setWizardOpen(false);
            }
          }}
          initialValues={
            isEdit
              ? {
                  ...template,
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
      ) : null}
      {wizardState !== undefined && (
        <FinalWizard
          data={wizardState}
          onClose={() => {
            setWizardState(undefined);
            closeModal();
          }}
        />
      )}
    </React.Fragment>
  );
};
