import { Button, Dropdown, DropdownItem, DropdownToggle, ToolbarExpandIconWrapper, TreeView, TreeViewDataItem } from "@patternfly/react-core";
import { AngleDownIcon } from "@patternfly/react-icons";
import { ColumnsMetada, usePrimaryToolbarFilterConfig } from "@redhat-cloud-services/insights-common-typescript";
import React from "react";
import { useEffect, useMemo } from "react"
import { ClearEventLogFilters, EventLogFilterColumn, EventLogFilters, SetEventLogFilters } from "../components/Notifications/EventLog/EventLogFilter";
import { Schemas } from "../generated/OpenapiNotifications";

interface TreeFilterProps {
    groups: readonly Schemas.Facet[],
    items: readonly Schemas.Facet[],
    placeholder: string
}

export const TreeDropdownFilter: React.FunctionComponent<TreeFilterProps> = (props) => {
    const [isFocused, setIsFocused] = React.useState(true)
    const data: TreeViewDataItem[] = props.groups.map(group => ({
        id: group.name,
        name: group.displayName,
        checkProps: { checked: false },
        children: props.items.map(item => ({
            id: item.name,
            name: item.displayName,
            checkProps: { checked: false }
        }))

    }))

    console.log("render")
    return (
        <Dropdown
            onSelect={() => setIsFocused(!isFocused)}
            toggle={
                <DropdownToggle toggleIndicator={AngleDownIcon}>{props.placeholder}</DropdownToggle>
            }
            isOpen={isFocused}
            // dropdownItems={[<TreeView data={data} defaultAllExpanded={false} hasChecks={true}/>, <DropdownItem>Test</DropdownItem>]}
        >
            <TreeView data={data} defaultAllExpanded={false} hasChecks={true}/>
        </Dropdown>
    )
}

// Wrapper hook that gets the PrimaryToolbarFilterConfig and applies the Group type to the Application filters
// usePrimaryToolbarFilterConfig only supports 3 types: checkbox, radio, and text
export const usePrimaryToolbarFilterConfigWrapper = (bundles: readonly Schemas.Facet[], applications: readonly Schemas.Facet[], filters: EventLogFilters, setFilters: SetEventLogFilters, clearFilter: ClearEventLogFilters, metaData: ColumnsMetada<typeof EventLogFilterColumn>, filterRef?: any) => {
    const toolbarConfig = usePrimaryToolbarFilterConfig(
        EventLogFilterColumn,
        filters,
        setFilters,
        clearFilter,
        metaData
    )

    const applicationFilterConfig = useMemo(() => {
        return {
            label: "Application",
            type: "custom",
            filterValues: {
                children: <TreeDropdownFilter groups={bundles} items={applications} placeholder={"Filter by Application"}/>
            }
        }
        // return {
        //     label: "Application",
        //     type: "group",
        //     filterValues: {
        //         placeholder: "Filter by application",
        //         groups: bundles.map(bundle => ({
        //             label: bundle.displayName,
        //             value: bundle.name,
        //             type: 'checkbox',
        //             items: applications.map(application => ({
        //                 chipValue: application.displayName,
        //                 label: application.displayName,
        //                 value: application.name,
        //             }))
        //         })),
        //     }
        // }
    }, [toolbarConfig])

    // const applicationFilterConfig = {
    //     label: "Application",
    //     type: "custom",
    //     filterValues: {
    //         children: <TreeFilter groups={bundles} items={applications} placeholder={"Filter by Application"}/>
    //     }
    // }

    toolbarConfig.filterConfig.items.push(applicationFilterConfig as any)
    return toolbarConfig
}