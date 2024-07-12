import React from 'react';
import {
  Modal,
  ModalVariant,
  Wizard,
  WizardHeader,
  WizardStep,
} from '@patternfly/react-core';

export const FinalWizard = () => {
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  return (
    <Modal
      isOpen={isModalOpen}
      variant={ModalVariant.medium}
      showClose={false}
      onEscapePress={() => setIsModalOpen(false)}
      hasNoBodyWrapper
    >
      <Wizard
        height={400}
        onClose={() => setIsModalOpen(false)}
        header={
          <WizardHeader
            onClose={() => setIsModalOpen(false)}
            title="Add integration"
            description="Configure integrations between third-party tools and the Red Hat Hybrid Cloud Console."
          />
        }
      >
        <WizardStep name="Finish" id="complete-wizard-step"></WizardStep>
      </Wizard>
    </Modal>
  );
};
