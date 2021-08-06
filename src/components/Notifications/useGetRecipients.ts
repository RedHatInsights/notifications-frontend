import { NotificationRecipient } from '../../types/Recipient';
import { GetNotificationRecipients } from './RecipientContext';

const all: ReadonlyArray<NotificationRecipient> = [
    new NotificationRecipient(undefined, false),
    new NotificationRecipient(undefined, true)
];

const getRecipients = async (search?: string) => {
    if (search) {
        const lowerCaseSearch = search.toLowerCase();
        return all.filter(r => r.displayName.toLowerCase().includes(lowerCaseSearch));
    }

    return all;
};

export const useGetRecipients = (): GetNotificationRecipients => {
    return getRecipients;
};
