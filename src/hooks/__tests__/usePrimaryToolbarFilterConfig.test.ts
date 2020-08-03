import { act, renderHook } from '@testing-library/react-hooks';
import { useFilters } from '../useFilters';
import { ColumnsMetada, usePrimaryToolbarFilterConfig } from '../usePrimaryToolbarFilterConfig';
import { useEffect } from 'react';

describe('src/hooks/usePrimaryToolbarFilterConfig', () => {

    enum Foo {
        A = 'a',
        B = 'b',
        C = 'c',
        Z = 'x'
    }

    enum Bar {
        Beep = 'beep'
    }

    const metaFoo: ColumnsMetada<typeof Foo> = {
        [Foo.A]: {
            label: 'Foo.A',
            placeholder: 'Im Foo.A'
        },
        [Foo.B]: {
            label: 'Foo.B',
            placeholder: 'Im Foo.B'
        },
        [Foo.C]: {
            label: 'foobarbaz',
            placeholder: 'I find your lack of foo disturbing'
        },
        [Foo.Z]: {
            label: 'Foo.z',
            placeholder: 'Im Foo.Z'
        }
    };

    it('Creates filter config for the enum', () => {
        const { result } = renderHook(() => {
            const { filters, setFilters, clearFilter } = useFilters(Foo);
            return usePrimaryToolbarFilterConfig(
                Foo,
                filters,
                setFilters,
                clearFilter,
                metaFoo
            );
        });

        expect(JSON.stringify(result.current.filterConfig)).toEqual(JSON.stringify({
            items: [
                {
                    label: 'Foo.A',
                    type: 'text',
                    filterValues: {
                        id: `filter-a`,
                        value: '',
                        placeholder: 'Im Foo.A',
                        // eslint-disable-next-line @typescript-eslint/no-empty-function
                        onChange() {}
                    }
                },
                {
                    label: 'Foo.B',
                    type: 'text',
                    filterValues: {
                        id: `filter-b`,
                        value: '',
                        placeholder: 'Im Foo.B',
                        // eslint-disable-next-line @typescript-eslint/no-empty-function
                        onChange() {}
                    }
                },
                {
                    label: 'foobarbaz',
                    type: 'text',
                    filterValues: {
                        id: `filter-c`,
                        value: '',
                        placeholder: 'I find your lack of foo disturbing',
                        // eslint-disable-next-line @typescript-eslint/no-empty-function
                        onChange() {}
                    }
                },
                {
                    label: 'Foo.z',
                    type: 'text',
                    filterValues: {
                        id: `filter-x`,
                        value: '',
                        placeholder: 'Im Foo.Z',
                        // eslint-disable-next-line @typescript-eslint/no-empty-function
                        onChange() {}
                    }
                }
            ]
        }));
    });

    it('Changes in the init enum are ignored', () => {
        const { result, rerender } = renderHook((theEnum) => {
            const { filters, setFilters, clearFilter } = useFilters<typeof Foo>(Foo);
            return usePrimaryToolbarFilterConfig(
                theEnum as any,
                filters,
                setFilters,
                clearFilter,
                metaFoo
            );
        }, { initialProps: Foo as typeof Foo | typeof Bar });

        rerender(Bar);

        expect(JSON.stringify(result.current.filterConfig)).toEqual(JSON.stringify({
            items: [
                {
                    label: 'Foo.A',
                    type: 'text',
                    filterValues: {
                        id: `filter-a`,
                        value: '',
                        placeholder: 'Im Foo.A',
                        // eslint-disable-next-line @typescript-eslint/no-empty-function
                        onChange() {}
                    }
                },
                {
                    label: 'Foo.B',
                    type: 'text',
                    filterValues: {
                        id: `filter-b`,
                        value: '',
                        placeholder: 'Im Foo.B',
                        // eslint-disable-next-line @typescript-eslint/no-empty-function
                        onChange() {}
                    }
                },
                {
                    label: 'foobarbaz',
                    type: 'text',
                    filterValues: {
                        id: `filter-c`,
                        value: '',
                        placeholder: 'I find your lack of foo disturbing',
                        // eslint-disable-next-line @typescript-eslint/no-empty-function
                        onChange() {}
                    }
                },
                {
                    label: 'Foo.z',
                    type: 'text',
                    filterValues: {
                        id: `filter-x`,
                        value: '',
                        placeholder: 'Im Foo.Z',
                        // eslint-disable-next-line @typescript-eslint/no-empty-function
                        onChange() {}
                    }
                }
            ]
        }));
    });

    it('FilterConfig onChange calls the setter', () => {
        const { result } = renderHook(() => {
            const { filters, setFilters, clearFilter } = useFilters(Foo);

            useEffect(() => {
                setFilters[Foo.B]('hello world');
            }, [ setFilters ]);

            return usePrimaryToolbarFilterConfig(
                Foo,
                filters,
                setFilters,
                clearFilter,
                metaFoo
            );
        });

        expect(JSON.stringify(result.current.filterConfig)).toEqual(JSON.stringify({
            items: [
                {
                    label: 'Foo.A',
                    type: 'text',
                    filterValues: {
                        id: `filter-a`,
                        value: '',
                        placeholder: 'Im Foo.A',
                        // eslint-disable-next-line @typescript-eslint/no-empty-function
                        onChange() {}
                    }
                },
                {
                    label: 'Foo.B',
                    type: 'text',
                    filterValues: {
                        id: `filter-b`,
                        value: 'hello world',
                        placeholder: 'Im Foo.B',
                        // eslint-disable-next-line @typescript-eslint/no-empty-function
                        onChange() {}
                    }
                },
                {
                    label: 'foobarbaz',
                    type: 'text',
                    filterValues: {
                        id: `filter-c`,
                        value: '',
                        placeholder: 'I find your lack of foo disturbing',
                        // eslint-disable-next-line @typescript-eslint/no-empty-function
                        onChange() {}
                    }
                },
                {
                    label: 'Foo.z',
                    type: 'text',
                    filterValues: {
                        id: `filter-x`,
                        value: '',
                        placeholder: 'Im Foo.Z',
                        // eslint-disable-next-line @typescript-eslint/no-empty-function
                        onChange() {}
                    }
                }
            ]
        }));
    });

    it('Active filter config for the enum is empty if values are empty strings', () => {
        const { result } = renderHook(() => {
            const { filters, setFilters, clearFilter } = useFilters(Foo);
            return usePrimaryToolbarFilterConfig(
                Foo,
                filters,
                setFilters,
                clearFilter,
                metaFoo
            );
        });

        expect(result.current.activeFiltersConfig.filters).toEqual([]);
    });

    it('Active filter config contains data for non empty strings', () => {
        const { result } = renderHook(() => {
            const { filters, setFilters, clearFilter } = useFilters(Foo);
            useEffect(() => {
                setFilters[Foo.A]('foo');
                setFilters[Foo.B]('bar');
            }, [ setFilters ]);
            return usePrimaryToolbarFilterConfig(
                Foo,
                filters,
                setFilters,
                clearFilter,
                metaFoo
            );
        });

        expect(result.current.activeFiltersConfig.filters).toEqual([
            {
                category: 'Foo.A',
                chips: [
                    {
                        name: 'foo',
                        isRead: true
                    }
                ]
            },
            {
                category: 'Foo.B',
                chips: [
                    {
                        name: 'bar',
                        isRead: true
                    }
                ]
            }
        ]);
    });

    it('Active filter config onDelete clears config data', () => {
        const { result } = renderHook(() => {
            const { filters, setFilters, clearFilter } = useFilters(Foo);
            useEffect(() => {
                setFilters[Foo.A]('foo');
                setFilters[Foo.B]('bar');
            }, [ setFilters ]);
            return usePrimaryToolbarFilterConfig(
                Foo,
                filters,
                setFilters,
                clearFilter,
                metaFoo
            );
        });

        act(() => {
            result.current.activeFiltersConfig.onDelete(
                undefined,
                [
                    { category: 'Foo.A' }
                ]);
        });

        expect(result.current.activeFiltersConfig.filters).toEqual([
            {
                category: 'Foo.B',
                chips: [
                    {
                        name: 'bar',
                        isRead: true
                    }
                ]
            }
        ]);
    });

});
