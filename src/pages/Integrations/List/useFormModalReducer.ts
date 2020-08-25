import { useReducer } from 'react';
import { Integration } from '../../../types/Integration';
import { assertNever } from '@redhat-cloud-services/insights-common-typescript';

enum UseFormModalReducerActionType {
    EDIT = 'edit',
    CREATE = 'create',
    NONE = 'none'
}

interface UseFormModalReducerActionCreate {
    type: UseFormModalReducerActionType.CREATE;
    template?: Partial<Integration>;
}

interface UseFormModalReducerActionEdit {
    type: UseFormModalReducerActionType.EDIT;
    template: Integration;
}

interface UseFormModalReducerActionNone {
    type: UseFormModalReducerActionType.NONE;
}

type UseFormModalReducerAction = UseFormModalReducerActionCreate | UseFormModalReducerActionEdit | UseFormModalReducerActionNone;

interface UseFormModalReducerState {
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

const reducer = (state: UseFormModalReducerState, action: UseFormModalReducerAction): UseFormModalReducerState => {
    switch (action.type) {
        case UseFormModalReducerActionType.CREATE:
            return {
                isOpen: true,
                isEdit: false,
                template: action.template ? {
                    ...action.template,
                    name: `Copy of ${action.template.name}`
                } : undefined,
                isCopy: !!action.template
            };
        case UseFormModalReducerActionType.EDIT:
            return {
                isOpen: true,
                isEdit: true,
                template: action.template,
                isCopy: false
            };
        case UseFormModalReducerActionType.NONE:
            return noneState;
        default:
            assertNever(action);
    }
};

export const makeCreateAction = (template?: Partial<Integration>): UseFormModalReducerActionCreate => ({
    type: UseFormModalReducerActionType.CREATE,
    template
});

export const makeEditAction = (template: Integration): UseFormModalReducerActionEdit => ({
    type: UseFormModalReducerActionType.EDIT,
    template
});

export const makeNoneAction = (): UseFormModalReducerActionNone => ({
    type: UseFormModalReducerActionType.NONE
});

export const useFormModalReducer = () => {
    return useReducer(reducer, noneState);
};
