import React from 'react';
import { LabelProps } from '@patternfly/react-core/dist/dynamic/components/Label';
import {
  SeverityCriticalIcon,
  SeverityImportantIcon,
  SeverityMinorIcon,
  SeverityModerateIcon,
  SeverityNoneIcon,
  SeverityUndefinedIcon,
} from '@patternfly/react-icons';

import { EventSeverity } from '../types/Event';

/**
 * Filled label backgrounds use PatternFly global **severity** surface tokens
 * (`--pf-t--global--color--severity--*-100`), aligned with the severity palette in
 * https://www.patternfly.org/patterns/status-and-severity/#severity-icons
 *
 * Variables are set via inline `style` on `Label` so they are not overridden by
 * PatternFly stylesheet order (a prior class-only approach left all chips grey).
 *
 * Foreground uses white/black for contrast. Icons are severity-shaped, not status icons.
 */
const severityLabelFgOnDark = 'var(--pf-t--color--white)';
const severityLabelFgOnLight = 'var(--pf-t--color--black)';

/** Inline Label `style` so PF label CSS does not override single-class typestyle rules (load order). */
const severityLabelVars = (vars: Record<string, string>): React.CSSProperties =>
  vars as React.CSSProperties;

export const eventLogSeverityLabelStyles: Record<EventSeverity, React.CSSProperties> = {
  CRITICAL: severityLabelVars({
    '--pf-v6-c-label--BackgroundColor': 'var(--pf-t--global--color--severity--critical--100)',
    '--pf-v6-c-label--Color': severityLabelFgOnDark,
    '--pf-v6-c-label__icon--Color': severityLabelFgOnDark,
  }),
  IMPORTANT: severityLabelVars({
    '--pf-v6-c-label--BackgroundColor': 'var(--pf-t--global--color--severity--important--100)',
    '--pf-v6-c-label--Color': severityLabelFgOnDark,
    '--pf-v6-c-label__icon--Color': severityLabelFgOnDark,
  }),
  MODERATE: severityLabelVars({
    '--pf-v6-c-label--BackgroundColor': 'var(--pf-t--global--color--severity--moderate--100)',
    '--pf-v6-c-label--Color': severityLabelFgOnLight,
    '--pf-v6-c-label__icon--Color': severityLabelFgOnLight,
  }),
  LOW: severityLabelVars({
    '--pf-v6-c-label--BackgroundColor': 'var(--pf-t--global--color--severity--minor--100)',
    '--pf-v6-c-label--Color': severityLabelFgOnLight,
    '--pf-v6-c-label__icon--Color': severityLabelFgOnLight,
  }),
  NONE: severityLabelVars({
    '--pf-v6-c-label--BackgroundColor': 'var(--pf-t--global--color--severity--none--100)',
    '--pf-v6-c-label--Color': severityLabelFgOnDark,
    '--pf-v6-c-label__icon--Color': severityLabelFgOnDark,
  }),
  UNDEFINED: severityLabelVars({
    '--pf-v6-c-label--BorderColor': 'var(--pf-t--global--color--severity--undefined--200)',
    '--pf-v6-c-label--Color': severityLabelFgOnLight,
    '--pf-v6-c-label__icon--Color': severityLabelFgOnLight,
  }),
};

export const toSeverityLabelProps = (
  severity?: EventSeverity
): Pick<LabelProps, 'color' | 'icon' | 'style' | 'status' | 'variant'> => {
  switch (severity) {
    case 'CRITICAL':
      return {
        style: eventLogSeverityLabelStyles.CRITICAL,
        icon: <SeverityCriticalIcon />,
      };
    case 'IMPORTANT':
      return {
        style: eventLogSeverityLabelStyles.IMPORTANT,
        icon: <SeverityImportantIcon />,
      };
    case 'MODERATE':
      return {
        style: eventLogSeverityLabelStyles.MODERATE,
        icon: <SeverityModerateIcon />,
      };
    case 'LOW':
      return {
        style: eventLogSeverityLabelStyles.LOW,
        icon: <SeverityMinorIcon />,
      };
    case 'NONE':
      return {
        style: eventLogSeverityLabelStyles.NONE,
        icon: <SeverityNoneIcon />,
      };
    case 'UNDEFINED':
      return {
        style: eventLogSeverityLabelStyles.UNDEFINED,
        color: 'grey',
        variant: 'outline',
        icon: <SeverityUndefinedIcon />,
      };
    case undefined:
    default:
      return {
        style: eventLogSeverityLabelStyles.UNDEFINED,
        color: 'grey',
        variant: 'outline',
        icon: <SeverityUndefinedIcon />,
      };
  }
};

export const severityDisplayName: Record<EventSeverity, string> = {
  CRITICAL: 'Critical',
  IMPORTANT: 'Important',
  MODERATE: 'Moderate',
  LOW: 'Low',
  NONE: 'None',
  UNDEFINED: 'Undefined',
};

export const severityDescription: Record<EventSeverity, string> = {
  CRITICAL: 'Urgent notification about an event with impact to your systems',
  IMPORTANT: 'Errors or other events that may impact your systems',
  MODERATE: 'Warning',
  LOW: 'Information only',
  NONE: 'Debug or informative updates',
  UNDEFINED: 'Severity level has not been defined for this event',
};

export const SEVERITY_VALUES: EventSeverity[] = [
  'CRITICAL',
  'IMPORTANT',
  'MODERATE',
  'LOW',
  'NONE',
  'UNDEFINED',
];

/**
 * Returns the icon color for a given severity level using PatternFly severity color tokens.
 * Used for severity icons in filters, dropdowns, and other non-label contexts.
 */
export const getSeverityIconColor = (severity: EventSeverity): string => {
  switch (severity) {
    case 'CRITICAL':
      return 'var(--pf-t--global--color--severity--critical--100)';
    case 'IMPORTANT':
      return 'var(--pf-t--global--color--severity--important--100)';
    case 'MODERATE':
      return 'var(--pf-t--global--color--severity--moderate--100)';
    case 'LOW':
      return 'var(--pf-t--global--color--severity--minor--100)';
    case 'NONE':
      return 'var(--pf-t--global--color--severity--none--100)';
    case 'UNDEFINED':
      return 'var(--pf-t--global--color--severity--undefined--200)';
  }
};
