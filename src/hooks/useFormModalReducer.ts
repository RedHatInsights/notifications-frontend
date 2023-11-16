import { assertNever } from 'assert-never';
import { useMemo, useReducer } from 'react';

enum UseFormModalReducerActionType {
    EDIT = 'edit',
    TEST = 'test',
    CREATE = 'create',
    RESET = 'reset'
}

interface UseFormModalReducerActionCreate<T> {
  type: UseFormModalReducerActionType.CREATE;
  template?: Partial<T>;
}

interface UseFormModalReducerActionEdit<T> {
  type: UseFormModalReducerActionType.EDIT;
  template: T;
}

interface UseFormModalReducerActionTest<T> {
    type: UseFormModalReducerActionType.TEST;
    template: T;
}

interface UseFormModalReducerActionReset {
  type: UseFormModalReducerActionType.RESET;
}

type UseFormModalReducerAction<T> =
  UseFormModalReducerActionCreate<T> | UseFormModalReducerActionTest<T> | UseFormModalReducerActionEdit<T> | UseFormModalReducerActionReset;

type ReducerAction<T> = {
    create: (template?: Partial<T>) => void;
    test: (template: T) => void;
    edit: (template: T) => void;
    reset: () => void;
};

interface UseFormModalReducerState<T> {
  isOpen: boolean;
  isEdit: boolean;
  isTest: boolean;
  template: T | Partial<T> | undefined;
  isCopy: boolean;
}

const initialState: UseFormModalReducerState<undefined> = {
  isOpen: false,
  isEdit: false,
  isTest: false,
  template: undefined,
  isCopy: false,
};

type CopyFunction<T> = (from: Partial<T>) => Partial<T>;

const buildReducer = <T>(copyFunction?: CopyFunction<T>) => {
    const reducer = (
        state: UseFormModalReducerState<T>,
        action: UseFormModalReducerAction<T>
    ): UseFormModalReducerState<T> => {
        console.log('Understanding Current State: ', state);
        console.log('Understanding Action: ', action);
        switch (action.type) {
            case UseFormModalReducerActionType.CREATE:
                return {
                    isOpen: true,
                    isEdit: false,
                    isTest: false,
                    template: action.template ? copyFunction ? copyFunction(action.template) : action.template : undefined,
                    isCopy: !!action.template
                };
            case UseFormModalReducerActionType.TEST:
                return {
                    isOpen: true,
                    isEdit: false,
                    isTest: true,
                    template: action.template,
                    isCopy: false
                };
            case UseFormModalReducerActionType.EDIT:
                return {
                    isOpen: true,
                    isEdit: true,
                    isTest: false,
                    template: action.template,
                    isCopy: false
                };
            case UseFormModalReducerActionType.RESET:
                return initialState;
            default:
                assertNever(action);
        }
    };

  return reducer;
};

const makeCreateAction = <T>(
  template?: Partial<T>
): UseFormModalReducerActionCreate<T> => ({
  type: UseFormModalReducerActionType.CREATE,
  template,
});

const makeEditAction = <T>(template: T): UseFormModalReducerActionEdit<T> => ({
  type: UseFormModalReducerActionType.EDIT,
  template,
});

const makeTestAction = <T>(template: T): UseFormModalReducerActionTest<T> => ({
    type: UseFormModalReducerActionType.TEST,
    template
});

const makeResetAction = (): UseFormModalReducerActionReset => ({
  type: UseFormModalReducerActionType.RESET,
});

export const useFormModalReducer = <T>(
  copyFunction?: CopyFunction<T>
): [UseFormModalReducerState<T>, ReducerAction<T>] => {
  const reducer = useMemo(() => {
    return buildReducer(copyFunction);
  }, [copyFunction]);

  const [state, dispatch] = useReducer(reducer, initialState);

    const actions = useMemo<ReducerAction<T>>(() => ({
        create: (data?: Partial<T>) => dispatch(makeCreateAction(data)),
        test: (data: T) => dispatch(makeTestAction(data)),
        edit: (data: T) => dispatch(makeEditAction(data)),
        reset: () => dispatch(makeResetAction())
    }), [ dispatch ]);

  return [state, actions];
};
