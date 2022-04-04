import { Dropdown, DropdownToggle, TreeView, TreeViewDataItem } from '@patternfly/react-core';
import { TreeViewCheckProps } from '@patternfly/react-core/dist/esm/components/TreeView/TreeViewListItem';
import { AngleDownIcon } from '@patternfly/react-icons';
import produce from 'immer';
import React, { ChangeEvent } from 'react';

import { Schemas } from '../../../generated/OpenapiNotifications';
import { Modify } from '../../../types/Modify';
import { EventLogCustomFilter } from './usePrimaryToolbarFilterConfigWrapper';

interface EventLogTreeFilterProps {
    groups: readonly Schemas.Facet[]
    items: readonly Schemas.Facet[]
    placeholder: string
    filters: EventLogCustomFilter[]
    updateFilters: React.Dispatch<React.SetStateAction<EventLogCustomFilter[]>>
}

type TreeNodeItem = Modify<TreeViewDataItem, {
    id: string,
    checkProps: TreeViewCheckProps,
    children?: TreeNodeItem[] | undefined,
}>

interface TreeNodeDict { [key: string]: TreeNodeItem }

const isChecked = (treeNode: TreeNodeItem) => {
    return !!treeNode.checkProps.checked;
};

const childChecked = (treeNode: TreeNodeItem): boolean => {
    return treeNode.children ? treeNode.children.some(child => childChecked(child)) : isChecked(treeNode);
};

const allChildrenChecked = (treeNode: TreeNodeItem): boolean  => {
    return treeNode.children ? treeNode.children.every(child => allChildrenChecked(child)) : isChecked(treeNode);
};

const initTreeNodeById = (groups: readonly Schemas.Facet[], items: readonly Schemas.Facet[], filters: EventLogCustomFilter[]) => {
    const init: TreeNodeDict = {};
    groups.forEach(group => {
        const currentFilter = filters.find(filter => filter.bundleId === group.name);

        const currentFilterChipValues = currentFilter?.chips.map(chip => chip.value);
        const checkAll = items.every(item => !!currentFilterChipValues?.includes(item.name));
        init[group.name] = {
            id: group.name,
            name: group.displayName,
            checkProps: { checked: checkAll || (!currentFilter ? false : null) },
            children: items.map(item => ({
                id: item.name,
                name: item.displayName,
                checkProps: { checked: checkAll || currentFilterChipValues?.includes(item.name) }
            }))
        };
    });

    return init;
};

export const EventLogTreeFilter: React.FunctionComponent<EventLogTreeFilterProps> = (props) => {
    const { groups, items, placeholder, filters, updateFilters } = props;

    const [ treeNodeById, setTreeNodeById ] = React.useState<TreeNodeDict>({});
    const [ isToggled, setIsToggled ] = React.useState(false);

    const treeDataArray = React.useMemo(() => !!treeNodeById ? Object.values(treeNodeById) : [], [ treeNodeById ]);

    React.useEffect(() => {
        if (groups.length !== 0 && items.length !== 0) {
            setTreeNodeById(produce((prev) => {
                const keys = Object.keys(prev);
                if (keys.length === 0 && filters.length === 0 || filters.length) {
                    return initTreeNodeById(groups, items, filters);
                }
                else if (filters.length === 0) {
                    if (keys.every(key => prev[key].checkProps.checked === false)) {
                        return prev;
                    }

                    return initTreeNodeById(groups, items, filters);
                }

                filters.forEach(activeFilter => {
                    const treeNode = prev[activeFilter.bundleId];
                    const activeChips = activeFilter.chips.map(chip => chip.value);

                    treeNode.children?.forEach(childNode => {
                        childNode.checkProps.checked = activeChips.includes(childNode.id);
                    });

                    if (allChildrenChecked(treeNode)) {
                        treeNode.checkProps.checked = true;
                    }
                    else if (childChecked(treeNode)) {
                        treeNode.checkProps.checked = null;
                    }
                    else {
                        treeNode.checkProps.checked = false;
                    }
                });
            }));
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ groups, items, filters ]);

    const flattenTree = React.useCallback(() => {
        const flatTreeDataArray = produce(treeDataArray, (prev) => {
            prev.forEach(treeNode => {
                if (!!treeNode.children) {
                    prev.push(...treeNode.children);
                }
            });
        });

        return flatTreeDataArray;
    }, [ treeDataArray ]);

    React.useEffect(() => {
        const activeParentFilters = flattenTree().filter(treeNode => {
            const isActive = treeNode.checkProps.checked;
            return (!!isActive || isActive === null) && !!treeNode.children;
        });

        updateFilters(produce((prev) => {
            if (prev.length === 0 && activeParentFilters.length === 0) {
                return prev;
            }

            else if (prev.length !== 0 && activeParentFilters.length === 0) {
                return [];
            }

            const newCustomFilters = activeParentFilters.map(parentFilter => ({
                bundleId: parentFilter.id,
                category: parentFilter.name as string,
                chips: parentFilter.children?.filter(childNode => !!childNode.checkProps.checked).map(childFilter => ({
                    name: childFilter.name as string,
                    value: childFilter.id,
                    isRead: true
                }))
            } as EventLogCustomFilter));

            const areEqual = newCustomFilters.every((entry, idx) => {
                if (!!prev[idx]) {
                    const prevChips = prev[idx].chips.map(chip => chip.value);
                    if (entry.bundleId === prev[idx].bundleId && entry.chips.every(chip => prevChips.includes(chip.value))) {
                        return true;
                    }
                }

                return false;
            });

            return areEqual ? prev : newCustomFilters;
        }));
    }, [ flattenTree, updateFilters ]);

    const onCheck = (event: ChangeEvent<Element>, treeNode: TreeNodeItem, parentNode: TreeNodeItem) => {
        const checked = (event.target as HTMLInputElement).checked;
        setTreeNodeById(produce((prev) => {
            if (!!parentNode) {
                const children = prev[parentNode.id].children;
                children?.some(childNode => {
                    if (childNode.id === treeNode.id) {
                        childNode.checkProps.checked = checked;
                        return true;
                    }

                    return false;
                });

                if (allChildrenChecked(prev[parentNode.id])) {
                    prev[parentNode.id].checkProps.checked = true;
                }
                else if (childChecked(prev[parentNode.id])) {
                    prev[parentNode.id].checkProps.checked = null;
                }
                else {
                    prev[parentNode.id].checkProps.checked = checked;
                }
            }
            else {
                prev[treeNode.id].checkProps.checked = checked;
                prev[treeNode.id].children?.forEach(leafNode => leafNode.checkProps.checked = checked);
            }
        }));
    };

    return (
        <Dropdown
            toggle={ <DropdownToggle
                onToggle={ () => setIsToggled(!isToggled) }
                toggleIndicator={ AngleDownIcon }
            >
                {placeholder}
            </DropdownToggle> }
            isOpen={ isToggled }
        >
            <TreeView data={ treeDataArray } hasChecks={ true } onCheck={ onCheck as any } />
        </Dropdown>
    );
};
