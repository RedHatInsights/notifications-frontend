import { useFormikContext } from 'formik';
import produce from 'immer';
import * as React from 'react';

import { IntegrationWizardStep } from '../../../../components/Notifications/BehaviorGroup/Wizard/ExtendedWizardStep';
import { CreateBehaviorGroup } from '../../../../types/CreateBehaviorGroup';
import { EventType, Facet } from '../../../../types/Notification';
import EventTypes from '../../../../components/Integrations/EventTypes';

const title = 'Associate event types';

export interface AssociateEventTypesStepProps {
  applications: ReadonlyArray<Facet>;
  bundle: Facet;
  setValues?: (values: Record<string, EventType>) => void;
  values?: {
    events: readonly EventType[];
  };
}

export const useAssociateEventTypesStep: IntegrationWizardStep<
  AssociateEventTypesStepProps
> = ({ applications, bundle }: AssociateEventTypesStepProps) => {
  const { setValues, values } = useFormikContext<CreateBehaviorGroup>();
  return React.useMemo(
    () => ({
      name: title,
      component: (
        <EventTypes
          applications={applications}
          currBundle={bundle}
          setSelectedEvents={(selected) => {
            if (selected) {
              const setter = produce((draft) => {
                draft.events = Object.values(selected);
              });
              setValues(setter);
            }
          }}
          selectedEvents={values.events as readonly EventType[]}
        />
      ),
    }),
    [applications, bundle] // eslint-disable-line react-hooks/exhaustive-deps
  );
};
