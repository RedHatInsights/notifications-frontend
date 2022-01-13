import { act, render, screen } from '@testing-library/react';
import * as React from 'react';

import { getLastObserver } from '../../../../../config/testutils/ResizeObserverMock';
import { waitForAsyncEvents } from '../../../../../test/TestUtils';
import { BehaviorGroup, NotificationType } from '../../../../types/Notification';
import { BehaviorGroupCardList } from '../BehaviorGroupCardList';

const Container: React.FunctionComponent<{
    hideContent: boolean
}> = props => (
    <div>
        <div style={ props.hideContent ? { display: 'none' } : { display: 'block' } }>
            { props.children }
        </div>
    </div>
);

const makeRect = (contentRect?: Partial<DOMRectReadOnly>) => ({
    bottom: 0,
    height: 0,
    left: 0,
    right: 0,
    top: 0,
    width: 0,
    x: 0,
    y: 0,
    toJSON: () => 'foo',
    ...contentRect
});

describe('src/components/Notifications/BehaviorGroup/BehaviorGroupCardList', () => {
    it('Behavior groups created inside a display:none section are still show correctly after when setting display:block', async () => {

        const bg: Array<BehaviorGroup> = [{
            bundleId: 'foo',
            actions: [
                {
                    recipient: [],
                    type: NotificationType.EMAIL_SUBSCRIPTION
                }
            ],
            displayName: 'My group',
            id: 'bar',
            bundleName: 'foobar',
            isDefault: false
        }];

        window. HTMLDivElement.prototype.getBoundingClientRect = () => makeRect();

        const { rerender } = render(
            <Container hideContent={ true }>
                <BehaviorGroupCardList onEdit={ jest.fn() } onDelete={ jest.fn() } behaviorGroups={ bg } />
            </Container>
        );

        expect(screen.getByText(/my group/i)).toBeInTheDocument();
        expect(screen.getByText(/my group/i)).not.toBeVisible();
        expect(screen.getByTestId('card-list-container')).toHaveStyle('max-height:0px');

        window. HTMLDivElement.prototype.getBoundingClientRect = () => makeRect({
            height: 100
        });

        rerender(
            <Container hideContent={ false }>
                <BehaviorGroupCardList onEdit={ jest.fn() } onDelete={ jest.fn() } behaviorGroups={ bg } />
            </Container>
        );

        // Simulate resize
        act(() => {
            getLastObserver().mockEvent({
                height: 100
            });
        });
        await waitForAsyncEvents();

        expect(screen.getByText(/my group/i)).toBeInTheDocument();
        expect(screen.getByText(/my group/i)).toBeVisible();
        expect(screen.getByTestId('card-list-container')).toHaveStyle('max-height:100px');
    });
});
