import React, { useEffect, useState } from 'react';
import useFieldApi, {
  UseFieldApiProps,
} from '@data-driven-forms/react-form-renderer/use-field-api';
import { AssociateEventTypesStep } from '../../../Notifications/BehaviorGroupWizard/Steps/AssociateEventTypesStep';
import { EventType, Facet } from '../../../../types/Notification';
import useFormApi from '@data-driven-forms/react-form-renderer/use-form-api';
import FormSpy from '@data-driven-forms/react-form-renderer/form-spy';
import { getBundleFacets } from '../../../../api/helpers/notifications/bundle-facets-helper';
import { Bullseye, EmptyState, EmptyStateBody } from '@patternfly/react-core';
import CubesIcon from '@patternfly/react-icons/dist/dynamic/icons/cube-icon';
import { getEndpoint } from '../../../../api/helpers/integrations/endpoints-helper';

const BUNDLE_DEFAULTS = {
  OpenShift: {},
  'Red Hat Enterprise Linux': {},
  Console: {},
} as const;

type EventBundle = keyof typeof BUNDLE_DEFAULTS;

interface EventTypeMapping {
  eventTypeDisplayName: string;
  applicationDisplayName: string;
  description: string;
  id: string;
  isSelected: boolean;
}

export interface TableRow {
  id: string;
  [key: string]: unknown;
}

function isEvent(data: unknown): data is Record<string, EventType> {
  return Object.values(data || {}).every((event) =>
    Object.prototype.hasOwnProperty.call(event, 'id')
  );
}

function isEventReadonly(
  data: Record<string, unknown>
): data is Record<string, Record<string, EventType>> {
  return Object.values(data).every(
    (item) =>
      isEvent(item) &&
      Object.values(item).every((event) =>
        Object.prototype.hasOwnProperty.call(event, 'id')
      )
  );
}

export interface SelectableTableProps<T extends TableRow>
  extends UseFieldApiProps<T[]> {
  name: string;
  data?: ReadonlyArray<T>;
  columns: { name: string; key: string }[];
  onSelect?: (isSelected: boolean, row: T) => void;
  selectionLoading?: boolean;
  skeletonRows?: number;
}

interface EventTypeFromGroup {
  bundle: {
    display_name: string;
  };
  display_name: string;
  application: {
    display_name: string;
  };
  description: string;
  id: string;
  isSelected: boolean;
}

const SelectableTable = (props) => {
  const [allBundles, setAllBundles] = useState<Facet[] | undefined>();
  const { getState } = useFormApi();
  const { input } = useFieldApi<Record<string, unknown>>(props);
  const [loaded, setLoaded] = useState<boolean>(false);
  let value: readonly EventType[] = [];
  const productFamily = getState().values[props.bundleFieldName];
  const integrationId = getState().values['id'];

  useEffect(() => {
    const getAllBundles = async () => {
      const bundles: Facet[] = await getBundleFacets({
        includeApplications: true,
      });
      setAllBundles(bundles);
    };
    getAllBundles();
  }, []);

  const currBundle = allBundles?.find(({ name }) => name === productFamily);

  if (currBundle?.displayName && isEventReadonly(input.value)) {
    value = Object.values(
      input.value?.[currBundle?.displayName] || {}
    ) as readonly EventType[];
  }

  const createEventTypeMapping = (
    event: EventTypeFromGroup
  ): EventTypeMapping => ({
    eventTypeDisplayName: event.display_name,
    applicationDisplayName: event.application.display_name,
    description: event.description,
    id: event.id,
    isSelected: true,
  });

  const mapEventTypesToInput = (events: EventTypeFromGroup[]) => {
    return events.reduce(
      (acc, event) => {
        const bundleName = event.bundle.display_name as EventBundle;
        return {
          ...acc,
          [bundleName]: {
            ...acc[bundleName],
            [event.id]: createEventTypeMapping(event),
          },
        };
      },
      { ...BUNDLE_DEFAULTS }
    );
  };

  React.useEffect(() => {
    if (!integrationId) {
      setLoaded(true);
      return;
    }

    const getEventData = async () => {
      const data = await getEndpoint(integrationId);
      const eventGroups = data.event_types_group_by_bundles_and_applications;

      if (!eventGroups) {
        input.onChange(BUNDLE_DEFAULTS);
        setLoaded(true);
        return;
      }

      const eventTypes = eventGroups.flatMap(({ applications, ...bundle }) =>
        applications.flatMap(({ event_types, ...application }) =>
          event_types.map((event) => ({ ...event, application, bundle }))
        )
      );

      input.onChange(mapEventTypesToInput(eventTypes));
      setLoaded(true);
    };

    getEventData();
  }, [input, integrationId, mapEventTypesToInput]);

  return currBundle && loaded ? (
    <AssociateEventTypesStep
      applications={currBundle.children as readonly Facet[]}
      bundle={currBundle}
      setValues={(events) => {
        input.onChange({
          ...input.value,
          [currBundle?.displayName]: {
            ...events,
          },
        });
      }}
      values={{ events: value }}
    />
  ) : (
    <Bullseye>
      <EmptyState
        headingLevel="h4"
        icon={CubesIcon}
        titleText="Select product family"
      >
        <EmptyStateBody>
          Before you can assign events to integration you have to select from
          which bundle events should be assignable.
        </EmptyStateBody>
      </EmptyState>
    </Bullseye>
  );
};

const SelectableTableWrapper = (props) => (
  <FormSpy subscription={{ values: true }}>
    {() => <SelectableTable {...props} />}
  </FormSpy>
);

export default SelectableTableWrapper;
