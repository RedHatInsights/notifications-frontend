import {
  Select,
  SelectOption,
  SelectOptionObject,
  SelectVariant,
} from '@patternfly/react-core/deprecated';
import { OuiaComponentProps } from '@redhat-cloud-services/insights-common-typescript';
import { useFormikContext } from 'formik';
import * as React from 'react';
import { usePrevious } from 'react-use';
import { DeepPartial } from 'ts-essentials';

import Config from '../../../config/Config';
import { UserIntegrationType } from '../../../types/Integration';
import {
  ActionIntegration,
  BehaviorGroup,
  IntegrationRef,
  NotificationType,
} from '../../../types/Notification';
import { IntegrationRecipient } from '../../../types/Recipient';
import { getOuiaProps } from '../../../utils/getOuiaProps';
import { useRecipientContext } from '../RecipientContext';
import { RecipientOption } from './RecipientOption';
import { useRecipientOptionMemo } from './useRecipientOptionMemo';
import { useTypeaheadReducer } from './useTypeaheadReducer';

export interface IntegrationRecipientTypeaheadProps extends OuiaComponentProps {
  selected: Partial<IntegrationRef> | undefined;
  integrationType: UserIntegrationType;
  isDisabled?: boolean;
  onSelected: (recipientOption: RecipientOption) => void;
  onOpenChange?: (isOpen: boolean) => void;
  error?: boolean;
}

export const IntegrationRecipientTypeahead: React.FunctionComponent<
  IntegrationRecipientTypeaheadProps
> = (props) => {
  const [isOpen, setOpen] = React.useState(false);
  const prevOpen = usePrevious(isOpen);

  const { getIntegrations } = useRecipientContext();
  const { values } = useFormikContext<DeepPartial<BehaviorGroup>>();

  const [state, dispatchers] = useTypeaheadReducer<IntegrationRecipient>();

  const toggle = React.useCallback(
    (isOpen: boolean) => {
      setOpen(isOpen);
    },
    [setOpen]
  );

  React.useEffect(() => {
    const onOpenChange = props.onOpenChange;
    if (prevOpen !== undefined && prevOpen !== isOpen) {
      onOpenChange && onOpenChange(isOpen);
    }
  }, [prevOpen, isOpen, props.onOpenChange]);

  React.useEffect(() => {
    getIntegrations(props.integrationType, '').then((integrations) => {
      const defaults = integrations.map((i) => new IntegrationRecipient(i));
      dispatchers.setDefaults(defaults);
    });
  }, [getIntegrations, props.integrationType, dispatchers]);

  React.useEffect(() => {
    if (state.loadingFilter) {
      getIntegrations(props.integrationType, state.lastSearch).then(
        (integrations) =>
          dispatchers.setFilterValue(
            state.lastSearch,
            integrations.map((i) => new IntegrationRecipient(i))
          )
      );
    }
  }, [
    getIntegrations,
    props.integrationType,
    state.loadingFilter,
    state.lastSearch,
    dispatchers,
  ]);

  const existingIntegrations = React.useMemo(() => {
    const integrationActions = (values.actions ?? [])
      .filter((action) => action?.type === NotificationType.INTEGRATION)
      .map((action) => (action as ActionIntegration)?.integration.id);

    return new Set<string>(integrationActions);
  }, [values]);

  const integrationsMapper = React.useCallback(
    (recipients: ReadonlyArray<IntegrationRecipient>) => {
      return recipients.map((r) => {
        const isDisabled = existingIntegrations?.has(r.integration.id);

        return (
          <SelectOption
            key={r.getKey()}
            value={new RecipientOption(r)}
            description={
              isDisabled ? 'This integration has already been added' : undefined
            }
            isDisabled={isDisabled}
          />
        );
      });
    },
    [existingIntegrations]
  );

  const options = useRecipientOptionMemo(state, integrationsMapper);

  const onFilter = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement> | null) => {
      // Ignore filter calls with null event
      if (e === null) {
        return options;
      }

      const search = e.target.value?.trim();
      if (search === '') {
        dispatchers.useDefaults();
      } else {
        dispatchers.loadFilterValue(search);
      }

      return options;
    },
    [dispatchers, options]
  );

  const selection = React.useMemo(() => {
    const sel = props.selected;
    if (
      sel === undefined ||
      sel.name === undefined ||
      sel.id === undefined ||
      sel.type === undefined
    ) {
      return undefined;
    }

    return new RecipientOption(new IntegrationRecipient(sel as IntegrationRef));
  }, [props.selected]);

  const onSelect = React.useCallback(
    (_event, value: string | SelectOptionObject) => {
      const integrationSelected = props.onSelected;
      if (value instanceof RecipientOption) {
        integrationSelected(value);
        setOpen(false);
      }
    },
    [props.onSelected]
  );

  const chooseText = `Choose ${Config.integrations.types[
    props.integrationType
  ].name.toLowerCase()}`;

  return (
    <div {...getOuiaProps('IntegrationRecipientTypeahead', props)}>
      <Select
        maxHeight={400}
        variant={SelectVariant.typeahead}
        typeAheadAriaLabel={chooseText}
        placeholderText={chooseText}
        selections={selection}
        onSelect={onSelect}
        onToggle={(_e, isOpen) => toggle(isOpen)}
        isOpen={isOpen}
        onFilter={onFilter}
        menuAppendTo={document.body}
        isDisabled={props.isDisabled}
        validated={props.error ? 'error' : undefined}
      >
        {options}
      </Select>
    </div>
  );
};
