import { useReducer } from 'react';
import { Integration } from '../../../types/Integration';
import { assertNever } from '@redhat-cloud-services/insights-common-typescript';

enum UseDeleteModalReducerActionType {
    DELETE = 'delete',
    NONE = 'none'
}

interface UseDeleteModalActionDelete {
    type: UseDeleteModalReducerActionType.DELETE;
    integration: Integration;
}

interface UseDeleteModalActionNone {
    type: UseDeleteModalReducerActionType.NONE;
}

type UseDeleteModalReducerAction = UseDeleteModalActionDelete | UseDeleteModalActionNone;

interface UseDeleteModalReducerState {
    isOpen: boolean;
    integration: Integration | undefined;
}

const noneState: UseDeleteModalReducerState = {
    isOpen: false,
    integration: undefined
};

const reducer = (state: UseDeleteModalReducerState, action: UseDeleteModalReducerAction): UseDeleteModalReducerState => {
    switch (action.type) {
        case UseDeleteModalReducerActionType.DELETE:
            return {
                isOpen: true,
                integration: action.integration
            };
        case UseDeleteModalReducerActionType.NONE:
            return noneState;
        default:
            assertNever(action);

    }
};

export const useDeleteModalReducer = () => {
    return useReducer(reducer, noneState);
};

useDeleteModalReducer.makeNoneAction = (): UseDeleteModalActionNone => ({
    type: UseDeleteModalReducerActionType.NONE
});

useDeleteModalReducer.makeDeleteAction = (integration: Integration): UseDeleteModalActionDelete => ({
    type: UseDeleteModalReducerActionType.DELETE,
    integration
});
