import assertNever from 'assert-never';
import produce, { castDraft } from 'immer';
import { Reducer, useCallback, useMemo, useReducer, useState } from 'react';
import { useDebounce } from 'react-use';

export interface ReducerState<T> {
    filterValues: ReadonlyArray<T>;
    defaultValues: ReadonlyArray<T>;
    show: 'default' | 'filter';
    loadingFilter: boolean;
    loadingDefault: boolean;
    lastSearch: string;
}

enum ReducerActionType {
    LOAD_FILTER_VALUE,
    SET_FILTER_VALUE,
    USE_DEFAULTS,
    SET_DEFAULTS
}

type ReducerAction<T> = {
    type: ReducerActionType.USE_DEFAULTS;
} | {
    type: ReducerActionType.LOAD_FILTER_VALUE;
    search: string;
} | {
    type: ReducerActionType.SET_FILTER_VALUE;
    search: string;
    values: ReadonlyArray<T>;
} | {
    type: ReducerActionType.SET_DEFAULTS;
    values: ReadonlyArray<T>;
}

const reducerFunction = <T>(state: ReducerState<T>, action: ReducerAction<T>): ReducerState<T> => {
    return produce(state, draft => {
        switch (action.type) {
            case ReducerActionType.SET_FILTER_VALUE:
                if (action.search === state.lastSearch) {
                    if (action.values !== draft.filterValues) {
                        draft.loadingFilter = false;
                        draft.filterValues = castDraft(action.values);
                    }
                }

                break;
            case ReducerActionType.LOAD_FILTER_VALUE:
                if (action.search !== draft.lastSearch || draft.show !== 'filter') {
                    draft.loadingFilter = true;
                    draft.filterValues = [];
                    draft.lastSearch = action.search;
                    draft.show = 'filter';
                }

                break;
            case ReducerActionType.USE_DEFAULTS:
                if (draft.show !== 'default') {
                    draft.show = 'default';
                }

                break;
            case ReducerActionType.SET_DEFAULTS:
                draft.defaultValues = castDraft(action.values);
                draft.loadingDefault = false;
                break;
            default:
                assertNever(action);
        }
    });
};

export const useTypeaheadReducer = <T>() => {
    const [ state, dispatch ] = useReducer<Reducer<ReducerState<T>, ReducerAction<T>>>(reducerFunction, {
        filterValues: [],
        defaultValues: [],
        show: 'default',
        loadingFilter: false,
        loadingDefault: true,
        lastSearch: ''
    } as ReducerState<T>);

    const [ debouncedState, setDebouncedState ] = useState<ReducerState<T>>(state);

    useDebounce(() => {
        setDebouncedState(state);
    }, 400, [ state ]);

    const setFilterValue = useCallback((search: string, values: ReadonlyArray<T>) => dispatch({
        type: ReducerActionType.SET_FILTER_VALUE,
        values,
        search
    }), [ dispatch ]);

    const loadFilterValue = useCallback((search: string) => dispatch({
        type: ReducerActionType.LOAD_FILTER_VALUE,
        search
    }), [ dispatch ]);

    const setDefaults = useCallback((values: ReadonlyArray<T>) => dispatch({
        type: ReducerActionType.SET_DEFAULTS,
        values
    }), [ dispatch ]);

    const useDefaults = useCallback(() => dispatch({
        type: ReducerActionType.USE_DEFAULTS
    }), [ dispatch ]);

    const dispatchers = useMemo(() => ({
        setFilterValue,
        loadFilterValue,
        setDefaults,
        useDefaults
    }), [ setFilterValue, loadFilterValue, setDefaults, useDefaults ]);

    return [ debouncedState, dispatchers ] as [ typeof state, typeof dispatchers ];
};
