import { render, screen } from '@testing-library/react';
import * as React from 'react';
import { IntlProvider } from 'react-intl';

import { UnauthorizedState } from '../UnauthorizedState';

describe('UnauthorizedState', () => {
  const renderComponent = () => {
    return render(
      <IntlProvider locale="en">
        <UnauthorizedState />
      </IntlProvider>
    );
  };

  it('renders the alert with permission information', () => {
    renderComponent();

    // Check for the alert title
    expect(screen.getByText(/need to create an integration/i)).toBeInTheDocument();

    // Check for the link in the alert
    expect(
      screen.getByRole('link', {
        name: /learn about requesting access via the virtual assistant/i,
      })
    ).toBeInTheDocument();
  });

  it('renders the empty state with lock icon and heading', () => {
    renderComponent();

    // Check for the empty state heading
    expect(screen.getByText(/no integrations available/i)).toBeInTheDocument();

    // Check for the description
    expect(screen.getByText(/you need read permissions to view integrations/i)).toBeInTheDocument();
  });

  it('renders the link to request access', () => {
    renderComponent();

    // Check for the Virtual Assistant link
    const link = screen.getByRole('link', {
      name: /learn about requesting access via the virtual assistant/i,
    });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', 'https://access.redhat.com/articles/6957948');
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('renders instructions to contact org admin', () => {
    renderComponent();

    // Check that the empty state description mentions contacting the org administrator
    expect(
      screen.getByText(/contact your organization administrator to request access/i)
    ).toBeInTheDocument();
  });
});
