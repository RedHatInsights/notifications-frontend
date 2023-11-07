import useFormApi from '@data-driven-forms/react-form-renderer/use-form-api';
import { Grid, GridItem, Stack, StackItem, Text, TextVariants } from '@patternfly/react-core';
import React from 'react';

const Review: React.FunctionComponent = () => {
    const formOptions = useFormApi();
    const {
        'integration-name': name
    } = formOptions.getState().values;

    return (
        <Stack hasGutter>
            <StackItem>
                <Stack hasGutter>
                    <StackItem>
                        <Grid>
                            <GridItem md={ 3 }>
                                <Text component={ TextVariants.h4 }>
                                Integration name
                                </Text>
                            </GridItem>
                            <GridItem md={ 9 }>
                                <Text component={ TextVariants.p }>{name}</Text>
                            </GridItem>
                        </Grid>
                    </StackItem>
                </Stack>
            </StackItem>
        </Stack>
    );
};

export default Review;
