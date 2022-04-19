import produce, { castDraft, Draft, original } from 'immer';
import { SetStateAction, useCallback } from 'react';
import { DeepPartial } from 'ts-essentials';

import { Action, ActionIntegration, ActionNotify, NotificationType } from '../../../types/Notification';
import { BaseNotificationRecipient, IntegrationRecipient, NotificationUserRecipient } from '../../../types/Recipient';
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
            if (!prev[index]) {
                prev[index] = {};
            }

            const row = prev[index];
            row.type = value.notificationType;
            if (value.integrationType) {
                const rowAsIntegration = row as Draft<DeepPartial<ActionIntegration>>;
                rowAsIntegration.integration = {
                    type: value.integrationType
                };
            } else {
                const rowAsNotification = row as Draft<ActionNotify>;
                rowAsNotification.recipient = [];
            }
        }));
    }, [ setActions ]);

    const handleIntegrationSelected = useCallback((index: number) => (value: RecipientOption) => {
        setActions(produce(prev => {
            if (value.recipient instanceof IntegrationRecipient) {
                const rowAsIntegration = prev[index] as Draft<ActionIntegration>;
                rowAsIntegration.integration = value.recipient.integration;
            }
        }));
    }, [ setActions ]);

    const handleRecipientSelected = useCallback((index: number) => (value: RecipientOption) => {
        setActions(produce(prev => {
            const row = prev[index];
            if (row.type !== NotificationType.INTEGRATION) {
                const rowAsNotification = row as Draft<ActionNotify>;
                const originalRecipient = original(rowAsNotification.recipient);
                if (originalRecipient) {
                    const index = originalRecipient.findIndex(r => value.recipient.equals(r as NotificationUserRecipient));
                    if (index === -1) {
                        rowAsNotification.recipient.push(castDraft(value.recipient as BaseNotificationRecipient));
                    } else {
                        rowAsNotification.recipient.splice(index, 1);
                    }
                }
            }
        }));
    }, [ setActions ]);

    const handleRecipientOnClear = useCallback((index: number) => () => {
        setActions(produce(prev => {
            const row = prev[index];
            if (row.type !== NotificationType.INTEGRATION) {
                const rowAsNotification = row as Draft<ActionNotify>;
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
