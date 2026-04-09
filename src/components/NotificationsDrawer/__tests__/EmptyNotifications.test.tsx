import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';

import { EmptyNotifications } from '../EmptyNotifications';

// Mock @scalprum/react-core
const mockSetVAState = jest.fn();
let mockLoading = false;
let mockHookResult: unknown = [null, mockSetVAState];
let mockModels: unknown = { VA: 'va-model' };

jest.mock('@scalprum/react-core', () => ({
  useRemoteHook: () => ({
    hookResult: mockHookResult,
    loading: mockLoading,
  }),
  useLoadModule: () => [mockModels],
}));

const renderComponent = (props: { isOrgAdmin?: boolean }) => {
  const onLinkClick = jest.fn();
  const view = render(
    <MemoryRouter>
      <EmptyNotifications onLinkClick={onLinkClick} isOrgAdmin={props.isOrgAdmin} />
    </MemoryRouter>
  );
  return { ...view, onLinkClick };
};

describe('EmptyNotifications', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockLoading = false;
    mockHookResult = [null, mockSetVAState];
    mockModels = { VA: 'va-model' };
  });

  it('renders empty state title', () => {
    renderComponent({});
    expect(screen.getByText('No notifications found')).toBeInTheDocument();
  });

  describe('non-admin user', () => {
    it('renders notification preferences link', () => {
      renderComponent({});
      expect(screen.getByText('Check your Notification Preferences')).toBeInTheDocument();
    });

    it('renders event log link', () => {
      renderComponent({});
      expect(screen.getByText('View the Event log to see all fired events')).toBeInTheDocument();
    });

    it('renders contact admin as a clickable link when VA is available', () => {
      renderComponent({});
      const link = screen.getByRole('button', {
        name: 'Contact your organization administrator',
      });
      expect(link).toBeInTheDocument();
      expect(link.tagName).toBe('BUTTON');
    });

    it('opens VA with prefilled message on click', async () => {
      const user = userEvent.setup();
      const { onLinkClick } = renderComponent({});

      const link = screen.getByRole('button', {
        name: 'Contact your organization administrator',
      });
      await user.click(link);

      expect(onLinkClick).toHaveBeenCalled();
      expect(mockSetVAState).toHaveBeenCalledWith({
        isOpen: true,
        currentModel: 'va-model',
        message: 'Contact my org admin.',
      });
    });

    it('renders contact admin as plain text when VA is loading', () => {
      mockLoading = true;
      renderComponent({});
      expect(screen.getByText('Contact your organization administrator')).toBeInTheDocument();
      expect(
        screen.queryByRole('button', {
          name: 'Contact your organization administrator',
        })
      ).not.toBeInTheDocument();
    });

    it('renders contact admin as plain text when VA hook is unavailable', () => {
      mockHookResult = null;
      renderComponent({});
      expect(screen.getByText('Contact your organization administrator')).toBeInTheDocument();
      expect(
        screen.queryByRole('button', {
          name: 'Contact your organization administrator',
        })
      ).not.toBeInTheDocument();
    });

    it('renders contact admin as plain text when Models module is unavailable', () => {
      mockModels = undefined;
      renderComponent({});
      expect(screen.getByText('Contact your organization administrator')).toBeInTheDocument();
      expect(
        screen.queryByRole('button', {
          name: 'Contact your organization administrator',
        })
      ).not.toBeInTheDocument();
    });
  });

  describe('org admin user', () => {
    it('renders notification preferences link', () => {
      renderComponent({ isOrgAdmin: true });
      expect(screen.getByText('checking your notification preferences')).toBeInTheDocument();
    });

    it('renders notification configuration link', () => {
      renderComponent({ isOrgAdmin: true });
      expect(screen.getByText('notification configuration')).toBeInTheDocument();
    });

    it('does not render contact admin text', () => {
      renderComponent({ isOrgAdmin: true });
      expect(screen.queryByText('Contact your organization administrator')).not.toBeInTheDocument();
    });
  });
});
