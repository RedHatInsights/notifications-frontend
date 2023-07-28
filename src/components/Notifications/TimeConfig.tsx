import { Button, Card, CardBody, CardFooter, Dropdown, DropdownItem, DropdownToggle, HelperText, HelperTextItem,
    Radio, Skeleton, Split, SplitItem, Stack, StackItem,
    Text, TextVariants, TimePicker, Title } from '@patternfly/react-core';
import { global_spacer_lg } from '@patternfly/react-tokens';
import React, { useEffect, useMemo } from 'react';
import timezones from 'timezones.json';
import { style } from 'typestyle';

import { useGetTimePreference } from '../../services/Notifications/GetTimePreference';
import { useUpdateTimePreference } from '../../services/Notifications/SaveTimePreference';
import { LocalTime } from '../../types/Notification';
import { useNotification } from '../../utils/AlertUtils';

const dropDownClassName = style({
    width: '280px'
});

const dropDownPaddingClassName = style({
    paddingLeft: global_spacer_lg.value
});

export const TimeConfigComponent: React.FunctionComponent = () => {

    const [ showCustomSelect, setShowCustomSelect ] = React.useState(false);
    const [ timeSelect, setTimeSelect ] = React.useState<Partial<LocalTime>>();

    const getTimePreference = useGetTimePreference();
    const saveTimePreference = useUpdateTimePreference();
    const { addSuccessNotification, addDangerNotification } = useNotification();

    const timePref = useMemo(() => {
        if (getTimePreference.status === 200) {
            return getTimePreference.payload?.value as string;
        }

        return undefined;

    }, [ getTimePreference.payload?.value, getTimePreference.status ]);

    // Set the time preference value once we load it from the server
    useEffect(() => {
        if (timePref) {
            setTimeSelect(timePref);
            setShowCustomSelect(true);
        }
    }, [ timePref ]);

    const handleRadioSelect = React.useCallback(() => {
        setShowCustomSelect(false);
    }, []);

    const [ isOpen, setIsOpen ] = React.useState(false);

    const dropdownItems = timezones.map((tz) =>
        <DropdownItem key={ tz.value }> { tz.text }</DropdownItem>);

    const handleCustomRadioSelect = React.useCallback(() => {
        setShowCustomSelect(true);
    }, []);

    const handleTimePrefSelect = React.useCallback((time) => {
        setTimeSelect(time);
        setIsOpen(false);
    }, []);

    const handleButtonSave = React.useCallback(() => {
        if (timeSelect) {
            const mutate = saveTimePreference.mutate;
            mutate({
                body: timeSelect
            }).then((response) => {
                if (response.status === 204) {
                    addSuccessNotification('Action settings saved', '');
                } else {
                    addDangerNotification('Failed to save action settings', '');
                }
            });
        }
    }, [ addDangerNotification, addSuccessNotification, saveTimePreference.mutate, timeSelect ]);

    const isLoading = saveTimePreference.loading || getTimePreference.loading;

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
                                <Stack hasGutter>
                                    <StackItem>
                                        { getTimePreference.loading ? <Skeleton /> :
                                            <Radio
                                                value="00:00"
                                                checked={ !showCustomSelect }
                                                onChange={ handleRadioSelect }
                                                id='settings-time-config'
                                                label='Default time'
                                                description='00:00 UTC'
                                                name='radio-select'>
                                            </Radio>
                                        }
                                    </StackItem>
                                    <StackItem>
                                        { getTimePreference.loading ? <Skeleton /> :
                                            <Radio
                                                value={ timeSelect }
                                                checked={ showCustomSelect }
                                                onChange={ handleCustomRadioSelect }
                                                id='settings-time-config-custom'
                                                label='Custom time'
                                                name='radio-select'>
                                            </Radio>
                                        }
                                    </StackItem>
                                    {showCustomSelect && (
                                        <><StackItem className={ dropDownPaddingClassName }>
                                            <Text component={ TextVariants.h6 }>Time</Text>
                                            <TimePicker onChange={ handleTimePrefSelect } time={ timeSelect }
                                                width='263px' stepMinutes={ 15 } placeholder='00:00' is24Hour />
                                        </StackItem>
                                        <StackItem className={ dropDownPaddingClassName }>
                                            <Text component={ TextVariants.h6 }>Time zone</Text>
                                            <Dropdown
                                                className={ dropDownClassName }
                                                toggle={ <DropdownToggle isOpen={ isOpen } id="timezone" onToggle={ () => setIsOpen(!isOpen) }>
                                                (UTC-00:00) Universal Time
                                                </DropdownToggle> }
                                                isOpen={ isOpen }
                                                onSelect={ handleTimePrefSelect }
                                                menuAppendTo={ () => document.body }
                                                dropdownItems={ dropdownItems }>
                                            </Dropdown>
                                        </StackItem></>)}
                                </Stack>
                            </SplitItem>
                        </Split>
                    </CardBody>
                    <CardFooter>
                        <Button variant='primary' type='submit' isLoading={ isLoading }
                            isDisabled={ isLoading } onClick={ handleButtonSave }>
                            { isLoading ? 'Loading' : 'Save' }
                        </Button>
                    </CardFooter>
                </Card>
            </React.Fragment>
        </>

    );
};

