import { addDangerNotification, addSuccessNotification } from '@redhat-cloud-services/insights-common-typescript';
import * as React from 'react';
import { useContext } from 'react';
import { ClientContext } from 'react-fetching-library';

import { BehaviorGroupSaveModal } from '../../../components/Notifications/BehaviorGroup/BehaviorGroupSaveModal';
import { useGetIntegrations } from '../../../components/Notifications/useGetIntegrations';
import { useGetRecipients } from '../../../components/Notifications/useGetRecipients';
import { useSaveBehaviorGroupMutation } from '../../../services/Notifications/SaveBehaviorGroup';
import { useUpdateBehaviorGroupActionsMutation } from '../../../services/Notifications/UpdateBehaviorGroupActions';
import { deleteIntegrationActionCreator } from '../../../services/useDeleteIntegration';
import { createIntegrationActionCreator } from '../../../services/useSaveIntegration';
import { IntegrationType } from '../../../types/Integration';
import { Action, BehaviorGroup, NewBehaviorGroup, NotificationType, UUID } from '../../../types/Notification';

interface EditBehaviorGroupPageProps {
    behaviorGroup?: Partial<BehaviorGroup>;
    onClose: (saved: boolean) => void;
}

const needsSaving = (original: Partial<BehaviorGroup> | undefined, updated: BehaviorGroup | NewBehaviorGroup) => {
    return original?.id === undefined || original.displayName !== updated.displayName;
};

export const EditBehaviorGroupPage: React.FunctionComponent<EditBehaviorGroupPageProps> = props => {
    const getRecipients = useGetRecipients();
    const getIntegrations = useGetIntegrations();

    const saveBehaviorGroupMutation = useSaveBehaviorGroupMutation();
    const updateBehaviorGroupActionsMutation = useUpdateBehaviorGroupActionsMutation();
    const { query } = useContext(ClientContext);
    const [ creatingIntegrations, setCreatingNotifications ] = React.useState<boolean>(false);

    const onSave = React.useCallback(async (data: BehaviorGroup | NewBehaviorGroup) => {
        const updateBehaviorGroupActions = updateBehaviorGroupActionsMutation.mutate;
        const saveBehaviorGroup = saveBehaviorGroupMutation.mutate;

        return (needsSaving(props.behaviorGroup, data) ?
            saveBehaviorGroup(data).then(value => {
                if (value.payload?.type === 'BehaviorGroup') {
                    return value.payload.value.id;
                } else if (value.payload?.status === 200) {
                    return data.id;
                }

                throw new Error('Behavior group wasn\'t saved');
            }) : Promise.resolve(data.id)).then(behaviorGroupId => {

            // Determine what Integrations we need to create (other than webhook)
            const toCreate: Array<Action> = data.actions.filter(action => !action.integrationId);
            if (toCreate.find(newAction => newAction.type !== NotificationType.EMAIL_SUBSCRIPTION)) {
                throw new Error('Only email subscriptions are created when assigning behavior groups');
            }

            if (toCreate.length > 0) {
                setCreatingNotifications(true);
            }

            return Promise.all(
                toCreate.map(_ => query(createIntegrationActionCreator({
                    type: IntegrationType.EMAIL_SUBSCRIPTION,
                    name: 'Email subscription',
                    isEnabled: true
                }))
                .then(result => result.payload?.type === 'Endpoint' ? result.payload.value.id : undefined)
                )
            ).then(newIds => {
                return updateBehaviorGroupActions({
                    behaviorGroupId: behaviorGroupId as UUID,
                    endpointIds: data.actions.map(action => action.integrationId)
                    .filter(id => id)
                    .concat(newIds as Array<string>)
                });
            });
        }).then(value => {
            if (value.payload?.status === 200) {
                // Delete non-user actions in the background; user doesn't need to wait.
                (props.behaviorGroup?.actions ?? [])
                .filter(action => action.type !== NotificationType.INTEGRATION)
                .filter(action => !data.actions.find(newAction => newAction.integrationId === action.integrationId))
                .map(oldNonUserAction =>  query(deleteIntegrationActionCreator(oldNonUserAction.integrationId)));

                if (data.id === undefined) {
                    addSuccessNotification(
                        'New behavior group created',
                        <>
                            Group <b> { data.displayName } </b> created successfully.
                        </>
                    );
                } else {
                    addSuccessNotification(
                        'Behavior group saved',
                        <>
                            Group <b> { data.displayName } </b> was saved successfully.
                        </>
                    );
                }

                return true;
            }

            if (data.id === undefined) {
                addDangerNotification(
                    'Behavior group failed to be created',
                    <>
                        Failed to create group <b> { data.displayName }</b>.
                        <br />
                        Please try again.
                    </>
                );
            } else {
                addDangerNotification(
                    'Behavior group failed to save',
                    <>
                        Failed to save group <b> { data.displayName }</b>.
                        <br />
                        Please try again.
                    </>
                );
            }

            return false;
        }).catch(err => {
            console.error('Error saving behavior groups', err);
            throw err;
        });
    }, [ saveBehaviorGroupMutation.mutate, updateBehaviorGroupActionsMutation.mutate, props.behaviorGroup, query ]);

    const isSaving = React.useMemo(() => {
        return creatingIntegrations || saveBehaviorGroupMutation.loading || updateBehaviorGroupActionsMutation.loading;
    }, [ creatingIntegrations, saveBehaviorGroupMutation.loading, updateBehaviorGroupActionsMutation.loading ]);

    return (
        <BehaviorGroupSaveModal
            data={ props.behaviorGroup }
            isSaving={ isSaving }
            onClose={ props.onClose }
            onSave={ onSave }
            getRecipients={ getRecipients }
            getIntegrations={ getIntegrations }
        />
    );
};
