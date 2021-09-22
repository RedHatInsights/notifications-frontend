import {
    Bullseye,
    DatePicker,
    Select,
    SelectOption,
    SelectOptionObject,
    SelectVariant,
    Split,
    SplitItem,
    TextInputProps
} from '@patternfly/react-core';
import { global_active_color_100, global_palette_black_600, global_spacer_sm } from '@patternfly/react-tokens';
import { important } from 'csx';
import { add, format, isAfter, isBefore, min, parseISO } from 'date-fns';
import produce from 'immer';
import * as React from 'react';
import { Dispatch } from 'react';
import { SetStateAction } from 'react';
import { style } from 'typestyle';

import { EventPeriod } from '../../../types/Event';

export enum EventLogDateFilterValue {
    TODAY = 'today',
    YESTERDAY = 'yesterday',
    LAST_7 = 'last_7',
    LAST_14 = 'last_14',
    CUSTOM = 'custom'
}

const labels: Record<EventLogDateFilterValue, string> = {
    [EventLogDateFilterValue.TODAY]: 'Today',
    [EventLogDateFilterValue.YESTERDAY]: 'Yesterday',
    [EventLogDateFilterValue.LAST_7]: 'Last 7 days',
    [EventLogDateFilterValue.LAST_14]: 'Last 14 days',
    [EventLogDateFilterValue.CUSTOM]: 'Custom'
};

const toClassName = style({
    paddingLeft: global_spacer_sm.value,
    paddingRight: global_spacer_sm.value,
    color: global_palette_black_600.value
});

const datePickerClassName = style({
    backgroundColor: important('white'),
    cursor: 'pointer',
    $nest: {
        '&::placeholder': {
            color: important('black')
        },
        '&:hover': {
            borderBottomColor: global_active_color_100.value
        }
    }
});

class EventLogSelectObject implements SelectOptionObject {

    readonly value: EventLogDateFilterValue;

    constructor(value: EventLogDateFilterValue) {
        this.value = value;
    }

    toString(): string {
        return labels[this.value];
    }
    compareTo(selectOption: any): boolean {
        if (selectOption instanceof EventLogSelectObject) {
            return selectOption.value === this.value;
        }

        return false;
    }
}

const dateInputProps: TextInputProps = {
    isReadOnly: true,
    className: datePickerClassName
};

interface CustomDateFilterProps {
    retentionDays: number;
    period: EventPeriod;
    setPeriod: Dispatch<SetStateAction<EventPeriod>>;
}

const CustomDateFilter: React.FunctionComponent<CustomDateFilterProps> = props => {
    const maxDate = React.useMemo(() => new Date(), []);
    const minDate = React.useMemo(() => add(maxDate, {
        days: -14
    }), [ maxDate ]);

    const startRangeValidators = React.useMemo(() => [ (date) => {
        if (isBefore(date, minDate)) {
            return 'Date is before the retention policy';
        } else if (isAfter(date, maxDate)) {
            return 'Date is after today';
        } else if (props.period[1] && isAfter(date, props.period[1])) {
            return 'Start date must be before end date';
        }

        return '';
    } ], [ minDate, maxDate, props.period ]);

    const endRangeValidators = React.useMemo(() => [ (date) => {
        if (isBefore(date, minDate)) {
            return 'Date is before the retention policy';
        } else if (isAfter(date, maxDate)) {
            return 'Date is after today';
        } else if (props.period[0] && isBefore(date, props.period[0])) {
            return 'End date must be after start date';
        }

        return '';
    } ], [ minDate, maxDate, props.period ]);

    const setStartDate = React.useCallback((start: string) => {
        const setPeriod = props.setPeriod;
        const startDate = parseISO(start);
        setPeriod(produce(draft => {
            draft[0] = startDate;
            if (!draft[1]) {
                draft[1] = min([ add(startDate, { days: 1 }), maxDate ]);
            }
        }));
    }, [
        props.setPeriod,
        maxDate
    ]);

    const setEndDate = React.useCallback((end: string) => {
        const setPeriod = props.setPeriod;
        setPeriod(produce(draft => {
            draft[1] = parseISO(end);
        }));
    }, [ props.setPeriod ]);

    const startValue: string | undefined = React.useMemo(() => props.period[0] ? format(props.period[0], 'yyyy-MM-dd') : undefined, [ props.period ]);
    const endValue: string | undefined = React.useMemo(() => props.period[1] ? format(props.period[1], 'yyyy-MM-dd') : undefined, [ props.period ]);

    return (
        <Split>
            <SplitItem>
                <DatePicker
                    placeholder="Start"
                    inputProps={ dateInputProps }
                    validators={ startRangeValidators }
                    onChange={ setStartDate }
                    value={ startValue }
                />
            </SplitItem>
            <SplitItem>
                <Bullseye>
                    <span className={ toClassName }>to</span>
                </Bullseye>
            </SplitItem>
            <SplitItem>
                <DatePicker
                    placeholder="End"
                    inputProps={ dateInputProps }
                    validators={ endRangeValidators }
                    onChange={ setEndDate }
                    value={ endValue }
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

export const EventLogDateFilter: React.FunctionComponent<EventLogDateFilterProps> = props => {

    const options = React.useMemo(
        () => Object.values(EventLogDateFilterValue).map(v => <SelectOption key={ v } value={ new EventLogSelectObject(v) } />),
        []
    );
    const [ isOpen, setOpen ] = React.useState(false);
    const onToggle = React.useCallback(() => setOpen(prev => !prev), [ setOpen ]);
    const value = React.useMemo(() => new EventLogSelectObject(props.value), [ props.value ]);
    const onSelect = React.useCallback((_e: any, selectObject: SelectOptionObject | string) => {
        const setValue = props.setValue;
        if (selectObject instanceof EventLogSelectObject) {
            setValue(selectObject.value);
            setOpen(false);
        }
    }, [ props.setValue ]);

    return (
        <Split>
            <SplitItem>
                <Select
                    isOpen={ isOpen }
                    variant={ SelectVariant.single }
                    onToggle={ onToggle }
                    selections={ value }
                    onSelect={ onSelect }
                >
                    { options }
                </Select>
            </SplitItem>
            { props.value === EventLogDateFilterValue.CUSTOM && (
                <SplitItem>
                    <CustomDateFilter
                        period={ props.period }
                        setPeriod={ props.setPeriod }
                        retentionDays={ props.retentionDays }
                    />
                </SplitItem>
            ) }
        </Split>
    );
};
