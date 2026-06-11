import { render, screen } from '@testing-library/react';
import { IntlProvider } from 'react-intl';
import React from 'react';

import { NotificationEvent } from '../../../../types/Event';
import {
  EventLogTable,
  EventLogTableColumns,
  eventLogSeverityLabelStyles,
  severityDescription,
  toSeverityLabelProps,
} from '../EventLogTable';

const mockGetIntegrationRecipient = jest.fn(async () => 'mock integration');

const baseEvent: NotificationEvent = {
  id: 'evt-1',
  event: 'Test event',
  application: 'advisor',
  bundle: 'rhel',
  date: new Date('2024-06-01T12:00:00Z'),
  actions: [],
};

const renderEventLogTable = (events: NotificationEvent[]) =>
  render(
    <IntlProvider locale="en">
      <EventLogTable
        events={events}
        loading={false}
        showSeverity={true}
        onSort={jest.fn()}
        sortColumn={EventLogTableColumns.DATE}
        sortDirection="desc"
        getIntegrationRecipient={mockGetIntegrationRecipient}
      />
    </IntlProvider>
  );

describe('EventLogTable severity', () => {
  describe.each(['CRITICAL', 'IMPORTANT', 'MODERATE', 'LOW', 'NONE'] as const)(
    'toSeverityLabelProps(%s)',
    (severity) => {
      it('returns an icon element', () => {
        const result = toSeverityLabelProps(severity);
        expect(result.icon).toBeTruthy();
      });

      it('uses inline Label style with PatternFly severity surface tokens', () => {
        const result = toSeverityLabelProps(severity);
        expect(result.style).toEqual(eventLogSeverityLabelStyles[severity]);
        expect(result.status).toBeUndefined();
        expect(result.color).toBeUndefined();
        expect(result.variant).toBeUndefined();
      });
    }
  );

  describe('toSeverityLabelProps(UNDEFINED)', () => {
    it('returns outline grey label with severity undefined border style', () => {
      const result = toSeverityLabelProps('UNDEFINED');
      expect(result.icon).toBeTruthy();
      expect(result.style).toEqual(eventLogSeverityLabelStyles.UNDEFINED);
      expect(result.status).toBeUndefined();
      expect(result.color).toBe('grey');
      expect(result.variant).toBe('outline');
    });
  });

  it('matches UNDEFINED styling when severity is missing', () => {
    const result = toSeverityLabelProps(undefined);
    expect(result.icon).toBeTruthy();
    expect(result.style).toEqual(eventLogSeverityLabelStyles.UNDEFINED);
    expect(result.status).toBeUndefined();
    expect(result.color).toBe('grey');
    expect(result.variant).toBe('outline');
  });

  describe('severityDescription', () => {
    it.each(['CRITICAL', 'IMPORTANT', 'MODERATE', 'LOW', 'NONE', 'UNDEFINED'] as const)(
      'has a non-empty description for %s',
      (severity) => {
        expect(severityDescription[severity]).toBeTruthy();
        expect(typeof severityDescription[severity]).toBe('string');
        expect(severityDescription[severity].length).toBeGreaterThan(0);
      }
    );
  });

  describe('rendering', () => {
    it('renders a severity label for defined severity values', () => {
      renderEventLogTable([{ ...baseEvent, severity: 'CRITICAL' }]);

      expect(screen.getByText('Critical')).toBeVisible();
    });

    it('leaves the severity cell blank when severity is missing', () => {
      renderEventLogTable([{ ...baseEvent, event: 'Legacy event (no severity)' }]);

      expect(screen.getByText('Legacy event (no severity)')).toBeVisible();
      expect(screen.queryByText('Undefined')).not.toBeInTheDocument();
    });

    it('leaves the severity cell blank when severity is UNDEFINED', () => {
      renderEventLogTable([
        { ...baseEvent, event: 'Event without severity type', severity: 'UNDEFINED' },
      ]);

      expect(screen.getByText('Event without severity type')).toBeVisible();
      expect(screen.queryByText('Undefined')).not.toBeInTheDocument();
    });
  });
});
