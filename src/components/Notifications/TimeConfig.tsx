import { Alert, Button, Card, CardBody, CardFooter, Dropdown, DropdownItem, DropdownToggle, HelperText, HelperTextItem,
    Radio, Split, SplitItem, Stack, StackItem,
    Text, TextVariants, TimePicker, Title } from '@patternfly/react-core';
import { global_spacer_lg } from '@patternfly/react-tokens';
import React, { useMemo } from 'react';
import timezones from 'timezones.json';
import { style } from 'typestyle';

import { useGetTimePreference } from '../../services/Notifications/GetTimePreference';
import { useUpdateTimePreference } from '../../services/Notifications/SaveTimePreference';

const dropDownClassName = style({
    width: '280px'
});

const dropDownPaddingClassName = style({
    paddingLeft: global_spacer_lg.value
});

export const TimeConfigComponent: React.FunctionComponent = () => {

    const [ radioSelect, setRadioSelect ] = React.useState(true);
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

    const handleTimeSelect = React.useCallback(() => {
        setIsOpen(false);
    }, []);

    const handleButtonSave = React.useCallback((timePref) => {
        const mutate = saveTimePreference.mutate;
        mutate({
            body: timePref.body
        }).then((response) => {
            if (response.status === 200) {
                return (
                    <Alert title='Action settings saved' variant='success' />
                );
            } else {
                return (
                    <Alert title='Failed to save action settings' variant='danger' />
                );
            }
        });
    }, [ saveTimePreference.mutate ]);

    return (
        <>
            <React.Fragment>
                <Card>
                    <CardBody>
                        <Stack hasGutter>
                            <StackItem>
                                <Title headingLevel='h2'>Action settings</Title>
                            </StackItem>
                            <StackItem>
                                <Text component={ TextVariants.p }>Daily digest email receipt</Text>
                                <HelperText>
                                    <HelperTextItem variant="indeterminate">
                                    Schedule the time at which to send your account&apos;s daily digest email.
                                    </HelperTextItem>
                                </HelperText>
                            </StackItem>
                        </Stack>
                        <br></br>
                        <Split>
                            <SplitItem isFilled>
                                {/* {timePref ? */}
                                <Stack hasGutter>
                                    <StackItem>
                                        <Radio
                                            isChecked={ radioSelect && !showCustomSelect }
                                            onChange={ handleRadioSelect }
                                            value={ timePref }
                                            id='settings-time-config'
                                            label='Default time'
                                            description='00:00 UTC'
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
                                            name='radio-select'>
                                        </Radio>
                                    </StackItem>
                                    {showCustomSelect && (
                                        <><StackItem className={ dropDownPaddingClassName }>
                                            <Text component={ TextVariants.h6 }>Time</Text>
                                            <TimePicker onChange={ handleTimeSelect } value={ timePref }
                                                width='263px' stepMinutes={ 15 } placeholder='00:00' is24Hour />
                                        </StackItem>
                                        <StackItem className={ dropDownPaddingClassName }>
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
                            </SplitItem>
                        </Split>
                    </CardBody>
                    <CardFooter>
                        <Button variant='primary' onClick={ handleButtonSave }>
                    Save
                        </Button>
                    </CardFooter>
                </Card>
            </React.Fragment>
        </>

    );
};

