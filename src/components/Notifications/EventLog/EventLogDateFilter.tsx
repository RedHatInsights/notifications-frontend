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

export enum EventLogDateFilterValue {
  TODAY = 'today',
  YESTERDAY = 'yesterday',
  LAST_7 = 'last_7',
  LAST_14 = 'last_14',
  CUSTOM = 'custom',
}

const labels: Record<EventLogDateFilterValue, string> = {
  [EventLogDateFilterValue.TODAY]: 'Today',
  [EventLogDateFilterValue.YESTERDAY]: 'Yesterday',
  [EventLogDateFilterValue.LAST_7]: 'Last 7 days',
  [EventLogDateFilterValue.LAST_14]: 'Last 14 days',
  [EventLogDateFilterValue.CUSTOM]: 'Custom',
};

const datePickerClassName = style({
  backgroundColor: important('white'),
  cursor: 'pointer',
  $nest: {
    '&::placeholder': {
      color: important('black'),
    },
    '&:hover': {
      borderBottomColor: "var(--pf-t--temp--dev--tbd)"/* CODEMODS: original v5 color was --pf-v5-global--active-color--100 */,
    },
  },
});

class EventLogSelectObject {
  readonly value: EventLogDateFilterValue;

  constructor(value: EventLogDateFilterValue) {
    this.value = value;
  }

  toString(): string {
    return labels[this.value];
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  compareTo(selectOption: any): boolean {
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

const CustomDateFilter: React.FunctionComponent<CustomDateFilterProps> = (
  props
) => {
  const maxDate = React.useMemo(() => new Date(), []);
  const minDate = React.useMemo(
    () =>
      add(maxDate, {
        days: -14,
      }),
    [maxDate]
  );

  const startRangeValidators = React.useMemo(
    () => [
      (date) => {
        if (isBefore(date, minDate)) {
          return 'Date is before the retention policy';
        } else if (isAfter(date, maxDate)) {
          return 'Date is after today';
        } else if (props.period[1] && isAfter(date, props.period[1])) {
          return 'Start date must be before end date';
        }

        return '';
      },
    ],
    [minDate, maxDate, props.period]
  );

  const endRangeValidators = React.useMemo(
    () => [
      (date) => {
        if (isBefore(date, minDate)) {
          return 'Date is before the retention policy';
        } else if (isAfter(date, maxDate)) {
          return 'Date is after today';
        } else if (props.period[0] && isBefore(date, props.period[0])) {
          return 'End date must be after start date';
        }

        return '';
      },
    ],
    [minDate, maxDate, props.period]
  );

  const setStartDate = React.useCallback(
    (start: string) => {
      const setPeriod = props.setPeriod;
      const startDate = parseISO(start);
      setPeriod(
        produce((draft) => {
          draft[0] = startDate;
          if (!draft[1]) {
            draft[1] = min([add(startDate, { days: 1 }), maxDate]);
          }
        })
      );
    },
    [props.setPeriod, maxDate]
  );

  const setEndDate = React.useCallback(
    (end: string) => {
      const setPeriod = props.setPeriod;
      setPeriod(
        produce((draft) => {
          draft[1] = parseISO(end);
        })
      );
    },
    [props.setPeriod]
  );

  const startValue: string | undefined = React.useMemo(
    () => (props.period[0] ? format(props.period[0], 'yyyy-MM-dd') : undefined),
    [props.period]
  );
  const endValue: string | undefined = React.useMemo(
    () => (props.period[1] ? format(props.period[1], 'yyyy-MM-dd') : undefined),
    [props.period]
  );

  const startDateRef = useRef<DatePickerRef>(null);
  const endDateRef = useRef<DatePickerRef>(null);

  const onClickStartDateInput = React.useCallback(() => {
    startDateRef.current?.setCalendarOpen(true);
  }, [startDateRef]);

  const onClickEndDateInput = React.useCallback(() => {
    endDateRef.current?.setCalendarOpen(true);
  }, [endDateRef]);

  const startDateInputProps = React.useMemo<TextInputProps>(
    () => ({
      ...dateInputProps,
      onClick: onClickStartDateInput,
    }),
    [onClickStartDateInput]
  );

  const endDateInputProps = React.useMemo<TextInputProps>(
    () => ({
      ...dateInputProps,
      onClick: onClickEndDateInput,
    }),
    [onClickEndDateInput]
  );

  return (
    <Split>
      <SplitItem>
        <DatePicker
          placeholder="Start"
          inputProps={startDateInputProps}
          validators={startRangeValidators}
          onChange={(_e, val) => setStartDate(val)}
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
          inputProps={endDateInputProps}
          validators={endRangeValidators}
          onChange={(_e, val) => setEndDate(val)}
          value={endValue}
          ref={endDateRef}
        />
      </SplitItem>
    </Split>
  );
};

export interface EventLogDateFilterProps {
  value: EventLogDateFilterValue;
  setValue: (value: EventLogDateFilterValue) => void;
  retentionDays: number;
  period: EventPeriod;
  setPeriod: Dispatch<SetStateAction<EventPeriod>>;
}

export const EventLogDateFilter: React.FunctionComponent<
  EventLogDateFilterProps
> = (props) => {
  const options = React.useMemo(
    () =>
      Object.values(EventLogDateFilterValue).map((v) => (
        <SelectOption key={v} value={new EventLogSelectObject(v)} />
      )),
    []
  );
  const [isOpen, setOpen] = React.useState(false);
  const onToggle = React.useCallback(() => setOpen((prev) => !prev), [setOpen]);
  const value = React.useMemo(
    () => new EventLogSelectObject(props.value),
    [props.value]
  );
  const onSelect = React.useCallback(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (_e: any, selectObject: any) => {
      const setValue = props.setValue;
      if (selectObject instanceof EventLogSelectObject) {
        setValue(selectObject.value);
        setOpen(false);
      }
    },
    [props.setValue]
  );

  return (
    <Split>
      <SplitItem>
        <Select
          isOpen={isOpen}
          selected={value}
          onSelect={onSelect}
          onOpenChange={(isOpen) => setOpen(isOpen)}
          toggle={(toggleRef: React.Ref<MenuToggleElement>) => (
            <MenuToggle
              ref={toggleRef}
              onClick={onToggle}
              isExpanded={isOpen}
            >
              {value.toString()}
            </MenuToggle>
          )}
        >
          <SelectList>
            {options}
          </SelectList>
        </Select>
      </SplitItem>
      {props.value === EventLogDateFilterValue.CUSTOM && (
        <SplitItem>
          <CustomDateFilter
            period={props.period}
            setPeriod={props.setPeriod}
            retentionDays={props.retentionDays}
          />
        </SplitItem>
      )}
    </Split>
  );
};
