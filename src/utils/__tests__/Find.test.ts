import { findById, findByKey } from '../Find';

describe('src/utils/Find - Find utils', () => {
    it('FindById returns a function that evaluates to true when the id is equal to the param', () => {
        expect(findById('foo')({
            id: 'foo'
        })).toEqual(true);
    });

    it('FindById returns a function that evaluates to false when the id is not equal to the param', () => {
        expect(findById('bar')({
            id: 'foo'
        })).toEqual(false);
    });

    it('FindByKey returns a function that evaluates to true when the key is equal to the param on the key', () => {
        expect(findByKey<{ bar: string, id: string }, 'bar'>('baz', 'bar')({
            id: 'foo',
            bar: 'baz'
        })).toEqual(true);
    });

    it('FindByKey returns a function that evaluates to false when the key is not equal to the param on the key', () => {
        expect(findByKey<{ bar: string, id: string }, 'bar'>('foo', 'bar')({
            id: 'foo',
            bar: 'baz'
        })).toEqual(false);
    });
});
