import { Action, Notification } from '../../../types/Notification';
import { assertNever } from '@redhat-cloud-services/insights-common-typescript';
import { useReducer } from 'react';

enum UseFormModalReducerActionType {
    EDIT_NOTIFICATION = 'edit-notification',
    EDIT_DEFAULTS = 'edit-defaults',
    NONE = 'none'
}

interface UseFormModalReducerActionEditNotification {
    type: UseFormModalReducerActionType.EDIT_NOTIFICATION;
    template: Notification;
}

interface UseFormModalReducerActionEditDefault {
    type: UseFormModalReducerActionType.EDIT_DEFAULTS;
    template: Array<Action>;
}

interface UseFormModalReducerActionNone {
    type: UseFormModalReducerActionType.NONE;
}

type UseFormModalReducerAction = UseFormModalReducerActionEditNotification | UseFormModalReducerActionEditDefault | UseFormModalReducerActionNone;

type UseFormModalReducerState = {
    isOpen: false;
} | ({
    isOpen: true;
} & ({
    type: 'default';
    actions: Array<Action>;
} | {
    type: 'notification';
    notification: Notification;
}))

const noneState = {
    isOpen: false as false
};

const reducer = (state: UseFormModalReducerState, action: UseFormModalReducerAction): UseFormModalReducerState => {
    switch (action.type) {
        case UseFormModalReducerActionType.EDIT_DEFAULTS:
            return {
                isOpen: true,
                type: 'default',
                actions: action.template
            };
        case UseFormModalReducerActionType.EDIT_NOTIFICATION:
            return {
                isOpen: true,
                type: 'notification',
                notification: action.template
            };
        case UseFormModalReducerActionType.NONE:
            return noneState;
        default:
            assertNever(action);
    }
};

export const makeEditNotificationAction = (template: Notification): UseFormModalReducerActionEditNotification => ({
    type: UseFormModalReducerActionType.EDIT_NOTIFICATION,
    template
});

export const makeEditDefaultAction = (template: Array<Action>): UseFormModalReducerActionEditDefault => ({
    type: UseFormModalReducerActionType.EDIT_DEFAULTS,
    template
});

export const makeNoneAction = (): UseFormModalReducerActionNone => ({
    type: UseFormModalReducerActionType.NONE
});

export const useFormModalReducer = () => {
    return useReducer(reducer, noneState);
};
