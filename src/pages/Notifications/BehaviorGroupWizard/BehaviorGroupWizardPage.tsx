import * as React from 'react';

import { BehaviorGroupWizard } from '../../../components/Notifications/BehaviorGroup/Wizard/BehaviorGroupWizard';
import { Facet } from '../../../types/Notification';
import { useSteps } from './useSteps';
import { ImmutableContainerSet } from '@redhat-cloud-services/insights-common-typescript';

interface BehaviorGroupWizardProps {
    bundle: Facet;
    applications: ReadonlyArray<Facet>;
}

export const BehaviorGroupWizardPage: React.FunctionComponent<BehaviorGroupWizardProps> = props => {

    const [ selectedEventTypes, setSelectedEventTypes ] = React.useState<ImmutableContainerSet<string>>(() => {
        return new ImmutableContainerSet<string>();
    });

    const associateEventTypeStepProps = {
        bundle: props.bundle,
        applications: props.applications,
        selectedEventTypes,
        setSelectedEventTypes
    };

    const steps = useSteps(associateEventTypeStepProps);

    return <BehaviorGroupWizard
        steps={ steps }
    />;
};
