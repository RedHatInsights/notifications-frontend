import {
  AlertActionLink,
  Button,
  HelperText,
  HelperTextItem,
  Menu,
  MenuContainer,
  MenuContent,
  MenuItem,
  MenuList,
  MenuToggle,
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

import { useNotification } from '../../utils/AlertUtils';
import {
  getTimeConfig,
  setTimeConfig,
} from '../../api/helpers/notifications/time-preference-helper';

const alertClassName = style({
  marginTop: '12px',
});

const timezoneListClassName = style({
  maxHeight: '200px',
  maxWidth: '400px',
  overflowY: 'auto',
});

interface TimeConfigState {
  utcTime: string;
  baseCustomTime: string;
  timezoneText: string | undefined;
}

export const TimeConfigComponent: React.FunctionComponent = () => {
  const [showCustomSelect, setShowCustomSelect] = React.useState(false);
  const [timePref, setTimePref] = React.useState<string | null>();
  const [timeSelect, setTimeSelect] = React.useState<TimeConfigState | null>(
    null
  );
  const [isModalOpen, setIsModalOpen] = useState(false);

  const toggleRef = React.useRef<HTMLButtonElement>(null);
  const menuRef = React.useRef<HTMLDivElement>(null);

  const { addSuccessNotification, addDangerNotification } = useNotification();

  React.useEffect(() => {
    const timePreferenceLoad = async () => setTimePref(await getTimeConfig());
    timePreferenceLoad();
  }, []);

  const timeconfigTitle = useMemo(() => {
    return `Any daily digest emails you've opted into will be sent at ${
      timeSelect?.utcTime ? timeSelect?.utcTime : '00:00'
    } UTC`;
  }, [timeSelect?.utcTime]);

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

  const onToggleClick = () => {
    setIsOpen(!isOpen);
  };

  const handleCustomRadioSelect = React.useCallback(() => {
    setShowCustomSelect(true);
  }, []);

  const handleTimePrefSelect = React.useCallback((_ev, time) => {
    setTimeSelect({
      baseCustomTime: time,
      utcTime: time,
      timezoneText: undefined,
    });
  }, []);

  const handleTimezoneChange = React.useCallback((event?: MouseEvent) => {
    if (event?.target) {
      const target = event.target;
      const textContent = (target as HTMLElement).textContent;
      const targetTimezone = timezones.find((t) => t.text === textContent);
      if (targetTimezone) {
        setTimeSelect((prev) => {
          const pieces = (prev?.baseCustomTime || '00:00')
            .split(':')
            .map((t) => parseInt(t));
          const date = new Date();
          date.setUTCHours(pieces[0], pieces[1]);
          // Going from UTC to the timezone
          const zonedDate = addHours(date, -targetTimezone.offset);
          const utcHours = zonedDate.getUTCHours().toString().padStart(2, '0');
          const utcMinutes = zonedDate
            .getUTCMinutes()
            .toString()
            .padStart(2, '0');

          return {
            baseCustomTime: prev?.baseCustomTime || '00:00',
            utcTime: `${utcHours}:${utcMinutes}`,
            timezoneText: targetTimezone.text,
          };
        });
      }
    }

    setIsOpen(false);
  }, []);

  const handleButtonSave = React.useCallback(() => {
    if (timeSelect) {
      setTimeConfig(`${timeSelect.utcTime}:00`)
        .then(async () => {
          addSuccessNotification('Action settings saved', '');
          setTimePref(await getTimeConfig());
        })
        .catch(() => {
          addDangerNotification('Failed to save action settings', '');
        });
    }

    setIsModalOpen(false);
  }, [addDangerNotification, addSuccessNotification, timeSelect]);

  const isLoading = timeSelect === null || timePref === null;

  const handleModalToggle = () => {
    setIsModalOpen(!isModalOpen);
    if (timePref) {
      setTimeSelect({
        baseCustomTime: timePref,
        utcTime: timePref,
        timezoneText: undefined,
      });
    }
  };

  return (
    <>
      <Alert
        className={alertClassName}
        isInline
        title={timeconfigTitle}
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
                {timePref === null ? (
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
                {timePref === null ? (
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
                    <MenuContainer
                      isOpen={isOpen}
                      onOpenChange={(isOpen) => setIsOpen(isOpen)}
                      menu={
                        <Menu ref={menuRef} isPlain={false}>
                          <MenuContent id="timezoneMenu">
                            <MenuList className={timezoneListClassName}>
                              {timezones.map((tz) => (
                                // Abbr, value, offset, etc are not unique by themselves
                                <MenuItem
                                  onClick={handleTimezoneChange}
                                  key={tz.text}
                                >
                                  {tz.text}
                                </MenuItem>
                              ))}
                            </MenuList>
                          </MenuContent>
                        </Menu>
                      }
                      menuRef={menuRef}
                      toggle={
                        <MenuToggle
                          id="timezone"
                          ref={toggleRef}
                          onClick={onToggleClick}
                          isExpanded={isOpen}
                        >
                          {timeSelect?.timezoneText ??
                            '(UTC-00:00) Universal Time'}
                        </MenuToggle>
                      }
                      toggleRef={toggleRef}
                    />
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
