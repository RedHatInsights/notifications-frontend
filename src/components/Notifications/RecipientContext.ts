import { createContext, useContext } from 'react';

import { UserIntegrationType } from '../../types/Integration';
import { IntegrationRef } from '../../types/Notification';
import { BaseNotificationRecipient } from '../../types/Recipient';

export type GetIntegrations = (type: UserIntegrationType, search?: string) => Promise<ReadonlyArray<IntegrationRef>>;
export type GetNotificationRecipients = (filter?: string) => Promise<ReadonlyArray<BaseNotificationRecipient>>;

export interface RecipientContext {
    getIntegrations: GetIntegrations,
    getNotificationRecipients: GetNotificationRecipients
}

const RecipientContext = createContext<RecipientContext>({
    getIntegrations: async () => {
        throw new Error('No IntegrationContext found');
    },
    getNotificationRecipients: async () => {
        throw new Error('No RecipientContext found');
    }
});

export const useRecipientContext = () => useContext(RecipientContext);
export const RecipientContextProvider = RecipientContext.Provider;
