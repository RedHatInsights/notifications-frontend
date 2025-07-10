import {
  DatePicker,
  DatePickerRef,
} from '@patternfly/react-core/dist/dynamic/components/DatePicker';
import {
  Split,
  SplitItem,
} from '@patternfly/react-core/dist/dynamic/layouts/Split';
import { TextInputProps } from '@patternfly/react-core/dist/dynamic/components/TextInput';
import {
  Select,
  SelectList,
  SelectOption,
  MenuToggle,
  MenuToggleElement,
} from '@patternfly/react-core';
import { important } from 'csx';
import { add, format, isAfter, isBefore, min, parseISO } from 'date-fns';
import produce from 'immer';
import * as React from 'react';
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
      color: important("var(--pf-t--temp--dev--tbd)"/* CODEMODS: original v5 color was --pf-v5-global--palette--black-1000 */),
    },
    '&:hover': {
      borderBottomColor: "var(--pf-t--temp--dev--tbd)"/* CODEMODS: original v5 color was --pf-v5-global--active-color--100 */,
    },
  },
});

class EventLogSelectObject {
  readonly value: NotificationsLogDateFilterValue;

  constructor(value: NotificationsLogDateFilterValue) {
    this.value = value;
  }

  toString() {
    return this.value;
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
  const maxDate = React.useMemo(() => new Date(), []);
  const minDate = React.useMemo(
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
      <SplitItem className="pf-v6-u-align-self-center pf-v6-u-px-sm pf-v6-u-color-300">
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

interface RangeFilterOptionModel {
  value: string;
  label: string;
}

const RangeFilterOption = (model: RangeFilterOptionModel) => model;

const rangeFilterOptions = [
  RangeFilterOption({
    value: 'last_24_hours',
    label: 'Last 24 hours',
  }),
  RangeFilterOption({
    value: 'last_7_days',
    label: 'Last 7 days',
  }),
  RangeFilterOption({
    value: 'last_30_days',
    label: 'Last 30 days',
  }),
  RangeFilterOption({
    value: 'custom',
    label: 'Custom range',
  }),
];

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
  const [isOpen, setOpen] = React.useState(false);
  const val = React.useMemo(() => new EventLogSelectObject(value), [value]);

  return (
    <Split hasGutter>
      <SplitItem isFilled>
        <Select
          toggle={(toggleRef: React.RefObject<MenuToggleElement>) => (
            <MenuToggle
              ref={toggleRef}
              onClick={() => setOpen(!isOpen)}
              isExpanded={isOpen}
            >
              {val.toString()}
            </MenuToggle>
          )}
          isOpen={isOpen}
          onOpenChange={(isOpen) => setOpen(isOpen)}
          onSelect={(_e: React.MouseEvent | undefined, selectObject: string | number | undefined) => {
            if (typeof selectObject === 'string') {
              setValue(selectObject as NotificationsLogDateFilterValue);
              setOpen(false);
            }
          }}
        >
          <SelectList>
            {rangeFilterOptions.map((option) => (
              <SelectOption key={option.value} value={option.value}>
                {option.label}
              </SelectOption>
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
