import { Button, ButtonVariant, Icon, Spinner, Split, SplitItem } from '@patternfly/react-core';
import { WizardContext, WizardFooter } from '@patternfly/react-core/deprecated';
import { ExclamationCircleIcon } from '@patternfly/react-icons';
import * as React from 'react';
import { defineMessages, useIntl } from 'react-intl';

const messages = defineMessages({
  next: {
    id: 'behaviorGroup.wizard.footer.next',
    defaultMessage: 'Next',
  },
  back: {
    id: 'behaviorGroup.wizard.footer.back',
    defaultMessage: 'Back',
  },
  cancel: {
    id: 'behaviorGroup.wizard.footer.cancel',
    defaultMessage: 'Cancel',
  },
});

const ARIA_DISABLED_TRUE = 'true';

export interface BehaviorGroupWizardFooterProps {
  isLoading: boolean;
  error?: string;
  onNext: (goNext: () => void) => void;
  onBack: (goBack: () => void) => void;
}

export const BehaviorGroupWizardFooter: React.FunctionComponent<BehaviorGroupWizardFooterProps> = (
  props
) => {
  const intl = useIntl();
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
          'aria-disabled': ARIA_DISABLED_TRUE,
        })}
      >
        {wizardContext.activeStep.nextButtonText ?? intl.formatMessage(messages.next)}
      </Button>
      {!wizardContext.activeStep.hideBackButton && (
        <Button
          variant={ButtonVariant.secondary}
          onClick={onBack}
          isDisabled={wizardContext.activeStep.id === 0 || props.isLoading}
          className="pf-v6-u-ml-xs"
        >
          {intl.formatMessage(messages.back)}
        </Button>
      )}
      {!wizardContext.activeStep.hideCancelButton && (
        <Button
          variant={ButtonVariant.link}
          onClick={wizardContext.onClose}
          isDisabled={props.isLoading}
        >
          {intl.formatMessage(messages.cancel)}
        </Button>
      )}
      {props.isLoading ? (
        <div className="pf-v6-u-mt-auto pf-v6-u-mb-md">
          <Spinner size="md" />
        </div>
      ) : (
        props.error && (
          <Split>
            <SplitItem>
              <Icon status="danger" className="pf-v6-u-mr-xs">
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
