import * as React from 'react';

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

interface EditBehaviorGroupPageProps {
  behaviorGroup?: Partial<BehaviorGroup>;
  onClose: (saved: boolean) => void;
}

export const EditBehaviorGroupPage: React.FunctionComponent<EditBehaviorGroupPageProps> =
  (props) => {
    const getRecipients = useGetRecipients();
    const getIntegrations = useGetIntegrations();
    const { addDangerNotification, addSuccessNotification } = useNotification();

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
              'New behavior group created',
              <>
                Group <b> {behaviorGroup.displayName} </b> created successfully.
              </>
            );
          } else {
            addSuccessNotification(
              'Behavior group saved',
              <>
                Group <b> {behaviorGroup.displayName} </b> was saved
                successfully.
              </>
            );
          }
        } else {
          if (result.operation === SaveBehaviorGroupOperation.CREATE) {
            addDangerNotification(
              'Behavior group failed to be created',
              <>
                Failed to create group <b> {behaviorGroup.displayName}</b>.
                <br />
                Please try again.
              </>
            );
          } else {
            addDangerNotification(
              'Behavior group failed to save',
              <>
                Failed to save group <b> {behaviorGroup.displayName}</b>.
                <br />
                Please try again.
              </>
            );
          }
        }

        return result.status;
      },
      [saving.save, addDangerNotification, addSuccessNotification]
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
