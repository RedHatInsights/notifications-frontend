import * as React from 'react';
import {
  Alert,
  AlertVariant,
} from '@patternfly/react-core/dist/dynamic/components/Alert';
import {
  Button,
  ButtonVariant,
} from '@patternfly/react-core/dist/dynamic/components/Button';
import {
  Modal,
  ModalProps,
  ModalVariant,
} from '@patternfly/react-core/dist/dynamic/deprecated/components/Modal';
import { Spinner } from '@patternfly/react-core/dist/dynamic/components/Spinner';

// Partial all but specified properties
export type SemiPartial<T, K extends keyof T> = Pick<T, K> &
  Partial<Omit<T, K>>;

export interface ActionModalError {
  title: string;
  description: React.ReactNode | string;
}

export interface ActionModalProps
  extends Pick<ModalProps, 'variant' | 'titleIconVariant'> {
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
  actionButtonHidden?: boolean;
  cancelButtonTitle?: string;
  cancelButtonVariant?: ButtonVariant;
}

export const ActionModal: React.FunctionComponent<ActionModalProps> = (
  props
) => {
  const close = React.useCallback(() => {
    const onClose = props.onClose;
    onClose(false);
  }, [props.onClose]);

  const actionCallback = React.useCallback(async () => {
    const onClose = props.onClose;
    const onAction = props.onAction;

    const actionPerformed = await onAction();
    if (actionPerformed) {
      onClose(true);
    }
  }, [props.onAction, props.onClose]);

  const actions = React.useMemo(() => {
    const actionContent: Array<React.ReactNode> = [];
    if (!props.actionButtonHidden) {
      actionContent.push(
        <Button
          ouiaId="action"
          key="action"
          variant={props.actionButtonVariant}
          isDisabled={props.isPerformingAction || props.actionButtonDisabled}
          onClick={actionCallback}
        >
          {props.isPerformingAction ? (
            <Spinner size="md" />
          ) : (
            props.actionButtonTitle
          )}
        </Button>
      );
    }

    actionContent.push(
      <Button
        ouiaId="cancel"
        key="cancel"
        variant={props.cancelButtonVariant ?? ButtonVariant.link}
        isDisabled={props.isPerformingAction}
        onClick={close}
      >
        {props.cancelButtonTitle ?? 'Cancel'}
      </Button>
    );

    return actionContent;
  }, [
    props.actionButtonVariant,
    props.actionButtonTitle,
    props.actionButtonDisabled,
    props.actionButtonHidden,
    props.isPerformingAction,
    props.cancelButtonTitle,
    props.cancelButtonVariant,
    close,
    actionCallback,
  ]);

  return (
    <Modal
      title={props.title}
      isOpen={props.isOpen}
      onClose={close}
      variant={props.variant ?? ModalVariant.small}
      titleIconVariant={props.titleIconVariant}
      actions={actions}
    >
      {props.error && (
        <>
          <Alert
            isInline
            title={props.error.title}
            variant={AlertVariant.danger}
          >
            {props.error.description}
          </Alert>
          <br />
        </>
      )}
      {props.content}
    </Modal>
  );
};

export type DeleteModalProps = Omit<
  SemiPartial<ActionModalProps, InheritedProps>,
  ChangedProps
> & {
  isDeleting: boolean;
  onDelete: () => boolean | Promise<boolean>;
};

export const DeleteModal: React.FunctionComponent<DeleteModalProps> = (
  props
) => {
  return (
    <ActionModal
      {...props}
      actionButtonTitle={props.actionButtonTitle ?? 'Delete'}
      actionButtonVariant={props.actionButtonVariant ?? ButtonVariant.danger}
      titleIconVariant={props.titleIconVariant ?? 'warning'}
      isPerformingAction={props.isDeleting}
      onAction={props.onDelete}
    />
  );
};

type ChangedProps = 'isPerformingAction' | 'onAction';
type InheritedProps =
  | 'isOpen'
  | 'title'
  | 'content'
  | 'onClose'
  | 'error'
  | 'actionButtonDisabled'
  | 'variant'
  | 'titleIconVariant';

export type SaveModalProps = Omit<
  SemiPartial<ActionModalProps, InheritedProps>,
  ChangedProps
> & {
  isSaving: boolean;
  onSave: () => boolean | Promise<boolean>;
};

export const SaveModal: React.FunctionComponent<SaveModalProps> = (props) => {
  return (
    <ActionModal
      {...props}
      isPerformingAction={props.isSaving}
      onAction={props.onSave}
      actionButtonTitle={props.actionButtonTitle ?? 'Save'}
      actionButtonVariant={props.actionButtonVariant ?? ButtonVariant.primary}
    />
  );
};
