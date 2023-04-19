import { Card, CardBody, Dropdown, DropdownItem, DropdownToggle, HelperText, HelperTextItem, PageSection, Radio, Stack, StackItem,
    Text, TextVariants, TimePicker, Title } from '@patternfly/react-core';
import React from 'react';
import timezones from 'timezones.json';
import { style } from 'typestyle';

import { useUpdateTimePreference } from '../../services/Notifications/SaveTimePreference';

const dropDownClassName = style({
    width: '280px'
});

export const TimeConfigComponent: React.FunctionComponent = () => {

    const [ radioSelect, setRadioSelect ] = React.useState(false);
    const [ showCustomSelect, setShowCustomSelect ] = React.useState(false);

    const saveTimePreference = useUpdateTimePreference();

    const handleRadioSelect = React.useCallback(() => {
        setRadioSelect(true);
        setShowCustomSelect(false);
    }, []);

    const [ isOpen, setIsOpen ] = React.useState(false);

    const dropdownItems = timezones.map((tz) =>
        <DropdownItem key={ tz.value }> { tz.text }</DropdownItem>);

    const handleCustomRadioSelect = React.useCallback(() => {
        setRadioSelect(true);
        setShowCustomSelect(true);
    }, []);

    const handleTimeSelect = React.useCallback((time) => {
        setIsOpen(false);
        const mutate = saveTimePreference.mutate;
        mutate({
            body: time
        });
    }, [ saveTimePreference.mutate ]);

    return (
        <React.Fragment>
            <PageSection>
                <Card>
                    <CardBody>
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
                            <StackItem >
                                <Radio
                                    isChecked={ radioSelect && !showCustomSelect }
                                    onChange={ handleRadioSelect }
                                    id='settings-time-config'
                                    label='Default time'
                                    description='00:00 UTC'
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
                                    <TimePicker onChange={ handleTimeSelect }
                                        width='263px' stepMinutes={ 15 } placeholder='12:00' is24Hour />
                                </StackItem><StackItem>
                                    <Text component={ TextVariants.h6 }>Time zone</Text>
                                    <Dropdown
                                        className={ dropDownClassName }
                                        toggle={ <DropdownToggle isOpen={ isOpen } id="timezone" onToggle={ () => setIsOpen(!isOpen) }>
                                                    (UTC-00:00) Universal Time
                                        </DropdownToggle> }
                                        isOpen={ isOpen }
                                        onSelect={ handleTimeSelect }
                                        menuAppendTo={ () => document.body }
                                        dropdownItems={ dropdownItems }>
                                    </Dropdown>
                                </StackItem></>)}
                        </Stack>
                    </CardBody>
                </Card>
            </PageSection>
        </React.Fragment>
    );
};

