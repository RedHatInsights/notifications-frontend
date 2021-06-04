import { assertNever } from 'assert-never';
import { useMemo, useReducer } from 'react';

enum UseDeleteModalReducerActionType {
    DELETE = 'delete',
    RESET = 'reset'
}

interface UseDeleteModalActionDelete<T> {
    type: UseDeleteModalReducerActionType.DELETE;
    data: T;
}

interface UseDeleteModalActionReset {
    type: UseDeleteModalReducerActionType.RESET;
}

type UseDeleteModalReducerAction<T> = UseDeleteModalActionDelete<T> | UseDeleteModalActionReset;

type UseDeleteModalReducerState<T> = {
    isOpen: false;
    data: undefined;
} | {
    isOpen: true;
    data: T;
}

const initialState: UseDeleteModalReducerState<undefined> = {
    isOpen: false,
    data: undefined
};

type ReducerFunction<T> = (state: UseDeleteModalReducerState<T>, action: UseDeleteModalReducerAction<T>) => UseDeleteModalReducerState<T>;
type ReducerActions<T> = {
    delete: (data: T) => void;
    reset: () => void;
}

const reducer = <T>(
    state: UseDeleteModalReducerState<T>,
    action: UseDeleteModalReducerAction<T>
): UseDeleteModalReducerState<T> => {
    switch (action.type) {
        case UseDeleteModalReducerActionType.DELETE:
            return {
                isOpen: true,
                data: action.data
            };
        case UseDeleteModalReducerActionType.RESET:
            return initialState;
        default:
            assertNever(action);

    }
};

const makeDeleteAction = <T>(data: T): UseDeleteModalActionDelete<T> => ({
    type: UseDeleteModalReducerActionType.DELETE,
    data
});

const makeResetAction = (): UseDeleteModalActionReset => ({
    type: UseDeleteModalReducerActionType.RESET
});

export const useDeleteModalReducer = <T>(): [ UseDeleteModalReducerState<T>, ReducerActions<T> ] => {
    const [ state, dispatch ] = useReducer<ReducerFunction<T>>(reducer, initialState);

    const actions = useMemo<ReducerActions<T>>(() => ({
        delete: data => dispatch(makeDeleteAction(data)),
        reset: () => dispatch(makeResetAction())
    }), [ dispatch ]);

    return [ state, actions ];
};
