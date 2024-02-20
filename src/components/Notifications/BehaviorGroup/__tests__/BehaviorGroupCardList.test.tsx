import { render, screen } from '@testing-library/react';
import * as React from 'react';

import { waitForAsyncEvents } from '../../../../../test/TestUtils';
import {
  BehaviorGroup,
  NotificationType,
} from '../../../../types/Notification';
import { BehaviorGroupCardList } from '../BehaviorGroupCardList';

const Container: React.FunctionComponent<
  React.PropsWithChildren<{
    hideContent: boolean;
  }>
> = (props) => (
  <div>
    <div style={props.hideContent ? { display: 'none' } : { display: 'block' }}>
      {props.children}
    </div>
  </div>
);

describe('src/components/Notifications/BehaviorGroup/BehaviorGroupCardList', () => {
  it('Behavior groups created inside a display:none section are still show correctly after when setting display:block', async () => {
    const bg: Array<BehaviorGroup> = [
      {
        bundleId: 'foo',
        actions: [
          {
            recipient: [],
            type: NotificationType.EMAIL_SUBSCRIPTION,
          },
        ],
        events: [],
        displayName: 'My group',
        id: 'bar',
        bundleName: 'foobar',
        isDefault: false,
      },
    ];

    const { rerender } = render(
      <Container hideContent={true}>
        <BehaviorGroupCardList
          onEdit={jest.fn()}
          onDelete={jest.fn()}
          behaviorGroups={bg}
        />
      </Container>
    );

    expect(screen.getByText(/my group/i)).toBeInTheDocument();
    expect(screen.getByText(/my group/i)).not.toBeVisible();

    rerender(
      <Container hideContent={false}>
        <BehaviorGroupCardList
          onEdit={jest.fn()}
          onDelete={jest.fn()}
          behaviorGroups={bg}
        />
      </Container>
    );

    await waitForAsyncEvents();

    expect(screen.getByText(/my group/i)).toBeInTheDocument();
    expect(screen.getByText(/my group/i)).toBeVisible();
  });
});
