import useFormApi from '@data-driven-forms/react-form-renderer/use-form-api';
import {
  DescriptionList,
  DescriptionListDescription,
  DescriptionListGroup,
  DescriptionListTerm,
} from '@patternfly/react-core';
import React from 'react';
import { INTEGRATION_TYPE } from './helpers';
import { defaultIconList } from '../../../config/Config';
import {
  IntegrationCategory,
  IntegrationType,
} from '../../../types/Integration';
import './review.scss';

const getFields = (fields) =>
  fields.flatMap(({ fields, ...rest }) => {
    if (fields) {
      return getFields(fields);
    }
    return { ...rest };
  });

const mapFieldValues = (values, fields, category) => {
  const allFields = getFields(fields);
  return Object.entries(values)
    .filter(([, value]) => !!value)
    .map(([key, value]) => {
      const currField = allFields.find(({ name }) => name === key);
      const isIntegrationType = currField?.name === INTEGRATION_TYPE;

      return currField
        ? {
            ...currField,
            label: isIntegrationType ? 'Integration type' : currField.label,
            value: isIntegrationType
              ? defaultIconList[category]?.[value as IntegrationType]
                  ?.product_name || value
              : value,
          }
        : {};
    })
    .filter(({ value }) => !!value);
};

interface ReviewProps {
  category: IntegrationCategory;
  name: string;
}

const Review: React.FunctionComponent<ReviewProps> = ({
  category,
}: ReviewProps) => {
  const formOptions = useFormApi();
  const values = formOptions.getState().values;
  const labelsWithValues = mapFieldValues(
    values,
    formOptions.schema.fields,
    category
  );

  return (
    <DescriptionList
      isHorizontal
      className="src-c-wizard__summary-description-list"
    >
      {labelsWithValues.map((field) => (
        <DescriptionListGroup key={field.name}>
          <DescriptionListTerm>{field.label}</DescriptionListTerm>
          <DescriptionListDescription>{field.value}</DescriptionListDescription>
        </DescriptionListGroup>
      ))}
    </DescriptionList>
  );
};

export default Review;
