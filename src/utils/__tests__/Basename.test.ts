import { getBaseName, getSubApp } from '../Basename';

describe('src/utils/Basename', () => {
    it('gets the first url param', () => {
        expect(getBaseName('/foo/bar/baz')).toEqual('/foo');
    });

    it('If first is beta, also get the next', () => {
        expect(getBaseName('/preview/foo/bar/baz')).toEqual('/preview/foo');
    });

    it('gets the subapp', () => {
        expect(getSubApp('/foo/bar/baz')).toEqual('foo');
    });

    it('Considers beta in path', () => {
        expect(getSubApp('/preview/foo/bar/baz')).toEqual('foo');
    });
});
