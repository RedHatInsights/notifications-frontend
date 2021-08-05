import produce, { castImmutable } from 'immer';
import { SetStateAction, useCallback } from 'react';
import { DeepPartial } from 'ts-essentials';

import { Action, ActionIntegration, ActionNotify, NotificationType } from '../../../types/Notification';
import { IntegrationRecipient, NotificationRecipient } from '../../../types/Recipient';
import { ActionOption } from '../Form/ActionOption';
import { RecipientOption } from '../Form/RecipientOption';

export interface UseBehaviorGroupActionHandlers {
    handleActionSelected: (index: number) => (value: ActionOption) => void;
    handleIntegrationSelected: (index: number) => (value: RecipientOption) => void;
    handleRecipientSelected: (index: number) => (value: RecipientOption) => void;
    handleRecipientOnClear: (index: number) => () => void;
}

export type SetActionUpdater = SetStateAction<ReadonlyArray<DeepPartial<Action>>>;

export const useBehaviorGroupActionHandlers = (
    setActions: (updater: SetActionUpdater) => void
): UseBehaviorGroupActionHandlers => {

    const handleActionSelected = useCallback((index: number) => (value: ActionOption) => {
        setActions(produce(prev => {
            const row = prev[index];
            row.type = value.notificationType;
            row.integrationId = '';
            if (value.integrationType) {
                const rowAsIntegration = row as DeepPartial<ActionIntegration>;
                rowAsIntegration.integration = {
                    type: value.integrationType
                };
            } else {
                const rowAsNotification = row as DeepPartial<ActionNotify>;
                rowAsNotification.recipient = [];
            }
        }));
    }, [ setActions ]);

    const handleIntegrationSelected = useCallback((index: number) => (value: RecipientOption) => {
        setActions(produce(prev => {
            if (value.recipient instanceof IntegrationRecipient) {
                const rowAsIntegration = prev[index] as DeepPartial<ActionIntegration>;
                rowAsIntegration.integration = value.recipient.integration;
                rowAsIntegration.integrationId = value.recipient.integration.id;
            }
        }));
    }, [ setActions ]);

    const handleRecipientSelected = useCallback((index: number) => (value: RecipientOption) => {
        setActions(produce(prev => {
            const row = prev[index];
            if (row.type !== NotificationType.INTEGRATION) {
                const rowAsNotification = row as DeepPartial<ActionNotify>;
                if (rowAsNotification.recipient) {
                    const index = rowAsNotification.recipient.findIndex(r => value.recipient.equals(r as NotificationRecipient));
                    console.log('index', index);
                    if (index === -1) {
                        rowAsNotification.recipient = [ ...rowAsNotification.recipient, value.recipient ];
                    } else {
                        rowAsNotification.recipient = rowAsNotification.recipient.filter((_, i) => i !== index);
                    }
                }
            }
        }));
    }, [ setActions ]);

    const handleRecipientOnClear = useCallback((index: number) => () => {
        setActions(produce(prev => {
            const row = prev[index];
            if (row.type !== NotificationType.INTEGRATION) {
                const rowAsNotification = row as DeepPartial<ActionNotify>;
                rowAsNotification.recipient = [];
            }
        }));
    }, [ setActions ]);

    return {
        handleActionSelected,
        handleIntegrationSelected,
        handleRecipientSelected,
        handleRecipientOnClear
    };
};
