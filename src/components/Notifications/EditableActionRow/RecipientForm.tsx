import { FormHelperText } from '@patternfly/react-core';
import { Select, SelectList, SelectOption, MenuToggle, MenuToggleElement } from '@patternfly/react-core';
import * as React from 'react';

import { IntegrationType } from '../../../types/Integration';
import { Action, NotificationType } from '../../../types/Notification';
import { UseBehaviorGroupActionHandlers } from '../BehaviorGroup/useBehaviorGroupActionHandlers';
import { IntegrationRecipientTypeahead } from '../Form/IntegrationRecipientTypeahead';
import { RecipientTypeahead } from '../Form/RecipientTypeahead';

interface RecipientFormProps {
  action?: Action;
  integrationSelected: ReturnType<
    UseBehaviorGroupActionHandlers['handleIntegrationSelected']
  >;
  recipientSelected: ReturnType<
    UseBehaviorGroupActionHandlers['handleRecipientSelected']
  >;
  recipientOnClear: ReturnType<
    UseBehaviorGroupActionHandlers['handleRecipientOnClear']
  >;
  onOpenChange?: (isOpen: boolean) => void;
  error?: string;
}

const dummyOnToggle = () => false;

export const RecipientForm: React.FunctionComponent<RecipientFormProps> = (
  props
) => {
  let recipient: React.ReactNode;

  if (!props.action) {
    recipient = (
      <div>
        <Select
          toggle={(toggleRef: React.RefObject<MenuToggleElement>) => (
            <MenuToggle ref={toggleRef} isDisabled>
              Select an action first
            </MenuToggle>
          )}
          isOpen={false}
        >
          <SelectList>
            <SelectOption>Select an action first</SelectOption>
          </SelectList>
        </Select>
      </div>
    );
  } else if (props.action.type === NotificationType.INTEGRATION) {
    recipient = (
      <IntegrationRecipientTypeahead
        onSelected={props.integrationSelected}
        integrationType={
          props.action.integration?.type ?? IntegrationType.WEBHOOK
        }
        selected={props.action.integration}
        onOpenChange={props.onOpenChange}
        error={!!props.error}
      />
    );
  } else {
    recipient = (
      <RecipientTypeahead
        onSelected={props.recipientSelected}
        selected={props.action.recipient}
        onClear={props.recipientOnClear}
        onOpenChange={props.onOpenChange}
        error={!!props.error}
      />
    );
  }

  return (
    <>
      {recipient}
      {props.error && <FormHelperText>{props.error}</FormHelperText>}
    </>
  );
};
