import { useCallback } from 'react';

import { useRbacGroups } from '../../app/rbac/RbacGroupContext';
import { NotificationRbacGroupRecipient } from '../../types/Recipient';
import { GetNotificationRecipients } from './RecipientContext';

export const useGetRecipients = (): GetNotificationRecipients => {
    const rbacGroups = useRbacGroups();
    return useCallback(async () => {
        return rbacGroups.groups.map(r => new NotificationRbacGroupRecipient(
            undefined,
            r.id,
            r.name
        ));
    }, [ rbacGroups ]);
};
