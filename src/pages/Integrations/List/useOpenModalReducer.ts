import { useReducer } from 'react';
import { Integration } from '../../../types/Integration';
import { assertNever } from '@redhat-cloud-services/insights-common-typescript';

enum UseOpenModalReducerActionType {
    EDIT = 'edit',
    CREATE = 'create',
    NONE = 'none'
}

interface UseOpenModalReducerActionCreate {
    type: UseOpenModalReducerActionType.CREATE;
    template?: Partial<Integration>;
}

interface UseOpenModalReducerActionEdit {
    type: UseOpenModalReducerActionType.EDIT;
    template: Integration;
}

interface UseOpenModalReducerActionNone {
    type: UseOpenModalReducerActionType.NONE;
}

type UseOpenModalReducerAction = UseOpenModalReducerActionCreate | UseOpenModalReducerActionEdit | UseOpenModalReducerActionNone;

interface UseOpenModalReducerState {
    isOpen: boolean;
    isEdit: boolean;
    template: Integration | Partial<Integration> | undefined;
    isCopy: boolean;
}

const noneState = {
    isOpen: false,
    isEdit: false,
    template: undefined,
    isCopy: false
};

const reducer = (state: UseOpenModalReducerState, action: UseOpenModalReducerAction): UseOpenModalReducerState => {
    switch (action.type) {
        case UseOpenModalReducerActionType.CREATE:
            return {
                isOpen: true,
                isEdit: false,
                template: action.template,
                isCopy: !!action.template
            };
        case UseOpenModalReducerActionType.EDIT:
            return {
                isOpen: true,
                isEdit: true,
                template: action.template,
                isCopy: false
            };
        case UseOpenModalReducerActionType.NONE:
            return noneState;
        default:
            assertNever(action);
    }
};

export const makeCreateAction = (template?: Partial<Integration>): UseOpenModalReducerActionCreate => ({
    type: UseOpenModalReducerActionType.CREATE,
    template
});

export const makeEditAction = (template: Integration): UseOpenModalReducerActionEdit => ({
    type: UseOpenModalReducerActionType.EDIT,
    template
});

export const makeNoneAction = (): UseOpenModalReducerActionNone => ({
    type: UseOpenModalReducerActionType.NONE
});

export const useOpenModalReducer = () => {
    return useReducer(reducer, noneState);
};
