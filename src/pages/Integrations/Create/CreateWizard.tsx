import componentMapper from '@data-driven-forms/pf4-component-mapper/component-mapper';
import Pf4FormTemplate from '@data-driven-forms/pf4-component-mapper/form-template';
import FormRenderer from '@data-driven-forms/react-form-renderer/form-renderer';
import * as React from 'react';

import Review from './Review';
import CardSelect from './CardSelect';
import InlineAlert from './CustomComponents/InlineAlert';
import { schema } from './schema';

export const SUMMARY = 'summary-content';
export const CARD_SELECT = 'card-select';
export const INLINE_ALERT = 'inline-alert';
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
    [SUMMARY]: Review,
    [CARD_SELECT]: CardSelect,
    [INLINE_ALERT]: InlineAlert,
  };
  React.useEffect(() => {
    console.log(`Active category: ${category}`);
  }, [category]);

  return isOpen ? (
    <FormRenderer
      schema={schema(category)}
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
