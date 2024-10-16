import React from 'react';
import {
  Modal,
  ModalVariant,
  Wizard,
  WizardHeader,
  WizardStep,
} from '@patternfly/react-core';
import FinalStep, { IntegrationsData } from './CustomComponents/FinalStep';
import './styling/finalWizard.scss';

interface ProgressProps {
  data: IntegrationsData;
  onClose: () => void;
}

export const FinalWizard: React.FunctionComponent<ProgressProps> = ({
  data,
  onClose,
}) => {
  const [isModalOpen, setIsModalOpen] = React.useState(true);

  return (
    <Modal
      isOpen={isModalOpen}
      variant={ModalVariant.medium}
      showClose={false}
      onEscapePress={() => setIsModalOpen(false)}
      hasNoBodyWrapper
      className="notifications"
      aria-label="notifications"
    >
      <Wizard
        height={400}
        onClose={() => {
          setIsModalOpen(false);
          onClose();
        }}
        className="src-c-wizard__progress"
        header={
          <WizardHeader
            onClose={() => {
              onClose();
              setIsModalOpen(false);
            }}
            title={`${data.isEdit ? 'Edit' : 'Create'} integration`}
            description="Configure integrations between third-party tools and the Red Hat Hybrid Cloud Console."
          />
        }
        nav={<></>}
        footer={<></>}
      >
        <WizardStep
          body={{
            hasNoPadding: true,
          }}
          name="progress"
          id="complete-wizard-step"
          steps={[
            <div key="final-step">
              <FinalStep
                data={data}
                onCancel={() => {
                  onClose();
                  setIsModalOpen(false);
                }}
              />
            </div>,
          ]}
          isHidden={true}
        ></WizardStep>
      </Wizard>
    </Modal>
  );
};
