import {
    Chip, ChipGroup,
    OptionsMenu,
    OptionsMenuItem,
    OptionsMenuToggle,
    Split,
    SplitItem, Tooltip
} from '@patternfly/react-core';
import { BellSlashIcon, LockIcon } from '@patternfly/react-icons';
import { TableText } from '@patternfly/react-table';
import { global_palette_black_400, global_palette_black_700, global_spacer_sm, global_spacer_xs } from '@patternfly/react-tokens';
import * as React from 'react';
import { style } from 'typestyle';

import { BehaviorGroupContent } from '../../../pages/Notifications/List/useBehaviorGroupContent';
import { BehaviorGroup, NotificationBehaviorGroup } from '../../../types/Notification';
import { findById } from '../../../utils/Find';
import { emptyImmutableObject } from '../../../utils/Immutable';
import { join } from '../../../utils/ComponentUtils';

const grayFontClassName = style({
    color: global_palette_black_700.value
});

const noBehaviorGroupsClassName = style({
    textAlign: 'left'
});

const rightSpacerSm = style({
    marginRight: global_spacer_sm.value
});

const inlineSpacer = style({
    marginRight: global_spacer_xs.value
});

interface BehaviorGroupCellProps {
    id: string;
    notification: NotificationBehaviorGroup;
    behaviorGroupContent: BehaviorGroupContent;
    selected: ReadonlyArray<BehaviorGroup>;
    onSelect?: (notification: NotificationBehaviorGroup, behaviorGroup: BehaviorGroup, linkBehavior: boolean) => void;
    isEditMode: boolean;
}

interface BehaviorGroupChip {
    behaviorGroup: BehaviorGroup;
    notification: BehaviorGroupCellProps['notification'];
    onSelect?: BehaviorGroupCellProps['onSelect'];
}

const CommaSeparator: React.FunctionComponent = () => <span>, </span>;

const BehaviorGroupChip: React.FunctionComponent<BehaviorGroupChip> = props => {
    const unlink = React.useCallback(() => {
        const onSelect = props.onSelect;
        if (onSelect) {
            onSelect(props.notification, props.behaviorGroup, false);
        }
    }, [ props.onSelect, props.behaviorGroup, props.notification ]);

    return <Chip onClick={ unlink } isReadOnly={ props.behaviorGroup.isDefault } >
        { props.behaviorGroup.displayName }
    </Chip>;
};

export const BehaviorGroupCell: React.FunctionComponent<BehaviorGroupCellProps> = props => {

    const [ isOpen, setOpen ] = React.useState(false);

    const onSelected = React.useCallback((event?: React.MouseEvent<HTMLAnchorElement> | React.KeyboardEvent) => {
        const dataset = (event?.currentTarget?.firstChild as HTMLElement)?.dataset ?? emptyImmutableObject;
        const onSelect = props.onSelect;
        if (!props.behaviorGroupContent.isLoading && !props.behaviorGroupContent.hasError && onSelect) {
            if (dataset.behaviorGroupId) {
                const found = props.behaviorGroupContent.content.find(findById(dataset.behaviorGroupId));
                if (found) {
                    const isSelected = !!props.selected.find(findById(found.id));
                    onSelect(props.notification, found, !isSelected);
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

        if (props.behaviorGroupContent.content.length === 0) {
            return [
                <OptionsMenuItem key="empty" isDisabled>
                    <span className={ noBehaviorGroupsClassName }>
                        You have no behavior groups. <br />
                        Create a new group by clicking on the <br />
                        &apos;Create new group&apos; button above.
                    </span>
                </OptionsMenuItem>
            ];
        }

        const behaviorGroups = [
            ...props.selected.filter(b => b.isDefault),
            ...props.behaviorGroupContent.content.filter(b => !b.isDefault)
        ];
        return behaviorGroups.map(bg => {
            const selected = !!props.selected.find(findById(bg.id));

            return (
                <OptionsMenuItem
                    key={ bg.id }
                    onSelect={ onSelected }
                    data-behavior-group-id={ bg.id }
                    isSelected={ selected }
                    isDisabled={ bg.isDefault }
                >
                    { bg.isDefault && <LockIcon className={ rightSpacerSm } /> } { bg.displayName }
                </OptionsMenuItem>
            );
        });
    }, [ props.behaviorGroupContent, props.selected, onSelected ]);

    const sortedSelected = React.useMemo(() => [
        ...props.selected.filter(b => b.isDefault),
        ...props.selected.filter(b => !b.isDefault)
    ], [ props.selected ]);

    const toggle = React.useMemo(() => {
        return (
            <OptionsMenuToggle onToggle={ setOpen } toggleTemplate={ (
                sortedSelected.length === 0 ? (
                    <span className={ grayFontClassName }>Select behavior group</span>
                ) : (
                    <ChipGroup>
                        { sortedSelected.map(value => (
                            <BehaviorGroupChip
                                key={ value.id }
                                behaviorGroup={ value }
                                notification={ props.notification }
                                onSelect={ props.onSelect }
                            />
                        )) }
                    </ChipGroup>
                )
            ) } />
        );
    }, [ sortedSelected, props.notification, props.onSelect ]);

    const readonlyText = React.useMemo(() => {
        if (sortedSelected.length === 0) {
            return <Split>
                <SplitItem className={ rightSpacerSm }><BellSlashIcon color={ global_palette_black_400.value } /></SplitItem>
                <SplitItem>Mute</SplitItem>
            </Split>;
        }

        return join(sortedSelected.map(b => <React.Fragment key={ b.id }>
            { b.isDefault && <Tooltip
                content={ `${b.displayName} behavior is attached to this event and cannot be changed.
                Add additional behavior groups to assign different actions or recipients.` }
            >
                <LockIcon color={ global_palette_black_400.value } className={ inlineSpacer } />
            </Tooltip>} { b.displayName }
        </React.Fragment>), CommaSeparator);
    }, [ sortedSelected ]);

    if (!props.isEditMode) {
        return <TableText wrapModifier="truncate"> { readonlyText } </TableText>;
    }

    return <OptionsMenu id={ props.id } direction="down" menuItems={ items } toggle={ toggle } isOpen={ isOpen } menuAppendTo={ document.body } />;
};
