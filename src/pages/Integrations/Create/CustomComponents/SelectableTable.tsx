import React, { useEffect, useState } from 'react';
import useFieldApi, {
  UseFieldApiProps,
} from '@data-driven-forms/react-form-renderer/use-field-api';
import { AssociateEventTypesStep } from '../../../Notifications/BehaviorGroupWizard/Steps/AssociateEventTypesStep';
import { EventType, Facet } from '../../../../types/Notification';
import useFormApi from '@data-driven-forms/react-form-renderer/use-form-api';
import FormSpy from '@data-driven-forms/react-form-renderer/form-spy';
import { getBundleFacets } from '../../../../api/helpers/notifications/bundle-facets-helper';
import {
  Bullseye,
  EmptyState,
  EmptyStateBody,
  EmptyStateHeader,
  EmptyStateIcon,
} from '@patternfly/react-core';
import CubesIcon from '@patternfly/react-icons/dist/dynamic/icons/cube-icon';

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

const SelectableTable = (props) => {
  const [allBundles, setAllBundles] = useState<Facet[] | undefined>();
  const { getState } = useFormApi();
  const { input } = useFieldApi<Record<string, unknown>>(props);
  let value: readonly EventType[] = [];
  const productFamily = getState().values[props.bundleFieldName];
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

  return currBundle ? (
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
      <EmptyState>
        <EmptyStateHeader
          titleText="Select product family"
          headingLevel="h4"
          icon={<EmptyStateIcon icon={CubesIcon} />}
        />
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
