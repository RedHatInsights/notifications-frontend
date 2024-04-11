import {
  AlertActionLink,
  Button,
  Dropdown,
  DropdownItem,
  DropdownToggle,
  HelperText,
  HelperTextItem,
  Modal,
  ModalVariant,
  Radio,
  Skeleton,
  Split,
  SplitItem,
  Stack,
  StackItem,
  Text,
  TextVariants,
  TimePicker,
  Title,
} from '@patternfly/react-core';
import { Alert } from '@patternfly/react-core';
import { addHours } from 'date-fns';
import React, { useEffect, useMemo, useState } from 'react';
import timezones from 'timezones.json';
import { style } from 'typestyle';

import { useGetTimePreference } from '../../services/Notifications/GetTimePreference';
import { useUpdateTimePreference } from '../../services/Notifications/SaveTimePreference';
import { useNotification } from '../../utils/AlertUtils';
import axios from 'axios';

const dropDownClassName = style({
  width: '280px',
});

const alertClassName = style({
  marginTop: '12px',
});

interface TimeConfigState {
  utcTime: string;
  baseCustomTime: string;
  timezoneText: string | undefined;
}

export const TimeConfigComponent: React.FunctionComponent = () => {
  const [showCustomSelect, setShowCustomSelect] = React.useState(false);
  const [timeSelect, setTimeSelect] = React.useState<TimeConfigState>();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const getTimePreference = useGetTimePreference();
  const saveTimePreference = useUpdateTimePreference();
  const { addSuccessNotification, addDangerNotification } = useNotification();

  const timePref = useMemo(() => {
    if (getTimePreference.status === 200) {
      return getTimePreference.payload?.value as string;
    }

    return undefined;
  }, [getTimePreference.payload?.value, getTimePreference.status]);

  // Set the time preference value once we load it from the server
  useEffect(() => {
    if (timePref) {
      setTimeSelect({
        baseCustomTime: timePref,
        utcTime: timePref,
        timezoneText: undefined,
      });
      setShowCustomSelect(timePref !== '00:00:00');
    }
  }, [timePref]);

  const handleRadioSelect = React.useCallback(() => {
    setShowCustomSelect(false);
    setTimeSelect({
      utcTime: '00:00',
      baseCustomTime: '00:00',
      timezoneText: undefined,
    });
  }, []);

  const [isOpen, setIsOpen] = React.useState(false);

  const dropdownItems = timezones.map((tz) => (
    // Abbr, value, offset, etc are not unique by themselves
    <DropdownItem key={tz.text}>{tz.text}</DropdownItem>
  ));

  const handleCustomRadioSelect = React.useCallback(() => {
    setShowCustomSelect(true);
  }, []);

  const handleTimePrefSelect = React.useCallback((time) => {
    setTimeSelect({
      baseCustomTime: time,
      utcTime: time,
      timezoneText: undefined,
    });
  }, []);

  const handleTimezoneChange = React.useCallback(
    (event?: React.SyntheticEvent<HTMLDivElement>) => {
      if (event?.target) {
        const target = event.target;
        const textContent = (target as HTMLElement).textContent;
        const targetTimezone = timezones.find((t) => t.text === textContent);
        if (targetTimezone) {
          setTimeSelect((prev) => {
            if (prev?.baseCustomTime) {
              const pieces = prev.baseCustomTime
                .split(':')
                .map((t) => parseInt(t));
              const date = new Date();
              date.setUTCHours(pieces[0], pieces[1]);
              // Going from UTC to the timezone
              const zonedDate = addHours(date, -targetTimezone.offset);
              const utcHours = zonedDate
                .getUTCHours()
                .toString()
                .padStart(2, '0');
              const utcMinutes = zonedDate
                .getUTCMinutes()
                .toString()
                .padStart(2, '0');

              return {
                ...prev,
                utcTime: `${utcHours}:${utcMinutes}`,
                timezoneText: targetTimezone.text,
              };
            }

            return prev;
          });
        }
      }

      setIsOpen(false);
    },
    []
  );

  const handleButtonSave = React.useCallback(() => {
    if (timeSelect) {
      const body = timeSelect.utcTime;
      axios
        .put(
          '/api/notifications/v1.0/org-config/daily-digest/time-preference',
          body,
          {
            headers: {
              'Content-Type': 'application/json',
            },
          }
        )
        .then(() => {
          addSuccessNotification('Action settings saved', '');
        })
        .catch(() => {
          addDangerNotification('Failed to save action settings', '');
        });
    }

    setIsModalOpen(false);
  }, [addDangerNotification, addSuccessNotification, timeSelect]);

  const isLoading = saveTimePreference.loading || getTimePreference.loading;

  const handleModalToggle = () => {
    setIsModalOpen(!isModalOpen);
  };

  const timeconfigTitle = () => {
    return `Any daily digest emails you've opted into will be sent at ${
      timePref ? timePref : '00:00'
    } UTC`;
  };

  return (
    <>
      <Alert
        className={alertClassName}
        isInline
        title={timeconfigTitle()}
        actionLinks={
          <AlertActionLink onClick={handleModalToggle} ouiaId="TimeConfigModal">
            Edit time settings
          </AlertActionLink>
        }
      />
      <Modal
        className="pf-v5-u-pl-xl"
        variant={ModalVariant.small}
        isOpen={isModalOpen}
        onClose={handleModalToggle}
        actions={[
          <Button
            key="save"
            variant="primary"
            type="submit"
            isLoading={isLoading}
            isDisabled={isLoading}
            onClick={handleButtonSave}
          >
            {isLoading ? 'Loading' : 'Save'}
          </Button>,
          <Button key="cancel" variant="link" onClick={handleModalToggle}>
            Cancel
          </Button>,
        ]}
        ouiaId="TimeConfigModal"
      >
        <Stack hasGutter>
          <StackItem>
            <Title headingLevel="h2">Action settings</Title>
          </StackItem>
          <StackItem>
            <Text component={TextVariants.p}>Daily digest email receipt</Text>
            <HelperText>
              <HelperTextItem variant="indeterminate">
                Schedule the time at which to send your account&apos;s daily
                digest email. All times will be converted to UTC after saving.
              </HelperTextItem>
            </HelperText>
          </StackItem>
        </Stack>
        <br></br>
        <Split>
          <SplitItem isFilled>
            <Stack hasGutter>
              <StackItem>
                {getTimePreference.loading ? (
                  <Skeleton />
                ) : (
                  <Radio
                    isChecked={!showCustomSelect}
                    onChange={handleRadioSelect}
                    id="settings-time-config"
                    label="Default time"
                    value="Default"
                    description="00:00 UTC"
                    name="radio-select"
                  ></Radio>
                )}
              </StackItem>
              <StackItem>
                {getTimePreference.loading ? (
                  <Skeleton />
                ) : (
                  <Radio
                    isChecked={showCustomSelect}
                    onChange={handleCustomRadioSelect}
                    id="settings-time-config-custom"
                    label="Custom time"
                    name="radio-select"
                  ></Radio>
                )}
              </StackItem>
              {showCustomSelect && (
                <>
                  <StackItem className="pf-v5-u-pl-lg">
                    <Text component={TextVariants.h6}>Time</Text>
                    <TimePicker
                      onChange={handleTimePrefSelect}
                      time={timeSelect?.baseCustomTime}
                      width="263px"
                      stepMinutes={15}
                      placeholder="00:00"
                      is24Hour
                    />
                  </StackItem>
                  <StackItem className="pf-v5-u-pl-lg">
                    <Text component={TextVariants.h6}>Time zone</Text>
                    <Dropdown
                      className={dropDownClassName}
                      toggle={
                        <DropdownToggle
                          isOpen={isOpen}
                          id="timezone"
                          onToggle={() => setIsOpen(!isOpen)}
                        >
                          {timeSelect?.timezoneText ??
                            '(UTC-00:00) Universal Time'}
                        </DropdownToggle>
                      }
                      isOpen={isOpen}
                      onSelect={handleTimezoneChange}
                      menuAppendTo={() => document.body}
                      dropdownItems={dropdownItems}
                    ></Dropdown>
                  </StackItem>
                </>
              )}
            </Stack>
          </SplitItem>
        </Split>
      </Modal>
    </>
  );
};

export default TimeConfigComponent;
