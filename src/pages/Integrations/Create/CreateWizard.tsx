import componentMapper from '@data-driven-forms/pf4-component-mapper/component-mapper';
import Pf4FormTemplate from '@data-driven-forms/pf4-component-mapper/form-template';
import FormRenderer from '@data-driven-forms/react-form-renderer/form-renderer';
import * as React from 'react';

import Review from './Review';
import { schema } from './schema';

export interface CreateWizardProps {
  category?: string;
  isOpen: boolean;
  closeModal: () => void;
}

export const CreateWizard: React.FunctionComponent<CreateWizardProps> = ({
  isOpen,
  closeModal,
  category,
}: CreateWizardProps) => {
  const mapperExtension = {
    'summary-content': Review,
  };

  React.useEffect(() => {
    console.log(`Active category: ${category}`);
  }, [category]);

  return isOpen ? (
    <FormRenderer
      schema={schema}
      FormTemplate={Pf4FormTemplate}
      componentMapper={{ ...componentMapper, ...mapperExtension }}
      onSubmit={(props) => {
        console.log(props);
        closeModal();
      }}
      onCancel={() => closeModal()}
    />
  ) : null;
};
