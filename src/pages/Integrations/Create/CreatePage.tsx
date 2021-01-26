import { ActionModalError, addSuccessNotification } from '@redhat-cloud-services/insights-common-typescript';
import * as React from 'react';

import { AddNotificationBody } from '../../../components/Integrations/AddNotificationBody';
import { IntegrationSaveModal } from '../../../components/Integrations/SaveModal';
import { useSaveIntegrationMutation } from '../../../services/useSaveIntegration';
import { NewUserIntegration, UserIntegration } from '../../../types/Integration';
import { useDispatch, useSelector } from 'react-redux';
import {
    savedNotificationScopeEqualFn,
    savedNotificationScopeSelector
} from '../../../store/selectors/SavedNotificationScopeSelector';
import { Status } from '../../../store/types/SavedNotificationScopeTypes';
import { IntegrationRef } from '../../../types/Notification';
import { SavedNotificationScopeActions } from '../../../store/actions/SavedNotificationScopeAction';
import { useSwitchIntegrationEnabledStatus } from '../../../services/useSwitchIntegrationEnabledStatus';

interface CreatePageProps {
    isEdit: boolean;
    initialIntegration: Partial<UserIntegration>;
    onClose: (saved: boolean) => void;
}

interface AddNotificationBodyContainer {
    integration: IntegrationRef;
}

const AddNotificationBodyContainer: React.FunctionComponent<AddNotificationBodyContainer> = (props) => {

    const savedNotificationScope = useSelector(savedNotificationScopeSelector, savedNotificationScopeEqualFn);
    const dispatch = useDispatch();
    const switchIntegrationEnabledStatus = useSwitchIntegrationEnabledStatus();

    const onClick = React.useCallback((): void => {
        const mutate = switchIntegrationEnabledStatus.mutate;
        console.log('mutating', savedNotificationScope);
        if (savedNotificationScope) {
            dispatch(SavedNotificationScopeActions.start());
            const integration = savedNotificationScope.integration;
            mutate(integration).then(response => {
                console.log('response from server is:', response);
                if (response.status === 200) {
                    dispatch(SavedNotificationScopeActions.finish(!integration.isEnabled));
                } else {
                    dispatch(SavedNotificationScopeActions.finish(integration.isEnabled));
                }
            });
        }
    }, [ switchIntegrationEnabledStatus.mutate, dispatch, savedNotificationScope ]);

    React.useEffect(() => {
        dispatch(SavedNotificationScopeActions.setIntegration(props.integration));
        return () => {
            dispatch(SavedNotificationScopeActions.unset());
        };
    }, [ dispatch, props.integration ]);

    if (!savedNotificationScope) {
        return <React.Fragment />;
    }

    return <AddNotificationBody
        integration={ savedNotificationScope.integration }
        isLoading={ savedNotificationScope.status === Status.LOADING }
        switchEnabled={ onClick }
    />;
};

export const CreatePage: React.FunctionComponent<CreatePageProps> = props => {

    const saveIntegrationMutation = useSaveIntegrationMutation();
    const [ hasError, setError ] = React.useState(false);

    const onSaveIntegration = React.useCallback((integration: NewUserIntegration) => {
        if (!integration.id) {
            integration.isEnabled = true;
        }

        setError(false);

        return saveIntegrationMutation.mutate(integration).then(response => {
            if (!response.error) {
                const title = props.isEdit ? `${integration.name} saved successfully` : `${integration.name} added successfully`;

                addSuccessNotification(
                    title,
                    <AddNotificationBodyContainer integration={ integration as UserIntegration } />,
                    true
                );

                return true;
            } else {
                setError(true);
                return false;
            }
        });
    }, [ saveIntegrationMutation, props.isEdit ]);

    const error = React.useMemo<ActionModalError | undefined>(() => {
        if (hasError) {
            if (props.isEdit) {
                return {
                    title: 'Integration failed to update',
                    description: <p>There was an error trying to update the Integration. Please try again.</p>
                };
            } else {
                return {
                    title: 'Failed to create Integration',
                    description: <p>There was an error trying to create the Integration. Please try again.</p>
                };
            }
        }

        return undefined;
    }, [ hasError, props.isEdit ]);

    return (
        <IntegrationSaveModal
            initialIntegration={ props.initialIntegration }
            onSave={ onSaveIntegration }
            isEdit={ props.isEdit }
            isSaving={ saveIntegrationMutation.loading }
            onClose={ props.onClose }
            error={ error }
        />
    );
};
