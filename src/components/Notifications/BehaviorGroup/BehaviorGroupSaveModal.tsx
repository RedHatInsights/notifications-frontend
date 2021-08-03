import { ModalVariant } from '@patternfly/react-core';
import { SaveModal, SaveModalProps } from '@redhat-cloud-services/insights-common-typescript';
import { Formik, useFormikContext } from 'formik';
import * as React from 'react';

import { BehaviorGroupSchema } from '../../../schemas/Integrations/Notifications';
import { BehaviorGroup, DefaultNotificationBehavior, Notification } from '../../../types/Notification';
import { EditBehaviorGroupForm } from './BehaviorGroupForm';

type UsedProps = 'isOpen' | 'title' | 'content' | 'onSave';
export type BehaviorGroupSaveModalProps = Omit<SaveModalProps, UsedProps> & {
    data?: Partial<BehaviorGroup>;
    onSave: (behaviorGroup: BehaviorGroup) => boolean | Promise<boolean>;
};

interface InternalProps {
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
    const onSubmit = React.useCallback(async (data: Partial<BehaviorGroup>) => {
        const onClose = props.onClose;
        const onSave = props.onSave;

        const saved = await onSave(data as BehaviorGroup);

        if (saved) {
            onClose(true);
        }
    }, [ props.onClose, props.onSave ]);

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
            />
        </Formik>
    );
};
