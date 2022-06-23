import { Text, TextContent, Title } from '@patternfly/react-core';
import { global_spacer_sm } from '@patternfly/react-tokens';
import { Form, ImmutableContainerSet, ImmutableContainerSetMode, Page } from '@redhat-cloud-services/insights-common-typescript';
import * as React from 'react';
import { Dispatch, SetStateAction } from 'react';
import { style } from 'typestyle';

import { CreateWizardStep } from '../../../../components/Notifications/BehaviorGroup/Wizard/ExtendedWizardStep';
import { SelectableEventTypeRow, SelectableEventTypeTable } from '../../../../components/Notifications/BehaviorGroup/Wizard/SelectableEventTypeTable';
import { NotificationsToolbar, SelectionCommand } from '../../../../components/Notifications/Toolbar';
import { useListNotifications, useParameterizedListNotifications } from '../../../../services/useListNotifications';
import { Facet } from '../../../../types/Notification';
import { useEventTypesPage } from '../../hooks/useEventTypesPage';

const title = 'Associate event types';

const subtitleClassName = style({
    paddingTop: global_spacer_sm.value
});

export interface AssociateEventTypesStepProps {
    applications: ReadonlyArray<Facet>;
    bundle: Facet;
    selectedEventTypes: ImmutableContainerSet<string>;
    setSelectedEventTypes: Dispatch<SetStateAction<ImmutableContainerSet<string>>>;
}

const AssociateEventTypesStep: React.FunctionComponent<AssociateEventTypesStepProps> = props => {

    const eventTypePage = useEventTypesPage(props.bundle, props.applications, false);
    const eventTypesRaw = useListNotifications(eventTypePage.pageController.page);
    const onDemandEventTypes = useParameterizedListNotifications();

    const count = React.useMemo(() => {
        const payload = eventTypesRaw.payload;
        if (payload?.status === 200) {
            return payload.value.meta.count;
        }

        return 0;
    }, [ eventTypesRaw.payload ]);

    React.useEffect(() => {
        const setSelectedEventTypes = props.setSelectedEventTypes;
        setSelectedEventTypes(new ImmutableContainerSet());
    }, [ eventTypePage.filters, props.setSelectedEventTypes ]);

    const events = React.useMemo<ReadonlyArray<SelectableEventTypeRow>>(() => {
        if (eventTypesRaw.payload?.type === 'eventTypesArray') {
            return eventTypesRaw.payload.value.data.map(value => ({
                id: value.id,
                isSelected: props.selectedEventTypes.contains(value.id),
                application: value.applicationDisplayName,
                eventType: value.eventTypeDisplayName
            }));
        }

        return [];
    }, [ eventTypesRaw.payload, props.selectedEventTypes ]);

    const onSelect = React.useCallback((isSelected: boolean, eventTypeId: string) => {
        const setSelectedEventTypes = props.setSelectedEventTypes;
        setSelectedEventTypes(prev => {
            if (isSelected) {
                return prev.add(eventTypeId);
            } else {
                return prev.remove(eventTypeId);
            }
        });
    }, [ props.setSelectedEventTypes ]);

    const onSelectCommand = React.useCallback((command: SelectionCommand) => {
        const currentPage = eventTypePage.pageController.page;
        const setSelectedEventTypes = props.setSelectedEventTypes;
        setSelectedEventTypes(prev => {
            switch (command) {
                case SelectionCommand.ALL:
                    if (count === events.length) {
                        return prev.addIterable(events.map(e => e.id));
                    } else {

                        const asyncUpdate = async () => {
                            let pageIndex = 1;
                            let updated = prev;
                            const lastPage = Page.lastPageForElements(count, currentPage.size);
                            while (true) {
                                const fetchingPage = currentPage.withPage(pageIndex);

                                if (fetchingPage.index > lastPage.index) {
                                    break;
                                }

                                if (currentPage.index === fetchingPage.index) {
                                    updated = updated.addIterable(events.map(e => e.id));
                                } else {
                                    const events = await onDemandEventTypes.query(currentPage.withPage(pageIndex));
                                    if (events.payload?.type === 'eventTypesArray') {
                                        updated = updated.addIterable(events.payload.value.data.map(v => v.id));
                                    } else {
                                        break;
                                    }
                                }

                                pageIndex++;
                            }

                            setSelectedEventTypes(updated);
                        };

                        asyncUpdate();
                    }

                    return prev;
                    // return new ImmutableContainerSet([], ImmutableContainerSetMode.EXCLUDE);
                case SelectionCommand.PAGE:
                    return prev.addIterable(events.map(e => e.id));
                case SelectionCommand.NONE:
                    return new ImmutableContainerSet();
            }
        });
    }, [ props.setSelectedEventTypes, events, onDemandEventTypes, eventTypePage.pageController.page, count ]);

    return (
        <Form>
            <div>
                <Title
                    headingLevel="h4"
                    size="xl"
                >
                    { title }
                </Title>
                <TextContent className={ subtitleClassName }>
                    <Text>Select event types you would like to assign this behavior group to.</Text>
                </TextContent>
            </div>
            <NotificationsToolbar
                filters={ eventTypePage.filters }
                setFilters={ eventTypePage.setFilters }
                clearFilter={ eventTypePage.clearFilters }
                appFilterOptions={ props.applications }
                pageAdapter={ eventTypePage.pageController }
                count={ count }
                onSelectionChanged={ onSelectCommand }
                selectedCount={ props.selectedEventTypes.size(count) }
                bulkSelectionDisabled={ onDemandEventTypes.loading }
            >
                <SelectableEventTypeTable
                    onSelect={ onSelect }
                    events={ eventTypesRaw.loading ? undefined : events }
                    selectionLoading={ onDemandEventTypes.loading }
                />
            </NotificationsToolbar>
        </Form>
    );
};

export const useAssociateEventTypesStep: CreateWizardStep<AssociateEventTypesStepProps> = (props: AssociateEventTypesStepProps) => {

    return {
        name: title,
        component: <AssociateEventTypesStep { ...props } />
    };
};
