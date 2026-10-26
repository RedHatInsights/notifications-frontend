import * as React from 'react';
import { FormattedMessage, defineMessages, useIntl } from 'react-intl';

import { BehaviorGroupSaveModal } from '../../../components/Notifications/BehaviorGroup/BehaviorGroupSaveModal';
import { RecipientContextProvider } from '../../../components/Notifications/RecipientContext';
import { useGetIntegrations } from '../../../components/Notifications/useGetIntegrations';
import { useGetRecipients } from '../../../components/Notifications/useGetRecipients';
import { BehaviorGroup } from '../../../types/Notification';
import { useNotification } from '../../../utils/AlertUtils';
import {
  SaveBehaviorGroupOperation,
  useSaveBehaviorGroup,
} from '../BehaviorGroupWizard/useSaveBehaviorGroup';

const messages = defineMessages({
  createSuccessTitle: {
    id: 'behaviorGroup.edit.createSuccessTitle',
    defaultMessage: 'New behavior group created',
  },
  saveSuccessTitle: {
    id: 'behaviorGroup.edit.saveSuccessTitle',
    defaultMessage: 'Behavior group saved',
  },
  createFailTitle: {
    id: 'behaviorGroup.edit.createFailTitle',
    defaultMessage: 'Behavior group failed to be created',
  },
  saveFailTitle: {
    id: 'behaviorGroup.edit.saveFailTitle',
    defaultMessage: 'Behavior group failed to save',
  },
  createSuccess: {
    id: 'behaviorGroup.edit.createSuccess',
    defaultMessage: 'Group {name} created successfully.',
  },
  saveSuccess: {
    id: 'behaviorGroup.edit.saveSuccess',
    defaultMessage: 'Group {name} was saved successfully.',
  },
  createFail: {
    id: 'behaviorGroup.edit.createFail',
    defaultMessage: 'Failed to create group {name}. Please try again.',
  },
  saveFail: {
    id: 'behaviorGroup.edit.saveFail',
    defaultMessage: 'Failed to save group {name}. Please try again.',
  },
});

interface EditBehaviorGroupPageProps {
  behaviorGroup?: Partial<BehaviorGroup>;
  onClose: (saved: boolean) => void;
}

export const EditBehaviorGroupPage: React.FunctionComponent<EditBehaviorGroupPageProps> = (
  props
) => {
  const getRecipients = useGetRecipients();
  const getIntegrations = useGetIntegrations();
  const { addDangerNotification, addSuccessNotification } = useNotification();
  const intl = useIntl();

  const actionsContextValue = React.useMemo(
    () => ({
      getIntegrations,
      getNotificationRecipients: getRecipients,
    }),
    [getIntegrations, getRecipients]
  );

  const saving = useSaveBehaviorGroup(props.behaviorGroup);

  const onSave = React.useCallback(
    async (behaviorGroup: BehaviorGroup) => {
      const save = saving.save;
      const result = await save(behaviorGroup);

      if (result.status) {
        if (result.operation === SaveBehaviorGroupOperation.CREATE) {
          addSuccessNotification(
            intl.formatMessage(messages.createSuccessTitle),
            <FormattedMessage
              {...messages.createSuccess}
              values={{ name: <b>{behaviorGroup.displayName}</b> }}
            />
          );
        } else {
          addSuccessNotification(
            intl.formatMessage(messages.saveSuccessTitle),
            <FormattedMessage
              {...messages.saveSuccess}
              values={{ name: <b>{behaviorGroup.displayName}</b> }}
            />
          );
        }
      } else {
        if (result.operation === SaveBehaviorGroupOperation.CREATE) {
          addDangerNotification(
            intl.formatMessage(messages.createFailTitle),
            <FormattedMessage
              {...messages.createFail}
              values={{ name: <b>{behaviorGroup.displayName}</b> }}
            />
          );
        } else {
          addDangerNotification(
            intl.formatMessage(messages.saveFailTitle),
            <FormattedMessage
              {...messages.saveFail}
              values={{ name: <b>{behaviorGroup.displayName}</b> }}
            />
          );
        }
      }

      return result.status;
    },
    [saving.save, addDangerNotification, addSuccessNotification, intl]
  );

  return (
    <RecipientContextProvider value={actionsContextValue}>
      <BehaviorGroupSaveModal
        data={props.behaviorGroup}
        isSaving={saving.isSaving}
        onClose={props.onClose}
        onSave={onSave}
      />
    </RecipientContextProvider>
  );
};
