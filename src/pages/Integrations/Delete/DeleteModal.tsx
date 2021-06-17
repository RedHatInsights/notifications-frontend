import {
    ActionModalError,
    addSuccessNotification,
    OuiaComponentProps } from '@redhat-cloud-services/insights-common-typescript';
import * as React from 'react';

import { IntegrationDeleteModal } from '../../../components/Integrations/DeleteModal';
import { useGetAffectedBehaviorGroupsByEndpoint } from '../../../services/Notifications/GetAffectedBehaviorGroupsByEndpoint';
import { useDeleteIntegration } from '../../../services/useDeleteIntegration';
import { UserIntegration } from '../../../types/Integration';

interface IntegrationDeleteModalPageProps extends OuiaComponentProps {
    onClose: (deleted: boolean) => void;
    integration: UserIntegration;
}

export const IntegrationDeleteModalPage: React.FunctionComponent<IntegrationDeleteModalPageProps> = (props) => {

    const deleteIntegrationMutation = useDeleteIntegration();
    const getBehaviorGroupsQuery = useGetAffectedBehaviorGroupsByEndpoint();
    const [ hasError, setError ] = React.useState(false);

    const onDelete = React.useCallback((integration: UserIntegration) => {
        const deleteIntegration = deleteIntegrationMutation.mutate;
        setError(false);
        return deleteIntegration(integration.id).then((response) => {
            if (!response.error) {
                addSuccessNotification('Integration removed', 'The integration was removed.');
                return true;
            } else {
                setError(true);
                return false;
            }
        });
    }, [ deleteIntegrationMutation.mutate, setError ]);

    const error = React.useMemo<ActionModalError | undefined>(() => {
        if (hasError) {
            return {
                title: 'Failed to remove Integration',
                description: <p>There was an error trying to remove the Integration. Please try again.</p>
            };
        }

        return undefined;
    }, [ hasError ]);

    React.useEffect(() => {
        const query = getBehaviorGroupsQuery.query;
        query(props.integration.id);
    }, [ props.integration, getBehaviorGroupsQuery.query ]);

    const behaviorGroups = React.useMemo(() => {
        const payload = getBehaviorGroupsQuery.payload;
        if (payload && payload.type === 'BehaviorGroups') {
            return payload.value;
        }

        return undefined;
    }, [ getBehaviorGroupsQuery.payload ]);

    return (
        <IntegrationDeleteModal
            integration={ props.integration }
            behaviorGroups={ behaviorGroups }
            isDeleting={ deleteIntegrationMutation.loading }
            onClose={ props.onClose }
            onDelete={ onDelete }
            error={ error }
        />
    );
};
