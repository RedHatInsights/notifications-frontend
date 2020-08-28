import * as React from 'react';
import { ActionModal, ActionModalProps } from './ActionModal';
import { ButtonVariant } from '@patternfly/react-core';

type InheritedProps = 'isOpen' | 'title' | 'content'  | 'onClose' | 'error' | 'actionButtonDisabled';

export interface SaveModalProps extends Pick<ActionModalProps, InheritedProps> {
    isSaving: boolean;
    onSave: () => boolean | Promise<boolean>;
    actionButtonTitle?: string;
}

export const SaveModal: React.FunctionComponent<SaveModalProps> = (props) => {
    return <ActionModal
        isOpen={ props.isOpen }
        isPerformingAction={ props.isSaving }
        title={ props.title }
        content={ props.content }
        onClose={ props.onClose }
        onAction={ props.onSave }
        actionButtonTitle={ props.actionButtonTitle ?? 'Save' }
        actionButtonVariant={ ButtonVariant.primary }
        error={ props.error }
        actionButtonDisabled={ props.actionButtonDisabled }
    />;
};
