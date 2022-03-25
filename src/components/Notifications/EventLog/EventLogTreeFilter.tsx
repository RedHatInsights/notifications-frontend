import { Dropdown, DropdownToggle, TreeView, TreeViewDataItem } from '@patternfly/react-core';
import { TreeViewCheckProps } from '@patternfly/react-core/dist/esm/components/TreeView/TreeViewListItem';
import { AngleDownIcon } from '@patternfly/react-icons';
import produce from 'immer';
import React, { ChangeEvent } from 'react';
import { useMount } from 'react-use';

import { Schemas } from '../../../generated/OpenapiNotifications';
import { Modify } from '../../../types/Modify';
import { EventLogCustomFilter } from './usePrimaryToolbarFilterConfigWrapper';

interface ConditionalTreeFilterProps {
    groups: readonly Schemas.Facet[],
    items: readonly Schemas.Facet[],
    placeholder: string
    updateFilter: React.Dispatch<React.SetStateAction<EventLogCustomFilter>>
}

type TreeNodeItem = Modify<TreeViewDataItem, {
    id: string,
    checkProps: TreeViewCheckProps,
    children: TreeNodeItem[],
}>

interface TreeNodeData { [key: string]: TreeNodeItem }

export const EventLogTreeFilter: React.FunctionComponent<ConditionalTreeFilterProps> = (props) => {
    const [ treeNodeById, setTreeNodeById ] = React.useState<TreeNodeData>({});
    const [ isToggled, setIsToggled ] = React.useState(true);

    const treeDataArray = React.useMemo(() => !!treeNodeById ? Object.values(treeNodeById) : [], [ treeNodeById ]);

    useMount(() => {
        setTreeNodeById(produce((prev) => {
            props.groups.forEach(group => {
                prev[group.name] = {
                    id: group.name,
                    name: group.displayName,
                    checkProps: { checked: false },
                    children: props.items.map(item => ({
                        id: item.name,
                        name: item.displayName,
                        checkProps: { checked: false },
                        children: []
                    }))
                };
            });
        }));
    });

    const flattenTree = React.useCallback(() => {
        const flatTreeDataArray = [ ...treeDataArray ];
        treeDataArray.forEach(treeNode => {
            if (!!treeNode.children) {
                flatTreeDataArray.push(...treeNode.children);
            }
        });

        return flatTreeDataArray;
    }, [ treeDataArray ]);

    React.useEffect(() => {
        const currentFilters = flattenTree().filter(treeNode => !!treeNode.checkProps.checked);
        props.updateFilter({
            category: 'Application',
            chips: currentFilters.map(filter => ({
                name: filter.name as string,
                value: filter.id,
                isRead: true
            }))
        });
    }, [ flattenTree, props, treeDataArray ]);

    const isChecked = (treeNode: TreeNodeItem) => !!treeNode.checkProps.checked;
    const areSomeDescendantsChecked = (treeNode: TreeNodeItem): boolean => {
        return treeNode.children ? treeNode.children.some(child => areSomeDescendantsChecked(child)) : isChecked(treeNode);
    };

    const areAllDescendantsChecked = (treeNode: TreeNodeItem): boolean  => {
        return treeNode.children ? treeNode.children.every(child => areAllDescendantsChecked(child)) : isChecked(treeNode);
    };

    const onCheck = (event: ChangeEvent<Element>, treeNode: TreeNodeItem, parentNode: TreeNodeItem) => {
        const checked = (event.target as HTMLInputElement).checked;
        setTreeNodeById(produce((prev) => {
            if (!!parentNode) {
                const children = prev[parentNode.id].children;
                children.some(childNode => {
                    if (childNode.id === treeNode.id) {
                        childNode.checkProps.checked = checked;
                        return true;
                    }

                    return false;
                });

                if (areAllDescendantsChecked(prev[parentNode.id])) {
                    prev[parentNode.id].checkProps.checked = true;
                }
                else if (areSomeDescendantsChecked(prev[parentNode.id])) {
                    prev[parentNode.id].checkProps.checked = null;
                }
            }
            else {
                prev[treeNode.id].checkProps.checked = checked;
                prev[treeNode.id].children.forEach(leafNode => leafNode.checkProps.checked = checked);
            }
        }));
    };

    return (
        <Dropdown
            toggle={ <DropdownToggle
                onToggle={ () => setIsToggled(!isToggled) }
                toggleIndicator={ AngleDownIcon }
            >
                {props.placeholder}
            </DropdownToggle> }
            isOpen={ isToggled }
        >
            <TreeView data={ treeDataArray } hasChecks={ true } onCheck={ onCheck as any } />
        </Dropdown>
    );
};
