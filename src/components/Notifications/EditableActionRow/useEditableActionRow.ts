import { useField, useFormikContext } from 'formik';
import * as React from 'react';

import { DefaultNotificationBehavior } from '../../../types/Notification';
import { ActionOption } from '../Form/ActionOption';
import { RecipientOption } from '../Form/RecipientOption';

export const useEditableActionRow = (path: string) => {

    const { setFieldValue } = useFormikContext<Notification | DefaultNotificationBehavior>();
    const [
        recipientFieldProps,
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        _,
        recipientFieldHelpers
    ] = useField<Array<string> | undefined>(`${path}.recipient`);

    const actionSelected = React.useCallback((value: ActionOption) => {
        setFieldValue(`${path}.type`, value.notificationType);
        if (value.integrationType) {
            setFieldValue(`${path}.integration`, {
                type: value.integrationType
            });
            setFieldValue(`${path}.recipient`, []);
            setFieldValue(`${path}.integrationId`, '');
        } else {
            setFieldValue(`${path}.recipient`, []);
            setFieldValue(`${path}.integration`, undefined);
            setFieldValue(`${path}.integrationId`, '');
        }
    }, [ setFieldValue, path ]);

    const integrationSelected = React.useCallback((value: RecipientOption) => {
        if (typeof value.recipientOrIntegration !== 'string') {
            setFieldValue(`${path}.integration`, value.recipientOrIntegration);
            setFieldValue(`${path}.integrationId`, value.recipientOrIntegration.id);
        }
    }, [ setFieldValue, path ]);

    const recipientSelected = React.useCallback((value: RecipientOption) => {
        if (recipientFieldProps.value) {
            const selected = recipientFieldProps.value;
            const index = selected.indexOf(value.toString());
            if (index === -1) {
                recipientFieldHelpers.setValue([ ...selected, value.toString() ]);
            } else {
                recipientFieldHelpers.setValue([ ...selected ].filter((_, i) => i !== index));
            }
        }
    }, [ recipientFieldProps, recipientFieldHelpers ]);

    const recipientOnClear = React.useCallback(() => {
        recipientFieldHelpers.setValue([]);
    }, [ recipientFieldHelpers ]);

    return {
        actionSelected,
        integrationSelected,
        recipientSelected,
        recipientOnClear
    };
};
