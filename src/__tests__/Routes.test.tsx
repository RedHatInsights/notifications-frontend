import * as React from 'react';
import { render, screen } from '@testing-library/react';
import { Routes } from '../Routes';
import { MemoryRouter } from 'react-router-dom';
import { appWrapperCleanup, appWrapperSetup, getConfiguredAppWrapper } from '../../test/AppWrapper';

describe('src/Routes', () => {
    it('Should throw when no id=root element found', () => {
        const LocalWrapper: React.FunctionComponent = (props) => {
            return <MemoryRouter initialEntries={ [ '/integrations' ] } >{ props.children }</MemoryRouter>;
        };

        // Silence the exception, this is being logged because react will recommend to use
        // error boundaries, the exception is still throw.
        const mockConsole = jest.spyOn(console, 'error');
        mockConsole.mockImplementation(() => '');

        expect(() => render(<Routes/>, {
            wrapper: LocalWrapper
        })).toThrowError();

        mockConsole.mockRestore();
    });

    describe('App Wrapped', () => {

        beforeEach(() => {
            appWrapperSetup();
        });

        afterEach(() => {
            appWrapperCleanup();
        });

        it('Nothing is rendered in /', async () => {
            jest.useFakeTimers();
            const getLocation = jest.fn();
            const Wrapper = getConfiguredAppWrapper({
                router: {
                    initialEntries: [ '/' ]
                },
                getLocation
            });
            render(<Routes/>, {
                wrapper: Wrapper
            });

            expect(getLocation().pathname).toBe('/');
            expect(document.body.firstChild).toBeEmpty();
        });

        it('Should render the placeholder on /integrations', async () => {
            jest.useFakeTimers();
            const getLocation = jest.fn();
            const Wrapper = getConfiguredAppWrapper({
                router: {
                    initialEntries: [ '/integrations' ]
                },
                getLocation
            });
            render(<Routes/>, {
                wrapper: Wrapper
            });

            expect(getLocation().pathname).toBe('/integrations');
            expect(screen.getByText(/integrations/i)).toBeVisible();
        });

        it('Should render the placeholder on /notifications', async () => {
            jest.useFakeTimers();
            const getLocation = jest.fn();
            const Wrapper = getConfiguredAppWrapper({
                router: {
                    initialEntries: [ '/notifications' ]
                },
                getLocation
            });
            render(<Routes/>, {
                wrapper: Wrapper
            });

            expect(getLocation().pathname).toBe('/notifications');
            expect(screen.getByText(/notifications/i)).toBeVisible();
        });
    });
});
