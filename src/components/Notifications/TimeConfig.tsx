import { Radio, Split, SplitItem, Text, TextContent, TextVariants, TimePicker } from '@patternfly/react-core';
import React from 'react';

export const TimeConfigComponent: React.FunctionComponent = () => {

    return (
        <React.Fragment>
            <TextContent>
                <Text component={ TextVariants.h1 }>Action Settings</Text>
                <Split>
                    <SplitItem>
                        <Text component={ TextVariants.p }>Daily digest email reciept</Text>
                    </SplitItem>
                    <SplitItem>
                        <Radio id='settings-time-config' label='Default time' description='12:00 UTC' name='radio-select'></Radio>
                        <Radio id='settings-time-config' label='Custom time' name='radio-select'></Radio>
                        <TimePicker is24Hour />
                    </SplitItem>
                </Split>
                <Text component={ TextVariants.small }>Schedule the time at which to send your accounts daily digest email</Text>
            </TextContent>
        </React.Fragment>
    );
};
