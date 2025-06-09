import * as React from 'react';
import { FieldInputProps, useField } from 'formik';
import {
  Text,
  TextVariants,
} from '@patternfly/react-core/dist/dynamic/components/Text';
import {
  TextInput as PFTextInput,
  TextInputProps,
} from '@patternfly/react-core/dist/dynamic/components/TextInput';
import {
  FormGroup,
  FormHelperText,
} from '@patternfly/react-core/dist/dynamic/components/Form';
import {
  Checkbox as PFCheckbox,
  CheckboxProps as PFCheckboxProps,
} from '@patternfly/react-core/dist/dynamic/components/Checkbox';
import {
  TextArea as PFTextArea,
  TextAreaProps as PFTextAreaProps,
} from '@patternfly/react-core/dist/dynamic/components/TextArea';
import {
  FormSelect as PFFormSelect,
  FormSelectProps as PFFormSelectProps,
} from '@patternfly/react-core/dist/dynamic/components/FormSelect';
import {
  Form as PFForm,
  FormProps as PFFormProps,
} from '@patternfly/react-core/dist/dynamic/components/Form';
import {
  HelperText,
  HelperTextItem,
} from '@patternfly/react-core/dist/dynamic/components/HelperText';

import { getOuiaProps } from '../getOuiaProps';
import {
  OuiaProps,
  withoutOuiaProps,
} from '@redhat-cloud-services/frontend-components/Ouia/Ouia';

interface FormTextInputProps
  extends Omit<TextInputProps, 'onChange' | 'innerRef' | 'ouiaId'> {
  id: string;
  name: string;
  hint?: string;
  ouiaId?: string;
}

export const onChangePFAdapter = <T = React.FormEvent<HTMLInputElement>,>(
  field: FieldInputProps<T>
) => {
  return (e: T) => {
    return field.onChange(e);
  };
};

type HandleChangeType = (
  e: boolean | React.ChangeEvent<unknown>,
  maybePath?: string
) => void;

export const onChangePFAdapterCheckbox = (field: FieldInputProps<boolean>) => {
  return (value: boolean, e: React.FormEvent<HTMLInputElement>) => {
    const onChange: HandleChangeType = field.onChange;
    return onChange(value, (e.target as HTMLInputElement).name);
  };
};

export const FormTextInput: React.FunctionComponent<FormTextInputProps> = (
  props
) => {
  const { hint, ...otherProps } = props;
  const [field, meta] = useField({ ...otherProps });
  const isValid = !meta.error || !meta.touched;

  return (
    <FormGroup
      fieldId={props.id}
      isRequired={props.isRequired}
      label={props.label}
      {...getOuiaProps('FormikPatternfly/FormTextInput', props)}
    >
      <PFTextInput
        {...withoutOuiaProps(otherProps)}
        {...field}
        validated={isValid ? 'default' : 'error'}
        value={field.value !== undefined ? field.value.toString() : ''}
        onChange={onChangePFAdapter<React.FormEvent<HTMLInputElement>>(field)}
      />
      {hint && <Text component={TextVariants.small}>{hint}</Text>}
      {meta.error && (
        <FormHelperText>
          <HelperText>
            <HelperTextItem>{meta.error}</HelperTextItem>
          </HelperText>
        </FormHelperText>
      )}
    </FormGroup>
  );
};

interface CheckboxProps
  extends Omit<PFCheckboxProps, 'onChange' | 'ref' | 'ouiaId'> {
  name: string;
  isRequired?: boolean;
  ouiaId?: string;
}

export const Checkbox: React.FunctionComponent<CheckboxProps> = (props) => {
  const [field, meta] = useField({ ...props, type: 'checkbox' });
  const isValid = !meta.error || !meta.touched;

  return (
    <FormGroup
      fieldId={props.id}
      isRequired={props.isRequired}
      {...getOuiaProps('FormikPatternfly/Checkbox', props)}
    >
      <PFCheckbox
        isChecked={field.checked}
        {...withoutOuiaProps(props)}
        {...field}
        isValid={isValid}
        isRequired={props.isRequired}
        onChange={onChangePFAdapter(field)}
      />
      {meta.error && (
        <FormHelperText>
          <HelperText>
            <HelperTextItem>{meta.error}</HelperTextItem>
          </HelperText>
        </FormHelperText>
      )}
    </FormGroup>
  );
};

interface FormTextAreaProps
  extends OuiaProps,
    Omit<PFTextAreaProps, 'id' | 'name' | 'onChange'> {
  id: string;
  name: string;
}

export const FormTextArea: React.FunctionComponent<FormTextAreaProps> = (
  props
) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { innerRef, ...useFieldProps } = props;
  const [field, meta] = useField({ ...useFieldProps });
  const isValid = !meta.error || !meta.touched;

  return (
    <FormGroup
      fieldId={props.id}
      isRequired={props.isRequired}
      label={props.label}
      {...getOuiaProps('FormikPatternfly/FormTextArea', props)}
    >
      <PFTextArea
        {...withoutOuiaProps(props)}
        {...field}
        value={field.value || ''}
        validated={isValid ? 'default' : 'error'}
        isRequired={props.isRequired}
        onChange={onChangePFAdapter<React.FormEvent<HTMLTextAreaElement>>(
          field
        )}
      />
      {meta.error && (
        <FormHelperText>
          <HelperText>
            <HelperTextItem>{meta.error}</HelperTextItem>
          </HelperText>
        </FormHelperText>
      )}
    </FormGroup>
  );
};

interface FormSelectProps
  extends OuiaProps,
    Omit<PFFormSelectProps, 'onChange' | 'ref' | 'ouiaId'> {
  id: string;
  name: string;
  isRequired?: boolean;
}

export const FormSelect: React.FunctionComponent<FormSelectProps> = (props) => {
  const [field, meta] = useField({ ...props });
  const isValid = !meta.error || !meta.touched;

  return (
    <FormGroup
      fieldId={props.id}
      label={props.label}
      isRequired={props.isRequired}
      {...getOuiaProps('FormikPatternfly/FormSelect', props)}
    >
      <PFFormSelect
        {...withoutOuiaProps(props)}
        {...field}
        onChange={onChangePFAdapter<React.FormEvent<HTMLSelectElement>>(field)}
        isRequired={props.isRequired}
        validated={isValid ? 'default' : 'error'}
      >
        {props.children}
      </PFFormSelect>
      {meta.error && (
        <FormHelperText>
          <HelperText>
            <HelperTextItem>{meta.error}</HelperTextItem>
          </HelperText>
        </FormHelperText>
      )}
    </FormGroup>
  );
};

interface FormProps extends OuiaProps, PFFormProps {}

const preventDefaultHandler = (e: React.FormEvent) => e.preventDefault();

export const Form: React.FunctionComponent<FormProps> = (props) => {
  return (
    <PFForm
      onSubmit={preventDefaultHandler}
      {...withoutOuiaProps(props)}
      {...getOuiaProps('FormikPatternfly/Form', props)}
    >
      {props.children}
    </PFForm>
  );
};
