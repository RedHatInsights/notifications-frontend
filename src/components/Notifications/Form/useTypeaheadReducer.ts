import assertNever from 'assert-never';
import { Reducer, useCallback, useMemo, useReducer } from 'react';

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
    switch (action.type) {
        case ReducerActionType.SET_FILTER_VALUE:
            if (action.search === state.lastSearch) {
                if (action.values === state.filterValues) {
                    return state;
                }

                return {
                    ...state,
                    loadingFilter: false,
                    filterValues: action.values
                };
            }

            return state;
        case ReducerActionType.LOAD_FILTER_VALUE:
            if (action.search !== state.lastSearch || state.show !== 'filter') {
                return {
                    ...state,
                    loadingFilter: true,
                    filterValues: [],
                    lastSearch: action.search,
                    show: 'filter'
                };
            }

            return state;
        case ReducerActionType.USE_DEFAULTS:
            if (state.show !== 'default') {
                return {
                    ...state,
                    show: 'default'
                };
            }

            return state;
        case ReducerActionType.SET_DEFAULTS:
            return {
                ...state,
                defaultValues: action.values,
                loadingDefault: false
            };
        default:
            assertNever(action);
    }
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

    return [ state, dispatchers ] as [ typeof state, typeof dispatchers ];
};
