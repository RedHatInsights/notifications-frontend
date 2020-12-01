import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import * as React from 'react';

import { appWrapperCleanup, appWrapperSetup, getConfiguredAppWrapper } from '../../../../test/AppWrapper';
import { ErrorPage } from '../Page';

jest.mock('@redhat-cloud-services/frontend-components', () => {

    const Children: React.FunctionComponent = (props) => {
        return <span>{ props.children }</span>;
    };

    const Title: React.FunctionComponent<any> = (props) => {
        return <span>{ props.title }</span>;
    };

    return {
        Main: Children,
        PageHeader: Children,
        PageHeaderTitle: Title
    };
});

describe('src/pages/Error/Page', () => {

    let mockConsole;

    beforeEach(() => {
        mockConsole = jest.spyOn(console, 'error');
        mockConsole.mockImplementation(() => '');
        appWrapperSetup();
    });

    afterEach(() => {
        mockConsole.mockRestore();
        appWrapperCleanup();
    });

    it('Goes to back when clicking the button', () => {
        const getLocation = jest.fn();
        const AppWrapper = getConfiguredAppWrapper({
            getLocation,
            route: {
                path: '/'
            },
            router: {
                initialEntries: [
                    '/foo',
                    '/bar'
                ]
            }
        });

        const Surprise = () => {
            throw new Error('surprise');
        };

        render(<ErrorPage><Surprise /></ErrorPage>, {
            wrapper: AppWrapper
        });

        userEvent.click(screen.getByRole('button', {
            name: /back/i
        }));
        expect(getLocation().pathname).toEqual('/foo');
    });
});
