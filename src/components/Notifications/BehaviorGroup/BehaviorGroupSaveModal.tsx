import { ModalVariant } from '@patternfly/react-core';
import { SaveModal, SaveModalProps } from '@redhat-cloud-services/insights-common-typescript';
import { Formik, useFormikContext } from 'formik';
import * as React from 'react';

import { BehaviorGroupSchema } from '../../../schemas/Integrations/Notifications';
import { UserIntegrationType } from '../../../types/Integration';
import { BehaviorGroup, DefaultNotificationBehavior, IntegrationRef, Notification } from '../../../types/Notification';
import { EditBehaviorGroupForm } from './BehaviorGroupForm';

type DataFetcher = {
    getRecipients: (search: string) => Promise<Array<string>>;
    getIntegrations: (type: UserIntegrationType, search: string) => Promise<Array<IntegrationRef>>;
}

type UsedProps = 'isOpen' | 'title' | 'content' | 'onSave';
export type BehaviorGroupSaveModalProps = Omit<SaveModalProps, UsedProps> & {
    data?: Partial<BehaviorGroup>;
    onSave: (behaviorGroup: BehaviorGroup) => boolean | Promise<boolean>;
} & DataFetcher;

interface InternalProps extends DataFetcher {
    onClose: (saved: boolean) => void;
    data: BehaviorGroupSaveModalProps['data'];
}

const InternalBehaviorGroupSaveModal: React.FunctionComponent<InternalProps> = props => {
    const title =  `${props.data ? 'Create new' : 'Edit'} behavior group`;

    const { handleSubmit, isValid, isSubmitting } = useFormikContext<Notification | DefaultNotificationBehavior>();

    const onSaveClicked = React.useCallback(() => {
        handleSubmit();
        return false;
    }, [ handleSubmit ]);

    return (
        <SaveModal
            content={ <EditBehaviorGroupForm
                behaviorGroup={ props.data }
                getRecipients={ props.getRecipients }
                getIntegrations={ props.getIntegrations }
            /> }
            isSaving={ isSubmitting }
            onSave={ onSaveClicked }
            isOpen={ true }
            title={ title }
            onClose={ props.onClose }
            variant={ ModalVariant.large }
            actionButtonDisabled={ !isValid }
        />
    );
};

export const BehaviorGroupSaveModal: React.FunctionComponent<BehaviorGroupSaveModalProps> = props => {
    const onSubmit = React.useCallback(async (_data: Partial<BehaviorGroup>) => {
        const onClose = props.onClose;
        onClose(true);
    }, [ props.onClose ]);

    return (
        <Formik<Partial<BehaviorGroup>>
            initialValues={ props.data ?? { } }
            validationSchema={ BehaviorGroupSchema }
            onSubmit={ onSubmit }
            validateOnMount={ true }
        >
            <InternalBehaviorGroupSaveModal
                onClose={ props.onClose }
                data={ props.data }
                getRecipients={ props.getRecipients }
                getIntegrations={ props.getIntegrations }
            />
        </Formik>
    );
};
