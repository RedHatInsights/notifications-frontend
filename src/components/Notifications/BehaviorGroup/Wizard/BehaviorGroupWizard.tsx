import { Wizard } from '@patternfly/react-core';
import { Form,Formik } from 'formik';
import * as React from 'react';

import { BehaviorGroupWizardFooter } from './BehaviorGroupWizardFooter';
import { ExtendedWizardStep } from './ExtendedWizardStep';

interface BehaviorGroupWizardProps {
    steps: Array<ExtendedWizardStep>;
}

export const BehaviorGroupWizard: React.FunctionComponent<BehaviorGroupWizardProps> = props => {
    return <Formik
        onSubmit={ () => { console.log('onsubmit'); } }
        initialValues={ {} }
    >
        <Form>
            <Wizard
                title="Create behavior group"
                steps={ props.steps }
                footer={ <BehaviorGroupWizardFooter isLoading={ false } onNext={ () => {} }  /> }
                isOpen={ true }
            />
        </Form>
    </Formik>;
};
