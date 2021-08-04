import { GetNotificationRecipients } from './RecipientContext';

const recipients = [
    'Admin',
    'Another one',
    'Default user access',
    'Security admin',
    'Stakeholders'
];

const getRecipients = async (search?: string) => {
    if (search && search !== '') {
        const lowerCaseSearchString = search.toLowerCase();
        return recipients.filter(r => r.toLowerCase().includes(lowerCaseSearchString));
    }

    return recipients;
};

export const useGetRecipients = (): GetNotificationRecipients => {
    return getRecipients;
};
