import {
  AlertActionLink,
  Button,
  Content,
  ContentVariants,
  HelperText,
  HelperTextItem,
  Menu,
  MenuContainer,
  MenuContent,
  MenuItem,
  MenuList,
  MenuToggle,
  Radio,
  Skeleton,
  Split,
  SplitItem,
  Stack,
  StackItem,
  TimePicker,
  Title,
  Tooltip,
} from '@patternfly/react-core';
import { Modal, ModalVariant } from '@patternfly/react-core/deprecated';
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
import useChrome from '@redhat-cloud-services/frontend-components/useChrome';
import { defineMessages, useIntl } from 'react-intl';

const DEFAULT_TIME = '00:00';

const messages = defineMessages({
  digestSchedule: {
    id: 'notifications.timeConfig.digestSchedule',
    defaultMessage: 'Any daily digest emails you\u2019ve opted into will be sent at {time} UTC.',
  },
  editTimeSettings: {
    id: 'notifications.timeConfig.editTimeSettings',
    defaultMessage: 'Edit time settings.',
  },
  contactOrgAdmin: {
    id: 'notifications.timeConfig.contactOrgAdmin',
    defaultMessage: 'Contact your Organization Administrator to edit time settings.',
  },
  loading: {
    id: 'notifications.timeConfig.loading',
    defaultMessage: 'Loading',
  },
  save: {
    id: 'notifications.timeConfig.save',
    defaultMessage: 'Save',
  },
  cancel: {
    id: 'notifications.timeConfig.cancel',
    defaultMessage: 'Cancel',
  },
  actionSettings: {
    id: 'notifications.timeConfig.actionSettings',
    defaultMessage: 'Action settings',
  },
  dailyDigest: {
    id: 'notifications.timeConfig.dailyDigest',
    defaultMessage: 'Daily digest email receipt',
  },
  scheduleHelper: {
    id: 'notifications.timeConfig.scheduleHelper',
    defaultMessage:
      'Schedule the time at which to send your account\u2019s daily digest email. All times will be converted to UTC after saving.',
  },
  defaultTime: {
    id: 'notifications.timeConfig.defaultTime',
    defaultMessage: 'Default time',
  },
  defaultTimeValue: {
    id: 'notifications.timeConfig.defaultTimeValue',
    defaultMessage: '00:00 UTC',
  },
  customTime: {
    id: 'notifications.timeConfig.customTime',
    defaultMessage: 'Custom time',
  },
  timeLabel: {
    id: 'notifications.timeConfig.timeLabel',
    defaultMessage: 'Time',
  },
  timeZoneLabel: {
    id: 'notifications.timeConfig.timeZoneLabel',
    defaultMessage: 'Time zone',
  },
  universalTime: {
    id: 'notifications.timeConfig.universalTime',
    defaultMessage: '(UTC-00:00) Universal Time',
  },
  savedTitle: {
    id: 'notifications.timeConfig.savedTitle',
    defaultMessage: 'Action settings saved',
  },
  saveFailedTitle: {
    id: 'notifications.timeConfig.saveFailedTitle',
    defaultMessage: 'Failed to save action settings',
  },
});

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
  const [timeSelect, setTimeSelect] = React.useState<TimeConfigState | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const toggleRef = React.useRef<HTMLButtonElement>(null);
  const menuRef = React.useRef<HTMLDivElement>(null);

  const { addSuccessNotification, addDangerNotification } = useNotification();
  const { auth } = useChrome();
  const intl = useIntl();
  const [isOrgAdmin, setIsOrgAdmin] = useState(false);

  useEffect(() => {
    auth.getUser().then((user) => {
      setIsOrgAdmin(user?.identity?.user?.is_org_admin ?? false);
    });
  }, [auth]);

  React.useEffect(() => {
    const timePreferenceLoad = async () => setTimePref(await getTimeConfig());
    timePreferenceLoad();
  }, []);

  const handleModalToggle = React.useCallback(() => {
    setIsModalOpen((prev) => !prev);
    if (timePref) {
      setTimeSelect({
        baseCustomTime: timePref,
        utcTime: timePref,
        timezoneText: undefined,
      });
    }
  }, [timePref]);

  const timeconfigTitle = useMemo(() => {
    const actionLink = (
      <AlertActionLink
        onClick={handleModalToggle}
        ouiaId="TimeConfigModal"
        isDisabled={!isOrgAdmin}
      >
        {intl.formatMessage(messages.editTimeSettings)}
      </AlertActionLink>
    );

    return (
      <>
        {intl.formatMessage(messages.digestSchedule, {
          time: timeSelect?.utcTime ?? DEFAULT_TIME,
        })}
        <br />
        {!isOrgAdmin ? (
          <Tooltip content={intl.formatMessage(messages.contactOrgAdmin)}>
            <span>{actionLink}</span>
          </Tooltip>
        ) : (
          actionLink
        )}
      </>
    );
  }, [timeSelect?.utcTime, handleModalToggle, isOrgAdmin, intl]);

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
          const pieces = (prev?.baseCustomTime || '00:00').split(':').map((t) => parseInt(t));
          const date = new Date();
          date.setUTCHours(pieces[0], pieces[1]);
          // Going from UTC to the timezone
          const zonedDate = addHours(date, -targetTimezone.offset);
          const utcHours = zonedDate.getUTCHours().toString().padStart(2, '0');
          const utcMinutes = zonedDate.getUTCMinutes().toString().padStart(2, '0');

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
          addSuccessNotification(intl.formatMessage(messages.savedTitle), '');
          setTimePref(await getTimeConfig());
        })
        .catch(() => {
          addDangerNotification(intl.formatMessage(messages.saveFailedTitle), '');
        });
    }

    setIsModalOpen(false);
  }, [addDangerNotification, addSuccessNotification, timeSelect]);

  const isLoading = timeSelect === null || timePref === null;

  return (
    <>
      <Alert className={alertClassName} isInline title={timeconfigTitle} />
      <Modal
        className="pf-v6-u-pl-xl"
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
            {isLoading ? intl.formatMessage(messages.loading) : intl.formatMessage(messages.save)}
          </Button>,
          <Button key="cancel" variant="link" onClick={handleModalToggle}>
            {intl.formatMessage(messages.cancel)}
          </Button>,
        ]}
        ouiaId="TimeConfigModal"
      >
        <Stack hasGutter>
          <StackItem>
            <Title headingLevel="h2">{intl.formatMessage(messages.actionSettings)}</Title>
          </StackItem>
          <StackItem>
            <Content component={ContentVariants.p}>
              {intl.formatMessage(messages.dailyDigest)}
            </Content>
            <HelperText>
              <HelperTextItem variant="indeterminate">
                {intl.formatMessage(messages.scheduleHelper)}
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
                    label={intl.formatMessage(messages.defaultTime)}
                    value="default"
                    description={intl.formatMessage(messages.defaultTimeValue)}
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
                    label={intl.formatMessage(messages.customTime)}
                    name="radio-select"
                  ></Radio>
                )}
              </StackItem>
              {showCustomSelect && (
                <>
                  <StackItem className="pf-v6-u-pl-lg">
                    <Content component={ContentVariants.h6}>
                      {intl.formatMessage(messages.timeLabel)}
                    </Content>
                    <TimePicker
                      onChange={handleTimePrefSelect}
                      time={timeSelect?.baseCustomTime}
                      width="263px"
                      stepMinutes={15}
                      placeholder="00:00"
                      is24Hour
                    />
                  </StackItem>
                  <StackItem className="pf-v6-u-pl-lg">
                    <Content component={ContentVariants.h6}>
                      {intl.formatMessage(messages.timeZoneLabel)}
                    </Content>
                    <MenuContainer
                      isOpen={isOpen}
                      onOpenChange={(isOpen) => setIsOpen(isOpen)}
                      menu={
                        <Menu ref={menuRef} isPlain={false}>
                          <MenuContent id="timezoneMenu">
                            <MenuList className={timezoneListClassName}>
                              {timezones.map((tz) => (
                                // Abbr, value, offset, etc are not unique by themselves
                                <MenuItem onClick={handleTimezoneChange} key={tz.text}>
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
                          {timeSelect?.timezoneText ?? intl.formatMessage(messages.universalTime)}
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
