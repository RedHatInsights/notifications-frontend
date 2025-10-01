import componentMapper from '@data-driven-forms/pf4-component-mapper/component-mapper';
import Pf4FormTemplate from '@data-driven-forms/pf4-component-mapper/form-template';
import FormRenderer from '@data-driven-forms/react-form-renderer/form-renderer';
import * as React from 'react';
import Review from './Review';
import CardSelect from './CustomComponents/CardSelect';
import InlineAlert from './CustomComponents/InlineAlert';
import SelectableTable from './CustomComponents/SelectableTable';
import UserAccessGroupsDataView from './CustomComponents/UserAccessGroupsDataView';
import { schema } from './schema';
import {
  CARD_SELECT,
  INLINE_ALERT,
  INTEGRATION_TYPE,
  REVIEW,
  SELECTABLE_TABLE,
  TABLE_TOOLBAR,
  USER_ACCESS_GROUPS_DATAVIEW,
} from './helpers';
import { Integration } from '../../../types/Integration';
import TableToolbar from './CustomComponents/TableToolbar';
import { useFlag } from '@unleash/proxy-client-react';
import {
  createEndpoint,
  updateEndpoint,
} from '../../../api/helpers/integrations/endpoints-helper';
import { useNotification } from '../../../utils/AlertUtils';
import { Provider } from 'react-redux';
import { Store } from 'redux';
import { useIntl } from 'react-intl';
import './styling/integrations-wizard.scss';

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
  afterSubmit,
  closeModal,
  category,
}: IntegrationWizardProps) => {
  const mapperExtension = {
    [REVIEW]: Review,
    [CARD_SELECT]: CardSelect,
    [INLINE_ALERT]: InlineAlert,
    [SELECTABLE_TABLE]: SelectableTable,
    [TABLE_TOOLBAR]: TableToolbar,
    [USER_ACCESS_GROUPS_DATAVIEW]: UserAccessGroupsDataView,
  };
  const isBehaviorGroupsEnabled = useFlag(
    'platform.integrations.behavior-groups-move'
  );
  const isPagerDutyEnabled = useFlag('platform.integrations.pager-duty');
  const isEmailIntegrationEnabled = useFlag(
    'platform.notifications.email.integration'
  );
  const notifications = useNotification();
  const [wizardOpen, setWizardOpen] = React.useState<boolean>(isOpen);
  React.useEffect(() => {
    setWizardOpen(isOpen);
  }, [isOpen]);

  const intl = useIntl();

  return (
    <React.Fragment>
      {wizardOpen && (
        <FormRenderer
          schema={schema(
            category,
            isEdit,
            isBehaviorGroupsEnabled,
            isPagerDutyEnabled,
            isEmailIntegrationEnabled,
            intl
          )}
          componentMapper={{ ...componentMapper, ...mapperExtension }}
          onSubmit={({
            url,
            [INTEGRATION_TYPE]: intType,
            name,
            'secret-token': secret_token,
            'event-types-table': event_types,
            'user-access-groups': userAccessGroups,
            severity,
          }) => {
            const [type, sub_type] = intType?.split(':') || ['webhook'];
            const data = {
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
                severity,
              },
              ...(isBehaviorGroupsEnabled && {
                event_types: event_types
                  ? Object.values(event_types as object).flatMap(Object.keys)
                  : [],
              }),
              // Add user access groups for email integrations
              ...(type === 'email_subscription' &&
                userAccessGroups && {
                  user_access_groups: userAccessGroups,
                }),
            };
            isEdit && template?.id
              ? updateEndpoint(
                  template?.id,
                  data,
                  undefined,
                  notifications,
                  afterSubmit
                )
              : createEndpoint(data, notifications, afterSubmit);
            closeModal();
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
          {(props) => <Pf4FormTemplate {...props} showFormControls={false} />}
        </FormRenderer>
      )}
    </React.Fragment>
  );
};

const IntegrationWizardWrapper: React.FC<
  { store?: Store } & IntegrationWizardProps
> = ({ store, ...props }) => {
  return store ? (
    <Provider store={store}>
      <IntegrationWizard {...props} />
    </Provider>
  ) : (
    <IntegrationWizard {...props} />
  );
};

export default IntegrationWizardWrapper;
