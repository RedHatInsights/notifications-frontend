import * as React from 'react';
import { Alert, AlertVariant, Button, ButtonVariant, Modal, ModalVariant, Spinner } from '@patternfly/react-core';

export interface DeleteModalError {
    title: string;
    description: React.ReactNode | string;
}

export interface DeleteModalProps {
    isOpen: boolean;
    isDeleting: boolean;
    title: string;
    content: React.ReactNode | string;
    error?: DeleteModalError;
    onClose: (deleted: boolean) => void;
    onDelete: () => boolean | Promise<boolean>;
}

export const DeleteModal: React.FunctionComponent<DeleteModalProps> = (props) => {

    const close = React.useCallback(() => {
        const onClose = props.onClose;
        onClose(false);
    }, [ props.onClose ]);

    const deleteCallback = React.useCallback(async () => {
        const onClose = props.onClose;
        const onDelete = props.onDelete;

        const deleted = await onDelete();
        if (deleted) {
            onClose(true);
        }
    }, [ props.onDelete, props.onClose ]);

    return (
        <Modal
            title={ props.title }
            isOpen={ props.isOpen }
            onClose={ close }
            variant={ ModalVariant.small }
            actions={ [
                <Button
                    ouiaId="submit"
                    key="submit"
                    variant={ ButtonVariant.danger }
                    isDisabled={ props.isDeleting }
                    onClick={ deleteCallback }
                >
                    { props.isDeleting ? <Spinner size="md"/> : 'Delete' }
                </Button>,
                <Button
                    ouiaId="cancel"
                    key="cancel"
                    variant={ ButtonVariant.plain }
                    isDisabled={ props.isDeleting }
                    onClick={ close }
                >
                    Cancel
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
