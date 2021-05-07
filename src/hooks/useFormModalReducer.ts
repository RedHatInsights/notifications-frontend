import { assertNever } from 'assert-never';
import { useMemo, useReducer } from 'react';

enum UseFormModalReducerActionType {
    EDIT = 'edit',
    CREATE = 'create',
    NONE = 'none'
}

interface UseFormModalReducerActionCreate<T> {
    type: UseFormModalReducerActionType.CREATE;
    template?: Partial<T>;
}

interface UseFormModalReducerActionEdit<T> {
    type: UseFormModalReducerActionType.EDIT;
    template: T;
}

interface UseFormModalReducerActionNone {
    type: UseFormModalReducerActionType.NONE;
}

type UseFormModalReducerAction<T> = UseFormModalReducerActionCreate<T> | UseFormModalReducerActionEdit<T> | UseFormModalReducerActionNone;

interface UseFormModalReducerState<T> {
    isOpen: boolean;
    isEdit: boolean;
    template: T | Partial<T> | undefined;
    isCopy: boolean;
}

const noneState: UseFormModalReducerState<undefined> = {
    isOpen: false,
    isEdit: false,
    template: undefined,
    isCopy: false
};

type CopyFunction<T> = (from: Partial<T>) => Partial<T>;

const buildReducer = <T>(copyFunction?: CopyFunction<T>) => {
    const reducer = (
        state: UseFormModalReducerState<T>,
        action: UseFormModalReducerAction<T>
    ): UseFormModalReducerState<T> => {
        switch (action.type) {
            case UseFormModalReducerActionType.CREATE:
                return {
                    isOpen: true,
                    isEdit: false,
                    template: action.template ? copyFunction ? copyFunction(action.template) : action.template : undefined,
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

    return reducer;
};

export const makeCreateAction = <T>(template?: Partial<T>): UseFormModalReducerActionCreate<T> => ({
    type: UseFormModalReducerActionType.CREATE,
    template
});

export const makeEditAction = <T>(template: T): UseFormModalReducerActionEdit<T> => ({
    type: UseFormModalReducerActionType.EDIT,
    template
});

export const makeNoneAction = (): UseFormModalReducerActionNone => ({
    type: UseFormModalReducerActionType.NONE
});

export const useFormModalReducer = <T>(copyFunction?: CopyFunction<T>) => {
    const reducer = useMemo(() => {
        return buildReducer(copyFunction);
    }, [ copyFunction ]);

    return useReducer(reducer, noneState);
};
