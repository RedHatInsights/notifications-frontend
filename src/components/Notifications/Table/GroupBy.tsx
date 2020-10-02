import * as React from 'react';
import { Dropdown, DropdownItem, DropdownToggle } from '@patternfly/react-core';
import { CaretDownIcon } from '@patternfly/react-icons';
import camelcase from 'camelcase';
import { GroupByEnum } from '../Types';

export interface GroupByProps {
    groupBy: (selected: GroupByEnum) => void;
    selected: GroupByEnum;
}

export const GroupBy: React.FunctionComponent<GroupByProps> = (props) => {
    const items = [
        <DropdownItem data-group-by={ GroupByEnum.Application } key="application">Application (broken)</DropdownItem>,
        <DropdownItem data-group-by={ GroupByEnum.None } key="none">None</DropdownItem>
    ];

    const [ isOpen, setOpen ] = React.useState<boolean>(false);

    const onSelect = React.useCallback((event) => {
        const groupBy = props.groupBy;
        const selected = props.selected;

        if (event.target.dataset.groupBy !== selected) {
            switch (event.target.dataset.groupBy) {
                case GroupByEnum.Application:
                    groupBy(GroupByEnum.Application);
                    break;
                case GroupByEnum.None:
                    groupBy(GroupByEnum.None);
                    break;
            }
        }

        setOpen(false);
    }, [ props.groupBy, props.selected ]);

    const onToggle = React.useCallback((shouldBeOpen) => {
        setOpen(shouldBeOpen);
    }, [ setOpen ]);

    const content = React.useMemo(() => {
        return `Group by: ${camelcase(props.selected, {
            pascalCase: true
        })}`;
    }, [ props.selected ]);

    return (
        <Dropdown
            onSelect={ onSelect }
            isOpen={ isOpen }
            toggle={ <DropdownToggle
                id="group-by-dropdown-toggle"
                toggleIndicator={ CaretDownIcon }
                onToggle={ onToggle }
            >
                { content }
            </DropdownToggle> }
            dropdownItems={ items }
        />
    );
};
