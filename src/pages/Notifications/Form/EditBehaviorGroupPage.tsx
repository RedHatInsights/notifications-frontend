import { addDangerNotification, addSuccessNotification } from '@redhat-cloud-services/insights-common-typescript';
import * as React from 'react';

import { BehaviorGroupSaveModal } from '../../../components/Notifications/BehaviorGroup/BehaviorGroupSaveModal';
import { RecipientContextProvider } from '../../../components/Notifications/RecipientContext';
import { useGetIntegrations } from '../../../components/Notifications/useGetIntegrations';
import { useGetRecipients } from '../../../components/Notifications/useGetRecipients';
import {
    BehaviorGroup
} from '../../../types/Notification';
import { SaveBehaviorGroupResult, useSaveBehaviorGroup } from './useSaveBehaviorGroup';

interface EditBehaviorGroupPageProps {
    behaviorGroup?: Partial<BehaviorGroup>;
    onClose: (saved: boolean) => void;
}

export const EditBehaviorGroupPage: React.FunctionComponent<EditBehaviorGroupPageProps> = props => {
    const getRecipients = useGetRecipients();
    const getIntegrations = useGetIntegrations();

    const actionsContextValue = React.useMemo(() => ({
        getIntegrations,
        getNotificationRecipients: getRecipients
    }), [ getIntegrations, getRecipients ]);

    const saving = useSaveBehaviorGroup(props.behaviorGroup);

    const onSave = React.useCallback(async (behaviorGroup: BehaviorGroup) => {
        const save = saving.save;
        const result = await save(behaviorGroup);

        if (result.status) {
            if (result.operation === SaveBehaviorGroupResult.CREATE) {
                addSuccessNotification(
                    'New behavior group created',
                    <>
                        Group <b> { behaviorGroup.displayName } </b> created successfully.
                    </>
                );
            } else {
                addSuccessNotification(
                    'Behavior group saved',
                    <>
                        Group <b> { behaviorGroup.displayName } </b> was saved successfully.
                    </>
                );
            }
        } else {
            const template = result.operation === SaveBehaviorGroupResult.CREATE ? {
                action: 'create',
                actionPastTense: 'created'
            } : {
                action: 'save',
                actionPastTense: 'saved'
            };

            const reason = result.usedName ? (
                <>
                    The group name already exists in this or other bundle within your account.
                    <br />
                    Please use a different name.
                </>
            ) : (
                <>
                    Please try again.
                </>
            );

            addDangerNotification(
                `Behavior group failed to be ${template.actionPastTense}`,
                <>
                    Failed to { template.action } group <b> { behaviorGroup.displayName }</b>.
                    <br />
                    { reason }
                </>
            );
        }

        return result.status;
    }, [ saving.save ]);

    return (
        <RecipientContextProvider value={ actionsContextValue }>
            <BehaviorGroupSaveModal
                data={ props.behaviorGroup }
                isSaving={ saving.isSaving }
                onClose={ props.onClose }
                onSave={ onSave }
            />
        </RecipientContextProvider>
    );
};
