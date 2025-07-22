import { useFormikContext } from 'formik';
import * as React from 'react';
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
import { useRecipientContext } from '../RecipientContext';
import { RecipientOption } from './RecipientOption';
import { useTypeaheadReducer } from './useTypeaheadReducer';
import {
  MenuToggle,
  MenuToggleElement,
  Select,
  SelectList,
  SelectOption,
  Skeleton,
  TextInputGroup,
  TextInputGroupMain,
} from '@patternfly/react-core';
import { OuiaProps } from '@redhat-cloud-services/frontend-components/Ouia/Ouia';

function isRecipientOption(option: unknown): option is RecipientOption {
  return (option as RecipientOption).recipient !== undefined;
}

export interface IntegrationRecipientTypeaheadProps extends OuiaProps {
  selected: Partial<IntegrationRef> | undefined;
  integrationType: UserIntegrationType;
  isDisabled?: boolean;
  onSelected: (recipientOption: RecipientOption) => void;
  onOpenChange?: (isOpen: boolean) => void;
  error?: boolean;
}

export const IntegrationRecipientTypeahead: React.FunctionComponent<
  IntegrationRecipientTypeaheadProps
> = ({ integrationType, selected, onSelected, isDisabled }) => {
  const chooseText = React.useMemo(
    () =>
      `Choose ${Config.integrations.types[integrationType].name.toLowerCase()}`,
    [integrationType]
  );
  const [isOpen, setIsOpen] = React.useState(false);
  const [inputValue, setInputValue] = React.useState<string>('');
  const [focusedItemIndex, setFocusedItemIndex] = React.useState<number | null>(
    null
  );
  const [activeItem, setActiveItem] = React.useState<string | null>(null);
  const textInputRef = React.useRef<HTMLInputElement>();

  const { getIntegrations } = useRecipientContext();
  const { values } = useFormikContext<DeepPartial<BehaviorGroup>>();

  const [state, dispatchers] = useTypeaheadReducer<IntegrationRecipient>();

  const existingIntegrations = React.useMemo(() => {
    const integrationActions = (values.actions ?? [])
      .filter((action) => action?.type === NotificationType.INTEGRATION)
      .map((action) => (action as ActionIntegration)?.integration.id);

    return new Set<string>(integrationActions);
  }, [values]);

  React.useEffect(() => {
    setInputValue(selected?.name as string);
  }, [selected]);

  React.useEffect(() => {
    getIntegrations(integrationType, '').then((integrations) => {
      const defaults = integrations.map((i) => new IntegrationRecipient(i));
      dispatchers.setDefaults(defaults);
    });
  }, [getIntegrations, integrationType, dispatchers]);

  React.useEffect(() => {
    if (state.loadingFilter) {
      getIntegrations(integrationType, state.lastSearch).then((integrations) =>
        dispatchers.setFilterValue(
          state.lastSearch,
          integrations.map((i) => new IntegrationRecipient(i))
        )
      );
    }
  }, [
    getIntegrations,
    integrationType,
    state.loadingFilter,
    state.lastSearch,
    dispatchers,
  ]);

  const integrationsMapper = React.useCallback(
    (recipients: ReadonlyArray<IntegrationRecipient>) => {
      if ((state.loadingDefault, state.loadingFilter)) {
        return [
          <SelectOption key="loading-option">
            <Skeleton width="100%" />
          </SelectOption>,
        ];
      }

      return recipients.map((recipient, index) => {
        const isDisabled = existingIntegrations?.has(recipient.integration.id);

        const currRecipient = new RecipientOption(recipient);
        return (
          <SelectOption
            key={recipient.integration.id}
            value={currRecipient}
            description={
              isDisabled ? 'This integration has already been added' : undefined
            }
            isDisabled={isDisabled}
            isSelected={selected?.id === recipient.integration.id}
            isFocused={focusedItemIndex === index}
            ref={null}
          >
            {recipient.displayName}
          </SelectOption>
        );
      });
    },
    [
      existingIntegrations,
      focusedItemIndex,
      selected?.id,
      state.loadingDefault,
      state.loadingFilter,
    ]
  );

  const options = integrationsMapper(
    state.show === 'default' ? state.defaultValues : state.filterValues
  );

  const selection = React.useMemo(() => {
    const sel = selected;
    if (
      sel === undefined ||
      sel.name === undefined ||
      sel.id === undefined ||
      sel.type === undefined
    ) {
      return undefined;
    }

    return new RecipientOption(new IntegrationRecipient(sel as IntegrationRef));
  }, [selected]);

  const handleMenuArrowKeys = (key: string) => {
    let indexToFocus;

    if (isOpen) {
      if (key === 'ArrowUp') {
        // When no index is set or at the first index, focus to the last, otherwise decrement focus index
        if (focusedItemIndex === null || focusedItemIndex === 0) {
          indexToFocus = options.length - 1;
        } else {
          indexToFocus = focusedItemIndex - 1;
        }
      }

      if (key === 'ArrowDown') {
        // When no index is set or at the last index, focus to the first, otherwise increment focus index
        if (
          focusedItemIndex === null ||
          focusedItemIndex === options.length - 1
        ) {
          indexToFocus = 0;
        } else {
          indexToFocus = focusedItemIndex + 1;
        }
      }

      setFocusedItemIndex(indexToFocus);
      const focusedItem = options.filter((option) => !option.props.isDisabled)[
        indexToFocus
      ];
      setActiveItem(
        `select-multi-typeahead-checkbox-${focusedItem.props.value.replace(
          ' ',
          '-'
        )}`
      );
    }
  };

  const onInputKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    const enabledMenuItems = options.filter(
      (menuItem) => !menuItem.props.isDisabled
    );
    const [firstMenuItem] = enabledMenuItems;
    const focusedItem = focusedItemIndex
      ? enabledMenuItems[focusedItemIndex]
      : firstMenuItem;

    switch (event.key) {
      // Select the first available option
      case 'Enter':
        if (!isOpen) {
          setIsOpen((prevIsOpen) => !prevIsOpen);
        } else if (isOpen && focusedItem.props.value !== 'no results') {
          onSelect(focusedItem.props.value);
        }
        break;
      case 'Tab':
      case 'Escape':
        setIsOpen(false);
        setActiveItem(null);
        break;
      case 'ArrowUp':
      case 'ArrowDown':
        event.preventDefault();
        handleMenuArrowKeys(event.key);
        break;
    }
  };

  const onToggleClick = () => {
    setIsOpen(!isOpen);
  };

  const onTextInputChange = (
    event: React.FormEvent<HTMLInputElement>,
    value: string
  ) => {
    setInputValue(value);

    const search = event.currentTarget.value?.trim();
    if (search === '') {
      dispatchers.useDefaults();
    } else {
      dispatchers.loadFilterValue(search);
    }
  };

  const onSelect = (value: RecipientOption) => {
    if (value) {
      onSelected(value);
      setIsOpen(false);
    }

    setInputValue(value.toString());
  };

  const toggle = (toggleRef: React.Ref<MenuToggleElement>) => (
    <MenuToggle
      variant="typeahead"
      onClick={onToggleClick}
      innerRef={toggleRef}
      isExpanded={isOpen}
      isFullWidth
      data-ouia-component-type="PF6/typeahead"
    >
      <TextInputGroup isPlain isDisabled={isDisabled}>
        <TextInputGroupMain
          value={inputValue}
          onClick={onToggleClick}
          onChange={onTextInputChange}
          onKeyDown={onInputKeyDown}
          id="multi-typeahead-select-checkbox-input"
          autoComplete="off"
          innerRef={textInputRef}
          placeholder={chooseText}
          {...(activeItem && { 'aria-activedescendant': activeItem })}
          role="combobox"
          isExpanded={isOpen}
          aria-controls="select-multi-typeahead-checkbox-listbox"
        />
      </TextInputGroup>
    </MenuToggle>
  );

  return (
    <Select
      role="menu"
      id="multi-typeahead-checkbox-select"
      isOpen={isOpen}
      selected={selection}
      onSelect={(_ev, selection) => {
        if (isRecipientOption(selection)) {
          onSelect(selection as RecipientOption);
        }
      }}
      onOpenChange={() => setIsOpen(false)}
      toggle={toggle}
    >
      <SelectList id="select-multi-typeahead-checkbox-listbox">
        {options}
      </SelectList>
    </Select>
  );
};
