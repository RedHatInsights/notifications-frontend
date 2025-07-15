import {
  DatePicker,
  DatePickerRef,
  Split,
  SplitItem,
  TextInputProps,
} from '@patternfly/react-core';
import {
  MenuToggle,
  MenuToggleElement,
  Select,
  SelectList,
  SelectOption,
} from '@patternfly/react-core';
import { important } from 'csx';
import { add, format, isAfter, isBefore, min, parseISO } from 'date-fns';
import produce from 'immer';
import React, { useMemo, useState } from 'react';
import { Dispatch, useRef } from 'react';
import { SetStateAction } from 'react';
import { style } from 'typestyle';

import { EventPeriod } from '../../../types/Event';

export enum NotificationsLogDateFilterValue {
  TODAY = 'today',
  YESTERDAY = 'yesterday',
  LAST_7 = 'last_7',
  LAST_14 = 'last_14',
  CUSTOM = 'custom',
}

const labels: Record<NotificationsLogDateFilterValue, string> = {
  [NotificationsLogDateFilterValue.TODAY]: 'Today',
  [NotificationsLogDateFilterValue.YESTERDAY]: 'Yesterday',
  [NotificationsLogDateFilterValue.LAST_7]: 'Last 7 days',
  [NotificationsLogDateFilterValue.LAST_14]: 'Last 14 days',
  [NotificationsLogDateFilterValue.CUSTOM]: 'Custom',
};

const datePickerClassName = style({
  backgroundColor: important('var(-pf-v5-global--BackgroundColor--100)'),
  cursor: 'pointer',
  $nest: {
    '&::placeholder': {
      color: important('var(--pf-v6-global--palette--black-1000)'),
    },
    '&:hover': {
      borderBottomColor: 'var(--pf-v6-global--active-color--100)',
    },
  },
});

class EventLogSelectObject {
  readonly value: NotificationsLogDateFilterValue;

  constructor(value: NotificationsLogDateFilterValue) {
    this.value = value;
  }

  toString(): string {
    return labels[this.value];
  }
  compareTo(selectOption: unknown): boolean {
    if (selectOption instanceof EventLogSelectObject) {
      return selectOption.value === this.value;
    }

    return false;
  }
}

const dateInputProps: TextInputProps = {
  readOnly: true,
  className: datePickerClassName,
};

interface CustomDateFilterProps {
  retentionDays: number;
  period: EventPeriod;
  setPeriod: Dispatch<SetStateAction<EventPeriod>>;
}

const startRangeValidators = (minDate, maxDate, period) => [
  (date) => {
    if (isBefore(date, minDate)) {
      return 'Date is before the retention policy';
    } else if (isAfter(date, maxDate)) {
      return 'Date is after today';
    } else if (period[1] && isAfter(date, period[1])) {
      return 'Start date must be before end date';
    }

    return '';
  },
];

const endRangeValidators = (minDate, maxDate, period) => [
  (date) => {
    if (isBefore(date, minDate)) {
      return 'Date is before the retention policy';
    } else if (isAfter(date, maxDate)) {
      return 'Date is after today';
    } else if (period[0] && isBefore(date, period[0])) {
      return 'End date must be after start date';
    }

    return '';
  },
];

const CustomDateFilter: React.FunctionComponent<CustomDateFilterProps> = ({
  period,
  setPeriod,
}) => {
  const maxDate = useMemo(() => new Date(), []);
  const minDate = useMemo(
    () =>
      add(maxDate, {
        days: -14,
      }),
    [maxDate]
  );

  const formatPeriod = (period: Date | undefined) =>
    period ? format(period, 'yyyy-MM-dd') : undefined;

  const startValue: string | undefined = formatPeriod(period[0]);
  const endValue: string | undefined = formatPeriod(period[1]);

  const startDateRef = useRef<DatePickerRef>(null);
  const endDateRef = useRef<DatePickerRef>(null);

  return (
    <Split>
      <SplitItem>
        <DatePicker
          placeholder="Start"
          inputProps={{
            ...dateInputProps,
            onClick: () => startDateRef.current?.setCalendarOpen(true),
          }}
          validators={startRangeValidators(minDate, maxDate, period)}
          onChange={(_e, start: string) => {
            const startDate = parseISO(start);
            setPeriod(
              produce((draft) => {
                draft[0] = startDate;
                if (!draft[1]) {
                  draft[1] = min([add(startDate, { days: 1 }), maxDate]);
                }
              })
            );
          }}
          value={startValue}
          ref={startDateRef}
        />
      </SplitItem>
      <SplitItem className="pf-v5-u-align-self-center pf-v5-u-px-sm pf-v5-u-color-300">
        to
      </SplitItem>
      <SplitItem>
        <DatePicker
          placeholder="End"
          inputProps={{
            ...dateInputProps,
            onClick: () => endDateRef.current?.setCalendarOpen(true),
          }}
          validators={endRangeValidators(minDate, maxDate, period)}
          onChange={(_e, end: string) => {
            setPeriod(
              produce((draft) => {
                draft[1] = parseISO(end);
              })
            );
          }}
          value={endValue}
          ref={endDateRef}
        />
      </SplitItem>
    </Split>
  );
};

export interface NotificationsLogDateFilterProps {
  value: NotificationsLogDateFilterValue;
  setValue: (value: NotificationsLogDateFilterValue) => void;
  retentionDays: number;
  period: EventPeriod;
  setPeriod: Dispatch<SetStateAction<EventPeriod>>;
}

export const NotificationsLogDateFilter: React.FunctionComponent<
  NotificationsLogDateFilterProps
> = ({ value, setValue, period, setPeriod, retentionDays }) => {
  const [isOpen, setOpen] = useState(false);
  const val = useMemo(() => new EventLogSelectObject(value), [value]);

  return (
    <Split>
      <SplitItem>
        <Select
          isOpen={isOpen}
          selected={val}
          onSelect={(_e: unknown, selectObject: unknown) => {
            if (selectObject instanceof EventLogSelectObject) {
              setValue(selectObject.value);
              setOpen(false);
            }
          }}
          onOpenChange={(isOpen) => setOpen(isOpen)}
          toggle={(toggleRef: React.Ref<MenuToggleElement>) => (
            <MenuToggle
              ref={toggleRef}
              onClick={() => setOpen((prev) => !prev)}
              isExpanded={isOpen}
            >
              {val.toString()}
            </MenuToggle>
          )}
        >
          <SelectList>
            {Object.values(NotificationsLogDateFilterValue).map((v) => (
              <SelectOption key={v} value={new EventLogSelectObject(v)} />
            ))}
          </SelectList>
        </Select>
      </SplitItem>
      {value === NotificationsLogDateFilterValue.CUSTOM && (
        <SplitItem>
          <CustomDateFilter
            period={period}
            setPeriod={setPeriod}
            retentionDays={retentionDays}
          />
        </SplitItem>
      )}
    </Split>
  );
};
