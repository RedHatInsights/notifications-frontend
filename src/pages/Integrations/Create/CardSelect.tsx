/* eslint-disable @typescript-eslint/ban-types */
import React, { useState } from 'react';
import {
  FormGroup,
  FormHelperText,
  Grid,
  GridItem,
  HelperText,
  HelperTextItem,
  Tile,
} from '@patternfly/react-core';

import useFieldApi from '@data-driven-forms/react-form-renderer/use-field-api';
import useFormApi from '@data-driven-forms/react-form-renderer/use-form-api';

/**Temporarily copied from sources-ui
 * This component will soon be imported to component-groups
 */

const handleKeyPress = (event, value, onClick) => {
  const spaceBar = 32;
  if (event.charCode === spaceBar) {
    event.preventDefault();
    onClick(value);
  }
};

export interface CardSelectProps {
  multi: boolean;
  isMulti: boolean;
  label: Node;
  isRequired: boolean;
  helperText: Node;
  description: Node;
  hideLabel: boolean;
  name: string;
  mutator: Function;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  options: Array<any>;
  DefaultIcon: Node | Function | Element;
  iconMapper: Function;
  isDisabled: boolean;
  isReadOnly: boolean;
}

const CardSelect: React.FunctionComponent<CardSelectProps> = (
  originalProps
) => {
  const {
    isRequired,
    label,
    helperText,
    hideLabel,
    meta,
    input,
    options,
    mutator,
    DefaultIcon,
    iconMapper,
    ...props
  } = useFieldApi(originalProps);
  const formOptions = useFormApi();
  const [icons] = useState(() => {
    const components = {};

    options.forEach(
      ({ value }) => (components[value] = iconMapper(value, DefaultIcon))
    );

    return components;
  });

  const isMulti = props.isMulti || props.multi;
  const isDisabled = props.isDisabled || props.isReadOnly;
  const inputValue = input.value || [];

  const handleMulti = (value) =>
    input.onChange(
      inputValue.includes(value)
        ? inputValue.filter((valueSelect) => valueSelect !== value)
        : [...inputValue, value]
    );

  const handleSingle = (value) =>
    input.onChange(inputValue === value ? undefined : value);

  const handleClick = (value) =>
    isMulti ? handleMulti(value) : handleSingle(value);

  const onClick = (value) => {
    if (isDisabled) {
      return undefined;
    }

    handleClick(value);
    input.onBlur();
  };

  const prepareCards = () =>
    options
      .map((option) => mutator(option, formOptions))
      .map(({ value, label, isDisabled: itemIsDisabled }) => {
        const disabled = itemIsDisabled || isDisabled;

        if (!value) {
          return undefined;
        }

        const Component = icons[value];

        return (
          <GridItem sm={6} md={4} key={value}>
            <Tile
              className={`src-c-wizard__tile${disabled ? ' disabled' : ''}`}
              onClick={() => onClick(value)}
              tabIndex={disabled ? -1 : 0}
              onKeyPress={(e) => handleKeyPress(e, value, onClick)}
              isDisabled={disabled}
              title={label}
              isStacked
              isSelected={inputValue.includes(value)}
              {...(Component && { icon: <Component /> })}
            />
          </GridItem>
        );
      });

  const { error, touched } = meta;
  const showError = touched && error;

  return (
    <FormGroup
      isRequired={isRequired}
      label={!hideLabel && label}
      fieldId={input.name}
      helperText={helperText}
      helperTextInvalid={error}
      validated={showError ? 'error' : 'default'}
    >
      <Grid hasGutter className="pf-u-mb-md">
        {prepareCards()}
      </Grid>
      <FormHelperText>
        <HelperText>
          <HelperTextItem variant={showError ? 'error' : 'default'}>
            {showError ? error : helperText}
          </HelperTextItem>
        </HelperText>
      </FormHelperText>
    </FormGroup>
  );
};

CardSelect.defaultProps = {
  options: [],
  iconMapper: (_value, DefaultIcon) => DefaultIcon,
  mutator: (x) => x,
};

export default CardSelect;
