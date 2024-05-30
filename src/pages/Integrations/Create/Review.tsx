import useFormApi from '@data-driven-forms/react-form-renderer/use-form-api';
import {
  DescriptionList,
  DescriptionListDescription,
  DescriptionListGroup,
  DescriptionListTerm,
  Grid,
  GridItem,
} from '@patternfly/react-core';
import React, { Fragment } from 'react';
import { EVENT_TYPES_TABLE, INTEGRATION_TYPE } from './helpers';
import { defaultIconList } from '../../../config/Config';
import {
  IntegrationCategory,
  IntegrationType,
} from '../../../types/Integration';
import './review.scss';
import { EventType } from '../../../types/Notification';

const getFields = (fields) =>
  fields.flatMap(({ fields, ...rest }) => {
    if (fields) {
      return getFields(fields);
    }
    return { ...rest };
  });

const valueMapper = (category, value) => {
  return {
    [INTEGRATION_TYPE]: {
      value:
        defaultIconList[category]?.[value as IntegrationType]?.product_name ||
        value,
    },
    [EVENT_TYPES_TABLE]: {
      value: (
        <Grid>
          <GridItem span={6}>
            <div className="pf-v5-u-font-weight-bold">Event type</div>
          </GridItem>
          <GridItem span={6}>
            <div className="pf-v5-u-font-weight-bold">Application</div>
          </GridItem>
          {Object.values(value).map((item, index) => (
            <Fragment key={index}>
              <GridItem span={6}>
                {(item as EventType).eventTypeDisplayName}
              </GridItem>
              <GridItem span={6}>
                {(item as EventType).applicationDisplayName}
              </GridItem>
            </Fragment>
          ))}
        </Grid>
      ),
    },
  };
};

const mapFieldValues = (values, fields, category) => {
  const allFields = getFields(fields);
  return Object.entries(values)
    .filter(([, value]) => !!value)
    .map(([key, value]) => {
      const currField = allFields.find(({ name }) => name === key);
      const isIntegrationType = currField?.name === INTEGRATION_TYPE;
      const isEventsType = currField?.name === EVENT_TYPES_TABLE;

      if (!currField || currField.isVisibleOnReview === false) {
        return {};
      }

      return isEventsType
        ? Object.entries(value || {}).map(([key, val]) => ({
            ...currField,
            label: `${currField.label} - ${key}`,
            ...(valueMapper(category, val)[currField?.name] || {
              value,
            }),
          }))
        : {
            ...currField,
            label: isIntegrationType ? 'Integration type' : currField.label,
            ...(valueMapper(category, value)[currField?.name] || {
              value,
            }),
          };
    })
    .flat()
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
