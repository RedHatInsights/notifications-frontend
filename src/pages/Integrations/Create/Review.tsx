import useFormApi from '@data-driven-forms/react-form-renderer/use-form-api';
import {
  Grid,
  GridItem,
  Stack,
  StackItem,
  Text,
  TextVariants,
} from '@patternfly/react-core';
import React, { Fragment } from 'react';

const getFields = (fields) =>
  fields.flatMap(({ fields, ...rest }) => {
    if (fields) {
      return getFields(fields);
    }
    return { ...rest };
  });

const mapFieldValues = (values, fields) => {
  const allFields = getFields(fields);
  return Object.entries(values)
    .filter(([, value]) => !!value)
    .map(([key, value]) => {
      const currField = allFields.find(({ name }) => name === key);
      return {
        ...currField,
        value,
      };
    })
    .filter(({ value }) => !!value);
};

const Review: React.FunctionComponent = () => {
  const formOptions = useFormApi();
  const values = formOptions.getState().values;
  const labelsWithValues = mapFieldValues(values, formOptions.schema.fields);

  return (
    <Stack hasGutter>
      <StackItem>
        <Stack hasGutter>
          <StackItem>
            <Grid>
              {labelsWithValues.map((field) => (
                <Fragment key={field.name}>
                  <GridItem md={3}>
                    <Text component={TextVariants.h4}>{field.label}</Text>
                  </GridItem>
                  <GridItem md={9}>
                    <Text component={TextVariants.p}>{field.value}</Text>
                  </GridItem>
                </Fragment>
              ))}
            </Grid>
          </StackItem>
        </Stack>
      </StackItem>
    </Stack>
  );
};

export default Review;
