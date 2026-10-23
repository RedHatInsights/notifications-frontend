import { FormattedMessage, defineMessages, useIntl } from 'react-intl';
import {
  MenuToggle,
  MenuToggleElement,
  Select,
  SelectList,
  SelectOption,
} from '@patternfly/react-core';
import produce from 'immer';
import * as React from 'react';
import { Link } from 'react-router-dom';

import { useIntegrations } from '../../../hooks/useIntegrations';
import { useNotifications } from '../../../hooks/useNotifications';
import { linkTo } from '../../../Routes';
import { UserIntegrationType, isUserIntegrationType } from '../../../types/Integration';
import { Action, NotificationType } from '../../../types/Notification';
import { getOuiaProps } from '../../../utils/getOuiaProps';
import { useRecipientContext } from '../RecipientContext';
import { ActionOption } from './ActionOption';
import { OuiaProps } from '@redhat-cloud-services/frontend-components/Ouia/Ouia';
const OUIA_ID = 'ActionTypeahead';
const TRUE = 'true';
const FALSE = 'false';

const messages = defineMessages({
  noIntegration: {
    id: 'notifications.actionTypeahead.noIntegration',
    defaultMessage: 'You have no integration configured.',
  },
  goToSettings: {
    id: 'notifications.actionTypeahead.goToSettings',
    defaultMessage: 'Go to Settings > {link} to create one.',
  },
  createIntegrationLink: {
    id: 'notifications.actionTypeahead.createIntegrationLink',
    defaultMessage: 'Integrations',
  },
  selectActionAria: {
    id: 'notifications.actionTypeahead.selectActionAria',
    defaultMessage: 'Select action',
  },
  selectAction: {
    id: 'notifications.actionTypeahead.selectAction',
    defaultMessage: 'Select action',
  },
});

const getSelectOptions = (
  availableNotificationTypes: ReadonlyArray<NotificationType>,
  availableIntegrationTypes: ReadonlyArray<UserIntegrationType>,
  selectedNotifications: ReadonlyArray<NotificationType>
) => [
  ...availableNotificationTypes
    .filter((type) => !selectedNotifications.includes(type))
    .map(
      (type) =>
        new ActionOption({
          kind: 'notification',
          type,
        })
    ),
  ...availableIntegrationTypes.map(
    (type) =>
      new ActionOption({
        kind: 'integration',
        type,
      })
  ),
];

type NoIntegrationConfigured = {
  Comp?: React.ComponentType<unknown>;
  testNoIntegrationRenderWithoutRelAndTarget?: boolean;
};

const NoIntegrationConfigured: React.FunctionComponent<NoIntegrationConfigured> = (props) => {
  const intl = useIntl();
  return (
    <>
      <div>{intl.formatMessage(messages.noIntegration)}</div>
      {props.Comp && <props.Comp />}
      <div>
        <FormattedMessage
          {...messages.goToSettings}
          values={{
            link: (
              <Link
                style={{ pointerEvents: 'all' }}
                rel={
                  props.testNoIntegrationRenderWithoutRelAndTarget
                    ? undefined
                    : 'noopener noreferrer'
                }
                target={props.testNoIntegrationRenderWithoutRelAndTarget ? undefined : '_blank'}
                to={linkTo.integrations()}
              >
                <FormattedMessage {...messages.createIntegrationLink} />
              </Link>
            ),
          }}
        />
      </div>
    </>
  );
};

export interface ActionTypeaheadProps extends OuiaProps {
  selectedNotifications: ReadonlyArray<NotificationType>;
  action?: Action;
  isDisabled?: boolean;
  onSelected: (actionOption: ActionOption) => void;
  testNoIntegrationRenderWithoutRelAndTarget?: boolean;
}

export const ActionTypeahead: React.FunctionComponent<ActionTypeaheadProps> = (props) => {
  const intl = useIntl();
  const [isOpen, setOpen] = React.useState(false);
  const { getIntegrations } = useRecipientContext();
  const [hasIntegrations, setHasIntegrations] = React.useState<
    Record<UserIntegrationType, boolean>
  >(
    Object.values(UserIntegrationType).reduce((types, type) => {
      types[type] = true;
      return types;
    }, {} as Record<UserIntegrationType, boolean>)
  );

  React.useEffect(() => {
    Object.values(UserIntegrationType).forEach(async (type) => {
      const values = await getIntegrations(type);
      setHasIntegrations(
        produce((draft) => {
          draft[type] = values.length > 0;
        })
      );
    });
  }, [getIntegrations]);

  const toggle = React.useCallback(
    (isExpanded: boolean) => {
      setOpen(isExpanded);
    },
    [setOpen]
  );

  const onSelect = React.useCallback(
    (_event, value) => {
      const actionSelected = props.onSelected;
      if (value instanceof ActionOption) {
        actionSelected(value);
        setOpen(false);
      }
    },
    [props.onSelected, setOpen]
  );

  const selectedOption = React.useMemo(() => {
    if (!props.action) {
      return undefined;
    }

    if (props.action.type === NotificationType.INTEGRATION) {
      return new ActionOption({
        kind: 'integration',
        type: props.action.integration.type,
      });
    }

    return new ActionOption({
      kind: 'notification',
      type: props.action.type,
    });
  }, [props.action]);

  const integrationTypes = useIntegrations();
  const notificationTypes = useNotifications();

  const selectableOptions = React.useMemo(() => {
    return getSelectOptions(notificationTypes, integrationTypes, props.selectedNotifications).map(
      (o) => {
        const isDisabled =
          isUserIntegrationType(o.integrationType) && !hasIntegrations[o.integrationType];
        return (
          <SelectOption
            aria-disabled={isDisabled ? TRUE : FALSE}
            isDisabled={isDisabled}
            key={o.toString()}
            value={o}
            description={
              isDisabled && (
                <NoIntegrationConfigured
                  testNoIntegrationRenderWithoutRelAndTarget={
                    props.testNoIntegrationRenderWithoutRelAndTarget
                  }
                />
              )
            }
          >
            {o.toString()}
          </SelectOption>
        );
      }
    );
  }, [
    notificationTypes,
    integrationTypes,
    props.selectedNotifications,
    hasIntegrations,
    props.testNoIntegrationRenderWithoutRelAndTarget,
  ]);

  return (
    <div {...getOuiaProps(OUIA_ID, props)}>
      <Select
        aria-label={intl.formatMessage(messages.selectActionAria)}
        selected={selectedOption}
        onSelect={onSelect}
        onOpenChange={(isOpen) => setOpen(isOpen)}
        isOpen={isOpen}
        toggle={(toggleRef: React.Ref<MenuToggleElement>) => (
          <MenuToggle
            ref={toggleRef}
            onClick={() => toggle(!isOpen)}
            isExpanded={isOpen}
            isDisabled={props.isDisabled}
          >
            {selectedOption ? selectedOption.toString() : intl.formatMessage(messages.selectAction)}
          </MenuToggle>
        )}
      >
        <SelectList>{selectableOptions}</SelectList>
      </Select>
    </div>
  );
};
