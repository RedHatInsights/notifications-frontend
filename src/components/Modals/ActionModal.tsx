import * as React from 'react';
import {
    Alert,
    AlertVariant,
    Button,
    ButtonVariant,
    Modal,
    ModalProps,
    ModalVariant,
    Spinner
} from '@patternfly/react-core';

export interface ActionModalError {
    title: string;
    description: React.ReactNode | string;
}

export interface ActionModalProps extends Pick<ModalProps, 'variant'> {
    isOpen: boolean;
    isPerformingAction: boolean;
    title: string;
    content: React.ReactNode | string;
    error?: ActionModalError;
    onClose: (actionPerformed: boolean) => void;
    onAction: () => boolean | Promise<boolean>;
    actionButtonTitle: string;
    actionButtonVariant: ButtonVariant;
    actionButtonDisabled?: boolean;
    cancelButtonTitle?: string;
}

export const ActionModal: React.FunctionComponent<ActionModalProps> = (props) => {

    const close = React.useCallback(() => {
        const onClose = props.onClose;
        onClose(false);
    }, [ props.onClose ]);

    const actionCallback = React.useCallback(async () => {
        const onClose = props.onClose;
        const onAction = props.onAction;

        const actionPerformed = await onAction();
        if (actionPerformed) {
            onClose(true);
        }
    }, [ props.onAction, props.onClose ]);

    return (
        <Modal
            title={ props.title }
            isOpen={ props.isOpen }
            onClose={ close }
            variant={ props.variant ?? ModalVariant.small }
            actions={ [
                <Button
                    ouiaId="action"
                    key="action"
                    variant={ props.actionButtonVariant }
                    isDisabled={ props.isPerformingAction || props.actionButtonDisabled }
                    onClick={ actionCallback }
                >
                    { props.isPerformingAction ? <Spinner size="md"/> : props.actionButtonTitle }
                </Button>,
                <Button
                    ouiaId="cancel"
                    key="cancel"
                    variant={ ButtonVariant.plain }
                    isDisabled={ props.isPerformingAction }
                    onClick={ close }
                >
                    { props.cancelButtonTitle ?? 'Cancel' }
                </Button>
            ] }
        >
            { props.error && (
                <>
                    <Alert
                        isInline
                        title={ props.error.title }
                        variant={ AlertVariant.danger }
                    >
                        <p>{ props.error.description }</p>
                    </Alert>
                    <br/>
                </>
            ) }
            { props.content }
        </Modal>
    );
};
