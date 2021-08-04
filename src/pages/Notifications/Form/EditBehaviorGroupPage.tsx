import { addDangerNotification, addSuccessNotification } from '@redhat-cloud-services/insights-common-typescript';
import isEqual from 'lodash/isEqual';
import uniqWith from 'lodash/uniqWith';
import * as React from 'react';
import { useContext } from 'react';
import { ClientContext } from 'react-fetching-library';

import { BehaviorGroupSaveModal } from '../../../components/Notifications/BehaviorGroup/BehaviorGroupSaveModal';
import { RecipientContextProvider } from '../../../components/Notifications/RecipientContext';
import { useGetIntegrations } from '../../../components/Notifications/useGetIntegrations';
import { useGetRecipients } from '../../../components/Notifications/useGetRecipients';
import { getDefaultSystemEndpointAction } from '../../../services/Integrations/GetDefaultSystemEndpoint';
import { useSaveBehaviorGroupMutation } from '../../../services/Notifications/SaveBehaviorGroup';
import { useUpdateBehaviorGroupActionsMutation } from '../../../services/Notifications/UpdateBehaviorGroupActions';
import { toSystemProperties } from '../../../types/adapters/NotificationAdapter';
import {
    BehaviorGroup,
    NewBehaviorGroup,
    NotificationType,
    SystemProperties,
    UUID
} from '../../../types/Notification';

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

    const actionsContextValue = React.useMemo(() => ({
        getIntegrations,
        getNotificationRecipients: getRecipients
    }), [ getIntegrations, getRecipients ]);

    const saveBehaviorGroupMutation = useSaveBehaviorGroupMutation();
    const updateBehaviorGroupActionsMutation = useUpdateBehaviorGroupActionsMutation();
    const { query } = useContext(ClientContext);
    const [ fetchingIntegrations, setFetchingIntegrations ] = React.useState<boolean>(false);

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

            // Determine what system Integrations we need to fetch
            const toFetch: Array<SystemProperties> = uniqWith(
                data.actions.filter(action => !action.integrationId).map(action => toSystemProperties(action)),
                isEqual
            );

            if (toFetch.find(props => props.type !== NotificationType.EMAIL_SUBSCRIPTION)) {
                throw new Error('Only email subscriptions are created when assigning behavior groups');
            }

            if (toFetch.length > 0) {
                setFetchingIntegrations(true);
            }

            return Promise.all(
                toFetch.map(props => query(getDefaultSystemEndpointAction(props))
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
        return fetchingIntegrations || saveBehaviorGroupMutation.loading || updateBehaviorGroupActionsMutation.loading;
    }, [ fetchingIntegrations, saveBehaviorGroupMutation.loading, updateBehaviorGroupActionsMutation.loading ]);

    return (
        <RecipientContextProvider value={ actionsContextValue }>
            <BehaviorGroupSaveModal
                data={ props.behaviorGroup }
                isSaving={ isSaving }
                onClose={ props.onClose }
                onSave={ onSave }
            />
        </RecipientContextProvider>
    );
};
