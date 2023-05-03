import { Card, CardBody, Dropdown, DropdownItem, DropdownToggle, HelperText, HelperTextItem, PageSection,
    Radio, Skeleton, Split, SplitItem, Stack, StackItem, Text, TextVariants, TimePicker, Title } from '@patternfly/react-core';
import React, { useMemo } from 'react';
import timezones from 'timezones.json';
import { style } from 'typestyle';

import { useGetTimePreference } from '../../services/Notifications/GetTimePreference';
import { useUpdateTimePreference } from '../../services/Notifications/SaveTimePreference';

const dropDownClassName = style({
    width: '280px'
});

export const TimeConfigComponent: React.FunctionComponent = () => {

    const [ radioSelect, setRadioSelect ] = React.useState(false);
    const [ showCustomSelect, setShowCustomSelect ] = React.useState(false);

    const getTimePreference = useGetTimePreference();
    const saveTimePreference = useUpdateTimePreference();

    const timePref = useMemo(() => {
        if (getTimePreference.payload?.status === 200) {
            return getTimePreference.payload.value;
        }

        return undefined;

    }, [ getTimePreference.payload?.status, getTimePreference.payload?.value ]);

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
                                {timePref ?
                                    <Stack hasGutter>
                                        <StackItem >
                                            <Radio
                                                isChecked={ radioSelect && !showCustomSelect }
                                                onChange={ handleRadioSelect }
                                                value={ timePref }
                                                id='settings-time-config'
                                                label='Default time'
                                                description='12:00 UTC'
                                                name='radio-select'>
                                            </Radio>
                                        </StackItem>
                                        <StackItem>
                                            <Radio
                                                isChecked={ radioSelect && showCustomSelect }
                                                value={ timePref }
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
                                                <TimePicker onChange={ handleTimeSelect } value={ timePref }
                                                    width='263px' stepMinutes={ 15 } placeholder='12:00' is24Hour />
                                            </StackItem><StackItem>
                                                <Text component={ TextVariants.h6 }>Time zone</Text>
                                                <Dropdown
                                                    value={ timePref }
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
                                    : <Skeleton /> }
                            </SplitItem>
                        </Split>
                    </CardBody>
                </Card>
            </PageSection>
        </React.Fragment>
    );
};

