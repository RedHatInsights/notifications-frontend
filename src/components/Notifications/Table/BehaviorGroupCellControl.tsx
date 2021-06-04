import { Button, ButtonProps, ButtonVariant, Split, SplitItem } from '@patternfly/react-core';
import { CheckIcon, CloseIcon, PencilAltIcon } from '@patternfly/react-icons';
import { global_active_color_100, global_disabled_color_100, global_palette_black_600 } from '@patternfly/react-tokens';
import * as React from 'react';

import { UUID } from '../../../types/Notification';
import { emptyImmutableObject } from '../../../utils/Immutable';

export type OnNotificationIdHandler = (notificationId: UUID) => void;

export interface BehaviorGroupCellControlProps {
    notificationId: UUID;
    isEditMode: boolean;
    onStartEditing: OnNotificationIdHandler;
    onFinishEditing: OnNotificationIdHandler;
    onCancelEditMode: OnNotificationIdHandler;
    isDisabled: boolean;
}

interface ButtonWithNotificationIdProps extends Omit<ButtonProps, 'onClick'> {
    onClick: OnNotificationIdHandler;
    notificationId: UUID;
}

const toOnNotificationSetAdapter = (event: any, onClick: OnNotificationIdHandler) => {
    const dataset = (event.currentTarget as HTMLElement)?.dataset ?? emptyImmutableObject;
    if (dataset.notificationId) {
        onClick(dataset.notificationId);
    }
};

const ButtonWithNotificationId: React.FunctionComponent<ButtonWithNotificationIdProps> = props => {
    const onClick = React.useCallback((event: any) => {
        toOnNotificationSetAdapter(event, props.onClick);
    }, [ props.onClick ]);

    return <Button { ...props } onClick={ onClick } data-notification-id={ props.notificationId }>
        { props.children }
    </Button>;
};

export const BehaviorGroupCellControl: React.FunctionComponent<BehaviorGroupCellControlProps> = props => {

    const commonButtonProps = {
        variant: ButtonVariant.plain,
        notificationId: props.notificationId,
        isDisabled: props.isDisabled
    };

    if (!props.isEditMode) {
        return <ButtonWithNotificationId { ...commonButtonProps } onClick={ props.onStartEditing }>
            <PencilAltIcon />
        </ButtonWithNotificationId>;
    } else {
        return (
            <Split>
                <SplitItem>
                    <ButtonWithNotificationId { ...commonButtonProps } onClick={ props.onFinishEditing }>
                        <CheckIcon color={ props.isDisabled ? global_disabled_color_100.value : global_active_color_100.value } />
                    </ButtonWithNotificationId>
                </SplitItem>
                <SplitItem>
                    <ButtonWithNotificationId { ...commonButtonProps } onClick={ props.onCancelEditMode }>
                        <CloseIcon color={ props.isDisabled ? global_disabled_color_100.value : global_palette_black_600.value } />
                    </ButtonWithNotificationId>
                </SplitItem>
            </Split>
        );
    }
};
