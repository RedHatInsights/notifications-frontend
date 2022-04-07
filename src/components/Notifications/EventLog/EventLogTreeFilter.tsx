import { Dropdown, DropdownToggle, TreeView, TreeViewDataItem } from '@patternfly/react-core';
import { TreeViewCheckProps } from '@patternfly/react-core/dist/esm/components/TreeView/TreeViewListItem';
import { AngleDownIcon } from '@patternfly/react-icons';
import produce from 'immer';
import React, { ChangeEvent } from 'react';

import { Schemas } from '../../../generated/OpenapiNotifications';
import { Modify } from '../../../types/Modify';
import { areEqual } from '../../../utils/Arrays';
import { EventLogCustomFilter } from './usePrimaryToolbarFilterConfigWrapper';

interface EventLogTreeFilterProps {
    groups: readonly Schemas.Facet[]
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

const initTreeNodeById = (groups: readonly Schemas.Facet[], filters: EventLogCustomFilter[]) => {
    const init: TreeNodeDict = {};
    groups.forEach(group => {
        const currentFilter = filters.find(filter => filter.bundleId === group.name);
        const currentFilterChipValues = currentFilter?.chips?.map(chip => chip.value);

        const items = group.children as Schemas.Facet[];
        const checkAll = items.length !== 0 ? items.every(item => currentFilterChipValues?.includes(item.name)) : false;
        init[group.name] = {
            id: group.name,
            name: group.displayName,
            checkProps: { checked: checkAll || (!currentFilter ? false : null) },
            children: items.length !== 0 ? items.map(item => ({
                id: item.name,
                name: item.displayName,
                checkProps: { checked: checkAll || currentFilterChipValues?.includes(item.name) }
            })) : undefined
        };
    });

    return init;
};

export const EventLogTreeFilter: React.FunctionComponent<EventLogTreeFilterProps> = (props) => {
    const { groups, placeholder, filters, updateFilters } = props;

    const initialize = React.useMemo(() => initTreeNodeById(groups, filters), [ groups, filters ]);

    const [ treeNodeById, setTreeNodeById ] = React.useState<TreeNodeDict>(initialize);
    const [ isToggled, setIsToggled ] = React.useState(false);

    const treeDataArray = React.useMemo(() => treeNodeById ? Object.values(treeNodeById) : [], [ treeNodeById ]);

    React.useEffect(() => {
        if (groups.length !== 0) {
            setTreeNodeById(produce((prev) => {
                if (Object.keys(prev).length === 0) {
                    return initialize;
                } else if (filters.length === 0) {
                    return initialize;
                } else {
                    filters.forEach(activeFilter => {
                        const treeNode = prev[activeFilter.bundleId];
                        const activeChips = activeFilter.chips.map(chip => chip.value);

                        treeNode.children?.forEach(childNode => {
                            childNode.checkProps.checked = activeChips.includes(childNode.id);
                        });

                        if (allChildrenChecked(treeNode)) {
                            treeNode.checkProps.checked = true;
                        } else if (childChecked(treeNode)) {
                            treeNode.checkProps.checked = null;
                        } else {
                            treeNode.checkProps.checked = false;
                        }
                    });
                }
            }));
        }
    }, [ groups, filters, initialize ]);

    const flattenTree = React.useMemo(() => {
        const flatTreeDataArray = produce(treeDataArray, (prev) => {
            prev.forEach(treeNode => {
                if (treeNode.children) {
                    prev.push(...treeNode.children);
                }
            });
        });

        return flatTreeDataArray;
    }, [ treeDataArray ]);

    React.useEffect(() => {
        const groupNames = groups.map(group => group.name);
        const activeParentFilters = flattenTree.filter(treeNode => {
            const isActive = treeNode.checkProps.checked;
            return (isActive || isActive === null) && groupNames.includes(treeNode.id);
        });

        updateFilters(produce((prev) => {
            if (prev.length === 0 && activeParentFilters.length === 0) {
                return prev;
            } else if (prev.length !== 0 && activeParentFilters.length === 0) {
                return [];
            } else {
                const newCustomFilters = activeParentFilters.map(parentFilter => ({
                    bundleId: parentFilter.id,
                    category: parentFilter.name as string,
                    chips: parentFilter.children?.filter(childNode => childNode.checkProps.checked).map(childFilter => ({
                        name: childFilter.name as string,
                        value: childFilter.id,
                        isRead: true
                    }))
                ??
                    [
                        {
                            name: parentFilter.name,
                            value: parentFilter.id,
                            isRead: true
                        }
                    ]
                } as EventLogCustomFilter));

                const prevBundles = prev.map(prevFilter => prevFilter.bundleId);
                const currBundles = newCustomFilters.map(customFilter => customFilter.bundleId);

                const areBundlesEqual = areEqual(prevBundles, currBundles);
                const areFiltersEqual = areBundlesEqual && newCustomFilters.every((entry, idx) => {
                    if (prev[idx]) {
                        if (entry.bundleId === prev[idx].bundleId) {
                            const prevChips = prev[idx].chips.map(chip => chip.value);
                            const currChips = entry.chips.map(chip => chip.value);

                            return areEqual(prevChips, currChips, true);
                        }
                    }

                    return false;
                });

                return areFiltersEqual ? prev : newCustomFilters;
            }
        }));
    }, [ groups, flattenTree, updateFilters ]);

    const onCheck = (event: ChangeEvent<HTMLInputElement>, treeNode: TreeNodeItem, parentNode: TreeNodeItem) => {
        const checked = event.target.checked;
        setTreeNodeById(produce((prev) => {
            if (parentNode) {
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
                } else if (childChecked(prev[parentNode.id])) {
                    prev[parentNode.id].checkProps.checked = null;
                } else {
                    prev[parentNode.id].checkProps.checked = checked;
                }
            } else {
                prev[treeNode.id].checkProps.checked = checked;
                prev[treeNode.id].children?.forEach(leafNode => leafNode.checkProps.checked = checked);
            }
        }));
    };

    const onCheckWrapper = (event: ChangeEvent<Element>, treeNode: TreeViewDataItem, parentNode: TreeViewDataItem) => {
        onCheck(event as ChangeEvent<HTMLInputElement>, treeNode as TreeNodeItem, parentNode as TreeNodeItem);
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
            <TreeView data={ treeDataArray } hasChecks={ true } onCheck={ onCheckWrapper } />
        </Dropdown>
    );
};
