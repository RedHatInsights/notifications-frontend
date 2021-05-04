import * as React from 'react';

import { BehaviorGroupSaveModal } from '../../../components/Notifications/BehaviorGroup/BehaviorGroupSaveModal';
import { useGetIntegrations } from '../../../components/Notifications/useGetIntegrations';
import { useGetRecipients } from '../../../components/Notifications/useGetRecipients';
import { BehaviorGroup } from '../../../types/Notification';

interface EditBehaviorGroupPageProps {
    behaviorGroup?: Partial<BehaviorGroup>;
    onClose: (saved: boolean) => void;
}

export const EditBehaviorGroupPage: React.FunctionComponent<EditBehaviorGroupPageProps> = props => {
    const getRecipients = useGetRecipients();
    const getIntegrations = useGetIntegrations();

    return (
        <BehaviorGroupSaveModal
            data={ props.behaviorGroup }
            isSaving={ true }
            onClose={ props.onClose }
            onSave={ () => true }
            getRecipients={ getRecipients }
            getIntegrations={ getIntegrations }
        />
    );
};
