import React from 'react';
import FormSpy from '@data-driven-forms/react-form-renderer/form-spy';
import { useIntl } from 'react-intl';
import { FormHelperText, Spinner } from '@patternfly/react-core';

export const ValidatingSpinner: React.FC<{ validating: boolean }> = ({
  validating,
}) => {
  const intl = useIntl();

  return (
    <FormHelperText hidden={!validating}>
      <Spinner size="md" className="pf-v6-u-mr-md" />
      {intl.formatMessage({
        id: 'wizard.validating',
        defaultMessage: 'Validating',
      })}
    </FormHelperText>
  );
};

export const validated = (_, { meta }) => {
  if (meta.validating) {
    return {
      // FormSpy is a fallback solution
      // FF sometimes does not set validating to 'false' on the field
      // So we need to also check the FormSpy.validating
      helperText: (
        <FormSpy>
          {({ validating }) => <ValidatingSpinner validating={validating} />}
        </FormSpy>
      ),
    };
  }

  if (meta.valid) {
    return {
      validated: 'success',
      FormGroupProps: {
        validated: 'success',
      },
    };
  }

  return {};
};
