import {
    Chip, ChipGroup,
    OptionsMenu,
    OptionsMenuItem,
    OptionsMenuToggle,
    Split,
    SplitItem
} from '@patternfly/react-core';
import { BellSlashIcon } from '@patternfly/react-icons';
import { TableText } from '@patternfly/react-table';
import { global_palette_black_400 } from '@patternfly/react-tokens';
import * as React from 'react';

import { BehaviorGroupContent } from '../../../pages/Notifications/List/useBehaviorGroupContent';
import { BehaviorGroup, NotificationBehaviorGroup } from '../../../types/Notification';
import { findById } from '../../../utils/Find';
import { emptyImmutableObject } from '../../../utils/Immutable';

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

const BehaviorGroupChip: React.FunctionComponent<BehaviorGroupChip> = props => {
    const unlink = React.useCallback(() => {
        const onSelect = props.onSelect;
        if (onSelect) {
            onSelect(props.notification, props.behaviorGroup, false);
        }
    }, [ props.onSelect, props.behaviorGroup, props.notification ]);

    return <Chip onClick={ unlink }>
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

        return props.behaviorGroupContent.content.map(bg => {
            const selected = !!props.selected.find(findById(bg.id));

            return (
                <OptionsMenuItem
                    key={ bg.id }
                    onSelect={ onSelected }
                    data-behavior-group-id={ bg.id }
                    isSelected={ selected }
                >
                    { bg.displayName }
                </OptionsMenuItem>
            );
        });
    }, [ props.behaviorGroupContent, props.selected, onSelected ]);

    const toggle = React.useMemo(() => {
        return (
            <OptionsMenuToggle onToggle={ setOpen } toggleTemplate={ (
                <ChipGroup>
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

        return props.selected.map(v => v.displayName).join(', ');
    }, [ props.selected ]);

    if (!props.isEditMode) {
        return <TableText wrapModifier="truncate"> { readonlyText } </TableText>;
    }

    return <OptionsMenu id={ props.id } direction="down" menuItems={ items } toggle={ toggle } isOpen={ isOpen } menuAppendTo={ document.body } />;
};
