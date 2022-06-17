import { Text, TextContent, Title } from '@patternfly/react-core';
import { global_spacer_sm } from '@patternfly/react-tokens';
import { Form, ImmutableContainerSet, ImmutableContainerSetMode } from '@redhat-cloud-services/insights-common-typescript';
import * as React from 'react';
import { Dispatch, SetStateAction } from 'react';
import { style } from 'typestyle';

import { CreateWizardStep } from '../../../../components/Notifications/BehaviorGroup/Wizard/ExtendedWizardStep';
import { SelectableEventTypeRow, SelectableEventTypeTable } from '../../../../components/Notifications/BehaviorGroup/Wizard/SelectableEventTypeTable';
import { NotificationsToolbar, SelectionCommand } from '../../../../components/Notifications/Toolbar';
import { useListNotifications } from '../../../../services/useListNotifications';
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
        const setSelectedEventTypes = props.setSelectedEventTypes;
        setSelectedEventTypes(prev => {
            switch (command) {
                case SelectionCommand.ALL:
                    return new ImmutableContainerSet([], ImmutableContainerSetMode.EXCLUDE);
                case SelectionCommand.PAGE:
                    return prev.addIterable(events.map(e => e.id));
                case SelectionCommand.NONE:
                    return new ImmutableContainerSet();
            }
        });
    }, [ props.setSelectedEventTypes, events ]);

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
            >
                <SelectableEventTypeTable
                    onSelect={ onSelect }
                    events={ eventTypesRaw.loading ? undefined : events }
                />
            </NotificationsToolbar>
        </Form>
    );
};

export const createAssociateEventTypesStep: CreateWizardStep<AssociateEventTypesStepProps> = (props: AssociateEventTypesStepProps) => ({
    name: title,
    component: <AssociateEventTypesStep { ...props } />
});
