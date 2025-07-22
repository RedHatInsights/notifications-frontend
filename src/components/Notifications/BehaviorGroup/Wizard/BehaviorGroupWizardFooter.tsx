import {
  Button,
  ButtonVariant,
  Icon,
  Spinner,
  Split,
  SplitItem,
} from '@patternfly/react-core';
import { WizardContext, WizardFooter } from '@patternfly/react-core/deprecated';
import { ExclamationCircleIcon } from '@patternfly/react-icons';
import * as React from 'react';
export interface BehaviorGroupWizardFooterProps {
  isLoading: boolean;
  error?: string;
  onNext: (goNext: () => void) => void;
  onBack: (goBack: () => void) => void;
}

export const BehaviorGroupWizardFooter: React.FunctionComponent<
  BehaviorGroupWizardFooterProps
> = (props) => {
  const wizardContext = React.useContext(WizardContext);

  const onNext = () => {
    props.onNext(wizardContext.onNext);
  };

  const onBack = () => {
    props.onBack(wizardContext.onBack);
  };

  return (
    <WizardFooter>
      <Button
        variant={ButtonVariant.primary}
        type="submit"
        onClick={onNext}
        isDisabled={props.isLoading || !wizardContext.activeStep.enableNext}
        {...((props.isLoading || !wizardContext.activeStep.enableNext) && {
          'aria-disabled': 'true',
        })}
      >
        {wizardContext.activeStep.nextButtonText ?? 'Next'}
      </Button>
      {!wizardContext.activeStep.hideBackButton && (
        <Button
          variant={ButtonVariant.secondary}
          onClick={onBack}
          isDisabled={wizardContext.activeStep.id === 0 || props.isLoading}
        >
          Back
        </Button>
      )}
      {!wizardContext.activeStep.hideCancelButton && (
        <Button
          variant={ButtonVariant.link}
          onClick={wizardContext.onClose}
          isDisabled={props.isLoading}
        >
          Cancel
        </Button>
      )}
      {props.isLoading ? (
        <div className="pf-v5-u-mt-auto pf-v5-u-mb-md">
          <Spinner size="md" />
        </div>
      ) : (
        props.error && (
          <Split>
            <SplitItem>
              <Icon status="danger" className="pf-v5-u-mr-xs">
                <ExclamationCircleIcon />
              </Icon>
            </SplitItem>
            <SplitItem>{props.error}</SplitItem>
          </Split>
        )
      )}
    </WizardFooter>
  );
};
