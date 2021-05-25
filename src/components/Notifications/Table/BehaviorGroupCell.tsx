import {
    Chip, ChipGroup,
    DropdownItem, fillTemplate,
    OptionsMenu,
    OptionsMenuItem,
    OptionsMenuToggle,
    Spinner,
    Split,
    SplitItem
} from '@patternfly/react-core';
import { BellSlashIcon, CheckIcon } from '@patternfly/react-icons';
import { global_active_color_100, global_icon_FontSize_sm, global_palette_black_400 } from '@patternfly/react-tokens';
import * as React from 'react';
import { style } from 'typestyle';

import { BehaviorGroupContent } from '../../../pages/Notifications/List/useBehaviorGroupContent';
import { BehaviorGroupRowElement } from '../../../pages/Notifications/List/useBehaviorGroupNotificationRows';
import { BehaviorGroup, NotificationBehaviorGroup } from '../../../types/Notification';
import { emptyImmutableObject } from '../../../utils/Immutable';

interface BehaviorGroupCellProps {
    id: string;
    notification: NotificationBehaviorGroup;
    behaviorGroupContent: BehaviorGroupContent;
    selected: ReadonlyArray<BehaviorGroupRowElement>;
    onSelect?: (linkBehavior: boolean, notification: NotificationBehaviorGroup, behaviorGroup: BehaviorGroup) => void;
    isReadOnly: boolean;
}

interface BehaviorGroupChip {
    behaviorGroup: BehaviorGroup;
    notification: BehaviorGroupCellProps['notification'];
    onSelect?: BehaviorGroupCellProps['onSelect'];
}

const optionItemClassName = style({
    textAlign: 'left',
    display: 'block'
});

const iconClassName = style({
    fontSize: global_icon_FontSize_sm.var,
    alignSelf: 'center'
});

const BehaviorGroupChip: React.FunctionComponent<BehaviorGroupChip> = props => {
    const unlink = React.useCallback(() => {
        const onSelect = props.onSelect;
        if (onSelect) {
            onSelect(false, props.notification, props.behaviorGroup);
        }
    }, [ props.onSelect, props.behaviorGroup, props.notification ]);

    return <Chip onClick={ unlink }>
        { props.behaviorGroup.displayName }
    </Chip>;
};

const numChips = 3;
const remainingTemplate  = '${remaining} more';

export const BehaviorGroupCell: React.FunctionComponent<BehaviorGroupCellProps> = props => {

    const [ isOpen, setOpen ] = React.useState(false);

    const onSelected = React.useCallback((event: React.MouseEvent<any> | React.KeyboardEvent | MouseEvent) => {
        const dataset = (event?.currentTarget?.firstChild as HTMLElement)?.dataset ?? emptyImmutableObject;
        const onSelect = props.onSelect;
        if (!props.behaviorGroupContent.isLoading && !props.behaviorGroupContent.hasError && onSelect) {
            if (dataset.behaviorGroupId) {
                const found = props.behaviorGroupContent.content.find(bg => bg.id === dataset.behaviorGroupId);
                if (found) {
                    const isSelected = !!props.selected.find(el => el.id === found.id);
                    onSelect(!isSelected, props.notification, found);
                }
            }
        }
    }, [ props.onSelect, props.behaviorGroupContent, props.notification, props.selected ]);

    const items = React.useMemo(() => {
        if (props.behaviorGroupContent.isLoading || props.behaviorGroupContent.hasError) {
            return [
                <OptionsMenuItem key="is-loading" isDisabled>Loading</OptionsMenuItem>
            ];
        }

        let anyIsLoading = false;

        return props.behaviorGroupContent.content.map(bg => {
            const selected = props.selected.find(el => el.id === bg.id);
            anyIsLoading = anyIsLoading || (selected?.isLoading ?? false);
            const showSelected = selected?.isLoading ? false : !!selected;

            return (
                <DropdownItem
                    key={ bg.id }
                    component="button"
                    onClick={ onSelected }
                    data-behavior-group-id={ bg.id }
                    isDisabled={ !props.onSelect || selected?.isLoading }
                    className={ optionItemClassName }
                >
                    <Split hasGutter>
                        <SplitItem isFilled>
                            { bg.displayName }
                        </SplitItem>
                        <SplitItem className={ iconClassName }>
                            { selected?.isLoading && <Spinner size="sm" /> }
                            { showSelected && <CheckIcon color={ global_active_color_100.value } /> }
                        </SplitItem>
                    </Split>
                </DropdownItem>
            );
        });
    }, [ props.behaviorGroupContent, props.selected, props.onSelect, onSelected ]);

    const toggle = React.useMemo(() => {
        return (
            <OptionsMenuToggle onToggle={ setOpen } toggleTemplate={ (
                <ChipGroup numChips={ numChips } collapsedText={ remainingTemplate }>
                    { props.selected.map(value => (
                        <BehaviorGroupChip key={ value.id } behaviorGroup={ value } notification={ props.notification } onSelect={ props.onSelect } />
                    )) }
                </ChipGroup>
            ) } />
        );
    }, [ props.selected, props.notification, props.onSelect ]);

    const readonlyText = React.useMemo(() => {
        if (props.selected.length === 0) {
            return <Split hasGutter>
                <SplitItem><BellSlashIcon color={ global_palette_black_400.value } /></SplitItem>
                <SplitItem>Mute</SplitItem>
            </Split>;
        }

        const first = props.selected.slice(0, numChips).map(v => v.displayName).join(', ');
        const remaining = props.selected.length > numChips ? fillTemplate(remainingTemplate, {
            remaining: props.selected.length - numChips
        }) : undefined;

        return first + (remaining ? `and ${remaining}` : '');
    }, [ props.selected ]);

    if (props.isReadOnly) {
        return <span> { readonlyText } </span>;
    }

    return <OptionsMenu id={ props.id } direction="up" menuItems={ items } toggle={ toggle } isOpen={ isOpen } menuAppendTo={ document.body } />;
};
