import { renderHook, act } from '@testing-library/react-hooks';
import { useFilters } from '../useFilters';
import { useState } from 'react';

describe('src/hooks/useFilter', () => {

    enum Foo {
        A = 'A',
        B = 'b',
        c = 'y'
    }

    enum Bar {
        Z = 'foo'
    }

    it ('Returns filters for the enum', () => {
        const { result } = renderHook((Enum) => useFilters(Enum), {
            initialProps: Foo
        });
        expect(result.current.filters).toEqual({
            A: '',
            b: '',
            y: ''
        });
        expect(result.current.filters).toEqual({
            [Foo.A]: '',
            [Foo.B]: '',
            [Foo.c]: ''
        });
    });

    it ('Returns setFilters for the enum', () => {
        const { result } = renderHook((Enum) => useFilters(Enum), {
            initialProps: Foo
        });
        expect(result.current.setFilters.A).toBeInstanceOf(Function);
        expect(result.current.setFilters.b).toBeInstanceOf(Function);
        expect(result.current.setFilters.y).toBeInstanceOf(Function);

        expect(result.current.setFilters[Foo.A]).toBeInstanceOf(Function);
        expect(result.current.setFilters[Foo.B]).toBeInstanceOf(Function);
        expect(result.current.setFilters[Foo.c]).toBeInstanceOf(Function);

        expect(Object.keys(result.current.setFilters)).toEqual([
            'A', 'b', 'y'
        ]);
    });

    it ('Returns debouncedFilters for the enum', () => {
        const { result } = renderHook((Enum) => useFilters(Enum), {
            initialProps: Foo
        });
        expect(result.current.debouncedFilters).toEqual({
            A: '',
            b: '',
            y: ''
        });
        expect(result.current.debouncedFilters).toEqual({
            [Foo.A]: '',
            [Foo.B]: '',
            [Foo.c]: ''
        });
    });

    it ('Returns clearFilter', () => {
        const { result } = renderHook((Enum) => useFilters(Enum), {
            initialProps: Foo
        });
        expect(result.current.clearFilter).toBeInstanceOf(Function);
    });

    it ('clearFilter clears filters', () => {
        const { result } = renderHook((Enum) => useFilters(Enum), {
            initialProps: Foo
        });
        act(() => {
            result.current.setFilters.b('im b');
        });
        expect(result.current.filters.b).toEqual('im b');
        act(() => {
            result.current.clearFilter([ Foo.B ]);
        });
        expect(result.current.filters.b).toEqual('');
    });

    it ('clearFilter throws error when sending an unknown column', () => {
        const { result } = renderHook((Enum) => useFilters(Enum), {
            initialProps: Foo
        });

        act(() => {
            expect(() => result.current.clearFilter([ 'moo' as Foo ])).toThrowError('Unexpected column moo');
        });
    });

    it ('Should continue to work when rerendering', () => {
        const { rerender, result } = renderHook((Enum) => useFilters(Enum), {
            initialProps: Foo
        });

        rerender(Foo);

        expect(result.current.debouncedFilters).toEqual({
            A: '',
            b: '',
            y: ''
        });
        expect(result.current.debouncedFilters).toEqual({
            [Foo.A]: '',
            [Foo.B]: '',
            [Foo.c]: ''
        });
    });

    it ('Filters does not change when rerendering', () => {
        const { rerender, result } = renderHook((Enum) => useFilters(Enum), {
            initialProps: Foo
        });

        const prev = result.current.filters;
        rerender(Foo);
        expect(prev).toBe(result.current.filters);
    });

    it ('SetFilters does not change when rerendering', () => {
        const { rerender, result } = renderHook((Enum) => useFilters(Enum), {
            initialProps: Foo
        });

        const prev = result.current.setFilters;
        rerender(Foo);
        expect(prev).toBe(result.current.setFilters);
    });

    it ('DebouncedFilters does not change when rerendering', () => {
        const { rerender, result } = renderHook((Enum) => useFilters(Enum), {
            initialProps: Foo
        });

        const prev = result.current.debouncedFilters;
        rerender(Foo);
        expect(prev).toBe(result.current.debouncedFilters);
    });

    it ('filter changes when calling a setter', () => {
        const { result } = renderHook((Enum) => useFilters(Enum), {
            initialProps: Foo
        });

        const prev = result.current.filters;
        act(() => {
            // eslint-disable-next-line new-cap
            result.current.setFilters.A('foobar');
        });
        expect(prev).not.toBe(result.current.filters);
        expect(result.current.filters.A).toEqual('foobar');
    });

    it ('debouncedFilter changes when calling a setter after the debounce delay', () => {
        jest.useFakeTimers();
        const { result } = renderHook((Enum) => useFilters(Enum, 500), {
            initialProps: Foo
        });

        const prev = result.current.debouncedFilters;
        act(() => {
            // eslint-disable-next-line new-cap
            result.current.setFilters.A('foobar');
        });
        expect(result.current.debouncedFilters.A).toBe('');
        expect(prev).toBe(result.current.debouncedFilters);

        act(() => {
            jest.advanceTimersByTime(300);
        });
        expect(result.current.debouncedFilters.A).toBe('');
        expect(prev).toBe(result.current.debouncedFilters);

        act(() => {
            jest.advanceTimersByTime(300);
        });
        expect(result.current.debouncedFilters.A).toBe('foobar');
        expect(prev).not.toBe(result.current.debouncedFilters);
    });

    it('Allows a custom state for each element', () => {
        const useStateFactory = (column: Foo) => {
            // Initial value is the name of the column
            const useStateElement = () => useState<string>(column.toString());

            return useStateElement;
        };

        const { result } = renderHook((Enum) => useFilters(Enum, 250, useStateFactory), {
            initialProps: Foo
        });
        expect(result.current.filters).toEqual({
            A: 'A',
            b: 'b',
            y: 'y'
        });
        expect(result.current.filters).toEqual({
            [Foo.A]: 'A',
            [Foo.B]: 'b',
            [Foo.c]: 'y'
        });
    });

    it('Ignores changes on initEnum param', () => {

        type MixedEnum = typeof Foo | typeof Bar;
        const { rerender, result } = renderHook((Enum) => useFilters(Enum), {
            initialProps: Foo as MixedEnum
        });

        expect(result.current.filters).toEqual({
            A: '',
            b: '',
            y: ''
        });
        expect(result.current.filters).toEqual({
            [Foo.A]: '',
            [Foo.B]: '',
            [Foo.c]: ''
        });

        expect(Object.keys(result.current.setFilters)).toEqual([
            'A', 'b', 'y'
        ]);

        rerender(Bar);

        expect(result.current.filters).toEqual({
            A: '',
            b: '',
            y: ''
        });
        expect(result.current.filters).toEqual({
            [Foo.A]: '',
            [Foo.B]: '',
            [Foo.c]: ''
        });

        expect(Object.keys(result.current.setFilters)).toEqual([
            'A', 'b', 'y'
        ]);
    });
});
