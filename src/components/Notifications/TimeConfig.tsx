import { Card, CardBody, Dropdown, DropdownItem, DropdownToggle, HelperText, HelperTextItem, PageSection, Radio, Split, SplitItem, Stack, StackItem,
    Text, TextVariants, TimePicker, Title } from '@patternfly/react-core';
import React from 'react';

import { Schemas } from '../../generated/OpenapiNotifications';
import { useUpdateTimePreference } from '../../services/Notifications/SaveTimePreference';

export const TimeConfigComponent: React.FunctionComponent = () => {

    const [ radioSelect, setRadioSelect ] = React.useState(false);
    const [ timeSelect, setTimeSelect ] = React.useState<Partial<Schemas.LocalTime>>();

    const [ showCustomSelect, setShowCustomSelect ] = React.useState(false);

    const saveTimePreference = useUpdateTimePreference();

    const handleRadioSelect = React.useCallback(() => {
        setRadioSelect(true);
        setShowCustomSelect(false);

    }, []);

    const [ isOpen, setIsOpen ] = React.useState(false);

    const onToggle = () => {
        setIsOpen(isOpen);
    };

    const timeZone = new Date().toLocaleTimeString('en-us', { timeZoneName: 'short' }).split(' ')[2];
    console.log(timeZone);

    // leaving here for ref (UTC - 00:00) Universal Time
    const dropdownItems = [
        <>
            <DropdownItem key='timezone'>
               ( { timeZone }  - )
            </DropdownItem>
        </>
    ];

    const handleCustomRadioSelect = React.useCallback(() => {
        setRadioSelect(true);
        setShowCustomSelect(true);
    }, []);

    const handleTimeSelect = React.useCallback((time) => {
        setTimeSelect(time);
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
                                        <Radio
                                            isChecked={ radioSelect && !showCustomSelect }
                                            onChange={ handleRadioSelect }
                                            id='settings-time-config'
                                            label='Default time'
                                            description='12:00 UTC'
                                            name='radio-select'>
                                        </Radio>
                                    </StackItem>
                                    <StackItem>
                                        <Radio
                                            isChecked={ radioSelect && showCustomSelect }
                                            onChange={ handleCustomRadioSelect }
                                            id='settings-time-config'
                                            label='Custom time'
                                            description='Choose specific time and time zone'
                                            name='radio-select'>
                                        </Radio>
                                    </StackItem>
                                    {showCustomSelect && (
                                        <><StackItem>
                                            <Text component={ TextVariants.h6 }>Time</Text>
                                            <TimePicker value={ timeSelect } onChange={ handleTimeSelect }
                                                width='270px' stepMinutes={ 15 } placeholder='12:00 UTC' is24Hour />
                                        </StackItem><StackItem>
                                            <Text component={ TextVariants.h6 }>Time zone</Text>
                                            <Dropdown
                                                toggle={ <DropdownToggle id="timezone" onToggle={ onToggle }>
                                                    (UTC - 00:00) Universal Time
                                                </DropdownToggle> }
                                                isOpen={ isOpen }
                                                onSelect={ handleTimeSelect }
                                                dropdownItems={ dropdownItems }>
                                            </Dropdown>
                                        </StackItem></>)}
                                </Stack>
                            </SplitItem>
                        </Split>
                    </CardBody>
                </Card>
            </PageSection>
        </React.Fragment>
    );
};

