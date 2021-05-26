import { diff, intersect } from '../Arrays';

describe('src/utils/Array', () => {
    it('intersect', () => {
        expect(intersect([ 1, 2, 3, 4, 5 ], [ 4, 5, 6, 7, 8 ])).toEqual([ 4, 5 ]);
    });

    it('diff', () => {
        expect(diff(
            [ 1, 2, 3, 4, 5, 6 ],
            [ 1, 3, 5, 8, 9 ]
        )).toEqual(
            [ 2, 4, 6 ]
        );
    });
});
