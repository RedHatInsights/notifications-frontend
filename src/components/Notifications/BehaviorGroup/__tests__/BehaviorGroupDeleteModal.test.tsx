import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { fn } from 'jest-mock';
import * as React from 'react';

import { BehaviorGroupDeleteModal } from '../BehaviorGroupDeleteModal';

describe('src/components/Notifications/BehaviorGroup/BehaviorGroupDeleteModal', () => {
    it('Renders the behavior display name if there are conflicts', () => {
        render(<BehaviorGroupDeleteModal
            behaviorGroup={ {
                id: 'foo',
                displayName: 'Foo',
                actions: [],
                bundleId: 'bundle-id'
            } }
            onDelete={ fn() }
            onClose={ fn() }
            conflictingNotifications={ [{
                id: 'conflict-1',
                eventTypeDisplayName: 'EventBar',
                applicationDisplayName: 'ApplicationBaz',
                actions: [],
                useDefault: false
            }] }
            isDeleting={ false }
        />);

        expect(screen.getByText('Foo')).toBeVisible();
    });

    it('Renders the behavior display name if there are no conflicts', () => {
        render(<BehaviorGroupDeleteModal
            behaviorGroup={ {
                id: 'foo',
                displayName: 'Foo',
                actions: [],
                bundleId: 'bundle-id'
            } }
            onDelete={ fn() }
            onClose={ fn() }
            conflictingNotifications={ [] }
            isDeleting={ false }
        />);

        expect(screen.getByText('Foo')).toBeVisible();
    });

    it('Secondary button is called Close and remove does not exist if there are conflicts', () => {
        render(<BehaviorGroupDeleteModal
            behaviorGroup={ {
                id: 'foo',
                displayName: 'Foo',
                actions: [],
                bundleId: 'bundle-id'
            } }
            onDelete={ fn() }
            onClose={ fn() }
            conflictingNotifications={ [{
                id: 'conflict-1',
                eventTypeDisplayName: 'EventBar',
                applicationDisplayName: 'ApplicationBaz',
                actions: [],
                useDefault: false
            }] }
            isDeleting={ false }
        />);

        expect(screen.queryByText(/remove/i, { selector: 'button' })).toBeFalsy();
        expect(screen.getByText(/close/i)).toBeVisible();
    });

    it('Secondary button is called cancel if there are no conflicts', () => {
        render(<BehaviorGroupDeleteModal
            behaviorGroup={ {
                id: 'foo',
                displayName: 'Foo',
                actions: [],
                bundleId: 'bundle-id'
            } }
            onDelete={ fn() }
            onClose={ fn() }
            conflictingNotifications={ [] }
            isDeleting={ false }
        />);

        expect(screen.getByText(/cancel/i)).toBeVisible();
    });

    it('Shows disclaimer if there are no conflicts', () => {
        render(<BehaviorGroupDeleteModal
            behaviorGroup={ {
                id: 'foo',
                displayName: 'Foo',
                actions: [],
                bundleId: 'bundle-id'
            } }
            onDelete={ fn() }
            onClose={ fn() }
            conflictingNotifications={ [] }
            isDeleting={ false }
        />);

        expect(screen.getByText(/this action cannot be undone/i)).toBeVisible();
    });

    it('When no conflicts, the delete is disabled until the disclaimer is accepted', () => {
        render(<BehaviorGroupDeleteModal
            behaviorGroup={ {
                id: 'foo',
                displayName: 'Foo',
                actions: [],
                bundleId: 'bundle-id'
            } }
            onDelete={ fn() }
            onClose={ fn() }
            conflictingNotifications={ [] }
            isDeleting={ false }
        />);

        expect(screen.getByText(/remove/i, { selector: 'button' })).toBeDisabled();
        userEvent.click(screen.getByText(/this action cannot be undone/i));
        expect(screen.getByText(/remove/i, { selector: 'button' })).toBeEnabled();
        userEvent.click(screen.getByText(/this action cannot be undone/i));
        expect(screen.getByText(/remove/i, { selector: 'button' })).toBeDisabled();
    });

    it('On delete with the behavior is called when clicking Remove button', () => {
        const onDelete = fn<boolean, []>();
        const bg = {
            id: 'foo',
            displayName: 'Foo',
            actions: [],
            bundleId: 'bundle-id'
        };
        render(<BehaviorGroupDeleteModal
            behaviorGroup={ bg }
            onDelete={ onDelete }
            onClose={ fn() }
            conflictingNotifications={ [] }
            isDeleting={ false }
        />);

        userEvent.click(screen.getByText(/this action cannot be undone/i));
        userEvent.click(screen.getByText(/remove/i, { selector: 'button' }));
        expect(onDelete).toHaveBeenCalledWith(bg);
    });

    it('On close is called when clicking cancel button', () => {
        const onClose = fn();
        const bg = {
            id: 'foo',
            displayName: 'Foo',
            actions: [],
            bundleId: 'bundle-id'
        };
        render(<BehaviorGroupDeleteModal
            behaviorGroup={ bg }
            onDelete={ fn() }
            onClose={ onClose }
            conflictingNotifications={ [] }
            isDeleting={ false }
        />);

        userEvent.click(screen.getByText(/cancel/i, { selector: 'button' }));
        expect(onClose).toHaveBeenCalled();
    });
});
