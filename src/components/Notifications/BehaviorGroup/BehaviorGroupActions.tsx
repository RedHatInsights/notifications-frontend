import * as React from 'react';
import { Grid, GridItem, Text, TextContent, TextVariants } from '@patternfly/react-core';
import { c_form__label_FontSize } from '@patternfly/react-tokens';

const contentTitleStyle = {
    fontSize: c_form__label_FontSize.value
};

interface BehaviorGroupActionsProps {

}

export const BehaviorGroupActions: React.FunctionComponent = () => {
    return (
        <Grid hasGutter>
            <GridItem span={ 6 }>
                <TextContent>
                    <Text component={ TextVariants.h5 } style={ contentTitleStyle }>Action</Text>
                </TextContent>
            </GridItem>
            <GridItem span={ 6 }>
                <TextContent>
                    <Text component={ TextVariants.h5 } style={ contentTitleStyle }>Recipient</Text>
                </TextContent>
            </GridItem>
            { props.contents.map(content => (
                <React.Fragment key={ content.key }>
                    <GridItem span={ 6 }>
                        { content.action }
                    </GridItem>
                    <GridItem span={ 6 }>
                        { content.recipient }
                    </GridItem>
                </React.Fragment>
            )) }
        </Grid>
    );
};
