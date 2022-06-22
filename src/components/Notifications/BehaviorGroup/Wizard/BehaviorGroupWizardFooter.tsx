import { Button, ButtonVariant, Spinner, Split, SplitItem, WizardContext, WizardFooter } from '@patternfly/react-core';
import { ExclamationCircleIcon } from '@patternfly/react-icons';
import { global_danger_color_100 } from '@patternfly/react-tokens';
import * as React from 'react';
import { style } from 'typestyle';

export interface BehaviorGroupWizardFooterProps {
    isLoading: boolean;
    error?: string;
    onNext: (goNext: () => void) => void;
}

const contentClassName = style({
    marginTop: 'auto',
    marginBottom: 14
});

const exclamationClassName = style({
    marginRight: 5
});

export const BehaviorGroupWizardFooter: React.FunctionComponent<BehaviorGroupWizardFooterProps> = props => {
    const wizardContext = React.useContext(WizardContext);

    const onNext = () => {
        props.onNext(wizardContext.onNext);
    };

    return (
        <WizardFooter>
            <Button
                variant={ ButtonVariant.primary }
                type="submit"
                onClick={ onNext }
                isDisabled={ props.isLoading || !wizardContext.activeStep.enableNext }
            >
                { wizardContext.activeStep.nextButtonText ?? 'Next' }
            </Button>
            { !wizardContext.activeStep.hideBackButton && (
                <Button
                    variant={ ButtonVariant.secondary }
                    onClick={ wizardContext.onBack }
                    isDisabled={ wizardContext.activeStep.id === 0 || props.isLoading }
                >
                    Back
                </Button>
            ) }
            { !wizardContext.activeStep.hideCancelButton && (
                <Button
                    variant={ ButtonVariant.link }
                    onClick={ wizardContext.onClose }
                    isDisabled={ props.isLoading }
                >
                    Cancel
                </Button>
            )}
            { props.isLoading ? (
                <div className={ contentClassName }>
                    <Spinner size="md" />
                </div>
            ) : props.error && (
                <Split>
                    <SplitItem>
                        <ExclamationCircleIcon className={ exclamationClassName } color={ global_danger_color_100.value } />
                    </SplitItem>
                    <SplitItem>{ props.error }</SplitItem>
                </Split>
            )}
        </WizardFooter>
    );
};
