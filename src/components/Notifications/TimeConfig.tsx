import { Card, CardBody, HelperText, HelperTextItem, PageSection, Radio, Split, SplitItem, Stack, StackItem,
    Text, TextVariants, TimePicker, Title } from '@patternfly/react-core';
import React from 'react';
import type { ITimezone } from 'react-timezone-select';
import TimezoneSelect from 'react-timezone-select';
import { style } from 'typestyle';

import { Schemas } from '../../generated/OpenapiNotifications';
import { useUpdateTimePreference } from '../../services/Notifications/SaveTimePreference';

const timeZoneWidthClassName = style({
    width: 210
});

export const TimeConfigComponent: React.FunctionComponent = () => {

    const [ radioSelect, setRadioSelect ] = React.useState(false);
    const [ radioTimeSelect, setTimeRadioSelect ] = React.useState<Partial<Schemas.LocalTime>>();

    const saveTimePreference = useUpdateTimePreference();

    const [ timezone, setTimezone ] = React.useState<ITimezone>();

    const handleRadioSelect = React.useCallback(() => {
        setRadioSelect(true);
    }, []);

    const handleTimeSelect = React.useCallback((time) => {
        setTimeRadioSelect(time);
        const mutate = saveTimePreference.mutate;
        mutate({
            body: time.body ?? ''
        });

    }, [ saveTimePreference.mutate ]);

    return (
        <React.Fragment>
            <PageSection>
                <Card>
                    <CardBody>
                        <Split>
                            <SplitItem isFilled>
                                <Stack hasGutter>
                                    <StackItem>
                                        <Title headingLevel='h2'>Action Settings</Title>
                                    </StackItem>
                                    <StackItem>
                                        <Text component={ TextVariants.p }>Daily digest email reciept</Text>
                                        <HelperText>
                                            <HelperTextItem variant="indeterminate">
                                                Schedule the time at which to send your accounts daily digest email
                                            </HelperTextItem>
                                        </HelperText>
                                    </StackItem>
                                </Stack>
                            </SplitItem>
                            <SplitItem isFilled>
                                <Stack hasGutter>
                                    <StackItem >
                                        <Radio checked={ radioSelect } onChange={ handleRadioSelect } id='settings-time-config'
                                            label='Default time' description='12:00 UTC' name='radio-select'></Radio>
                                    </StackItem>
                                    <StackItem>
                                        <Radio checked={ radioSelect } onChange={ handleRadioSelect } id='settings-time-config'
                                            label='Custom time' name='radio-select'></Radio>
                                    </StackItem>
                                    <StackItem>
                                        <Text component={ TextVariants.h6 }>Time zone</Text>
                                        <TimezoneSelect
                                            className={ timeZoneWidthClassName }
                                            placeholder='(UTC - 00:00) Universal Time'
                                            value={ timezone ?? '' }
                                            onChange={ setTimezone } />
                                    </StackItem>
                                    <StackItem>
                                        <Text component={ TextVariants.h6 }>Time</Text>
                                        <TimePicker value={ radioTimeSelect } onChange={ handleTimeSelect }
                                            width='450' stepMinutes={ 15 } placeholder='12:00 UTC' is24Hour />
                                    </StackItem>
                                </Stack>
                            </SplitItem>
                        </Split>
                    </CardBody>
                </Card>
            </PageSection>
        </React.Fragment>
    );
};

