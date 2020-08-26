import * as React from 'react';
import { ouiaSelectors, ouiaSelectorsFor } from '../OuiaSelectors';
import { render } from '@testing-library/react';

describe('src/utils/OuiaSelector', () => {

    describe('ouiaSelectors.getOuiaElement', () => {
        it('Returns undefined if nothing is found', () => {
            render(<></>);
            expect(ouiaSelectors.getOuiaElement('foobar')).toBeUndefined();
        });

        it('Throws error when more than one match found', () => {
            render(
                <div>
                    <div data-ouia-component-type="my-component" data-ouia-component-id="c1">
                        <div data-ouia-component-type="foobar"/>
                    </div>
                    <div data-ouia-component-type="my-component" data-ouia-component-id="c2">
                        <div data-ouia-component-type="foobar"/>
                    </div>
                </div>
            );
            expect(() => ouiaSelectors.getOuiaElement('foobar')).toThrowError();
        });

        it('Returns found element by component type', () => {
            render(
                <div>
                    <div data-ouia-component-type="foobar" id="me"/>
                    <div data-ouia-component-type="foobar-2"/>
                    <div data-ouia-component-type="foobar-3"/>
                </div>
            );
            expect(ouiaSelectors.getOuiaElement('foobar')).toHaveAttribute('id', 'me');
        });

        it('Throws error when more than one match found when using the component-id', () => {
            render(
                <div>
                    <div data-ouia-component-type="my-component" data-ouia-component-id="c1">
                        <div data-ouia-component-type="foobar" data-ouia-component-id="baz"/>
                        <div data-ouia-component-type="foobar"/>
                    </div>
                    <div data-ouia-component-type="my-component" data-ouia-component-id="c2">
                        <div data-ouia-component-type="foobar"/>
                        <div data-ouia-component-type="foobar" data-ouia-component-id="baz"/>
                    </div>
                </div>
            );
            expect(() => ouiaSelectors.getOuiaElement('foobar', 'baz')).toThrowError();
        });

        it('Returns found element by component type and component id', () => {
            render(
                <div>
                    <div data-ouia-component-type="my-component" data-ouia-component-id="c1">
                        <div data-ouia-component-type="foobar" data-ouia-component-id="baz" id="me"/>
                        <div data-ouia-component-type="foobar-2" data-ouia-component-id="baz"/>
                    </div>
                    <div data-ouia-component-type="my-component" data-ouia-component-id="c2">
                        <div data-ouia-component-type="foobar" data-ouia-component-id="beef"/>
                        <div data-ouia-component-type="foobar-2" data-ouia-component-id="baz"/>
                    </div>
                    <div data-ouia-component-type="foobar"/>
                </div>
            );
            expect(ouiaSelectors.getOuiaElement('foobar', 'baz')).toHaveAttribute('id', 'me');
        });

        it('Allows chaining calls', () => {
            render(
                <div>
                    <div data-ouia-component-type="my-component" data-ouia-component-id="c1">
                        <div data-ouia-component-type="foobar" data-ouia-component-id="baz" id="me"/>
                        <div data-ouia-component-type="foobar-2" data-ouia-component-id="baz"/>
                    </div>
                    <div data-ouia-component-type="my-component" data-ouia-component-id="c2">
                        <div data-ouia-component-type="foobar" data-ouia-component-id="beef"/>
                        <div data-ouia-component-type="foobar-2" data-ouia-component-id="baz"/>
                    </div>
                    <div data-ouia-component-type="foobar"/>
                </div>
            );
            const result = ouiaSelectors
            .getOuiaElement('my-component', 'c1')!
            .getOuiaElement('foobar');

            expect(result).toHaveAttribute('id', 'me');
        });
    });

    describe('ouiaSelectors.getOuiaElements', () => {
        it('Returns 0 elements if nothing is found', () => {
            render(<></>);
            expect(ouiaSelectors.getOuiaElements('foobar')).toHaveLength(0);
        });

        it('Return multiple matches', () => {
            render(
                <div>
                    <div data-ouia-component-type="my-component" data-ouia-component-id="c1">
                        <div data-ouia-component-type="foobar"/>
                    </div>
                    <div data-ouia-component-type="my-component" data-ouia-component-id="c2">
                        <div data-ouia-component-type="foobar"/>
                    </div>
                </div>
            );
            expect(ouiaSelectors.getOuiaElements('foobar')).toHaveLength(2);
        });

        it('Returns only element found by type', () => {
            render(
                <div>
                    <div data-ouia-component-type="foobar" id="me"/>
                    <div data-ouia-component-type="foobar-2"/>
                    <div data-ouia-component-type="foobar-3"/>
                </div>
            );
            const result = ouiaSelectors.getOuiaElements('foobar');
            expect(result).toHaveLength(1);
            expect(result[0]).toHaveAttribute('id', 'me');
        });

        it('Return multiple elements with the same id', () => {
            render(
                <div>
                    <div data-ouia-component-type="my-component" data-ouia-component-id="c1">
                        <div data-ouia-component-type="foobar" data-ouia-component-id="baz"/>
                        <div data-ouia-component-type="foobar"/>
                    </div>
                    <div data-ouia-component-type="my-component" data-ouia-component-id="c2">
                        <div data-ouia-component-type="foobar"/>
                        <div data-ouia-component-type="foobar" data-ouia-component-id="baz"/>
                    </div>
                </div>
            );

            const result = ouiaSelectors.getOuiaElements('foobar', 'baz');
            expect(result).toHaveLength(2);
        });

        it('Returns found element by component type and component id', () => {
            render(
                <div>
                    <div data-ouia-component-type="my-component" data-ouia-component-id="c1">
                        <div data-ouia-component-type="foobar" data-ouia-component-id="baz" id="me"/>
                        <div data-ouia-component-type="foobar-2" data-ouia-component-id="baz"/>
                    </div>
                    <div data-ouia-component-type="my-component" data-ouia-component-id="c2">
                        <div data-ouia-component-type="foobar" data-ouia-component-id="baz"/>
                        <div data-ouia-component-type="foobar-2" data-ouia-component-id="baz"/>
                    </div>
                    <div data-ouia-component-type="foobar"/>
                </div>
            );

            const results = ouiaSelectors.getOuiaElements('foobar', 'baz');
            expect(results).toHaveLength(2);
        });
    });

    describe('ouiaSelectorsFor', () => {
        it('Uses the passed element as the base', () => {
            render(
                <div>
                    <div data-ouia-component-type="my-component" data-ouia-component-id="c1">
                        <div data-ouia-component-type="foobar" data-ouia-component-id="baz" id="me"/>
                        <div data-ouia-component-type="foobar-2" data-ouia-component-id="baz"/>
                    </div>
                    <div data-ouia-component-type="my-component" data-ouia-component-id="c2" id="my-element">
                        <div data-ouia-component-type="foobar" data-ouia-component-id="baz"/>
                        <div data-ouia-component-type="foobar-2" data-ouia-component-id="baz"/>
                    </div>
                    <div data-ouia-component-type="foobar"/>
                </div>
            );
            ouiaSelectorsFor(document.getElementById('my-element')!).getOuiaElement('foobar');
        });
    });
});
