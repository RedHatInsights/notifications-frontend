import { Select, SelectOption, SelectOptionObject, SelectVariant } from '@patternfly/react-core';
import * as React from 'react';

export enum EventLogDateFilterValue {
    TODAY = 'today',
    YESTERDAY = 'yesterday',
    LAST_7 = 'last_7',
    LAST_14 = 'last_14'
}

const labels: Record<EventLogDateFilterValue, string> = {
    [EventLogDateFilterValue.TODAY]: 'Today',
    [EventLogDateFilterValue.YESTERDAY]: 'Yesterday',
    [EventLogDateFilterValue.LAST_7]: 'Last 7 days',
    [EventLogDateFilterValue.LAST_14]: 'Last 14 days'
};

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

export interface EventLogDateFilterProps {
    value: EventLogDateFilterValue;
    setValue: (value: EventLogDateFilterValue) => void;
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
        }
    }, [ props.setValue ]);

    return (
        <Select
            isOpen={ isOpen }
            variant={ SelectVariant.single }
            onToggle={ onToggle }
            selections={ value }
            onSelect={ onSelect }
        >
            { options }
        </Select>
    );
};
