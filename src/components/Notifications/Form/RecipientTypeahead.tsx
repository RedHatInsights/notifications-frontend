import { Label, LabelGroup, Skeleton } from '@patternfly/react-core';
import {
  MenuToggle,
  MenuToggleElement,
  Select,
  SelectGroup,
  SelectList,
  SelectOption,
} from '@patternfly/react-core';
import * as React from 'react';
import { usePrevious } from 'react-use';

import {
  BaseNotificationRecipient,
  NotificationRbacGroupRecipient,
  NotificationUserRecipient,
} from '../../../types/Recipient';
import { getOuiaProps } from '../../../utils/getOuiaProps';
import { GroupNotFound } from '../Rbac/GroupNotFound';
import { useRecipientContext } from '../RecipientContext';
import { RecipientOption } from './RecipientOption';
import { useRecipientOptionMemo } from './useRecipientOptionMemo';
import { useTypeaheadReducer } from './useTypeaheadReducer';
import { OuiaProps } from '@redhat-cloud-services/frontend-components/Ouia/Ouia';

export interface RecipientTypeaheadProps extends OuiaProps {
  selected: ReadonlyArray<BaseNotificationRecipient>;
  onSelected: (value: RecipientOption) => void;
  isDisabled?: boolean;
  onClear: () => void;
  onOpenChange?: (isOpen: boolean) => void;
  error?: boolean;
}

const rbacGroupKey = 'groups';
const rbacGroupLabel = 'User Access Groups';

const renderSelectGroup = (
  key: string,
  label: string,
  options: ReadonlyArray<BaseNotificationRecipient>
) =>
  options.length > 0 ? (
    <SelectGroup key={key} label={label}>
      {options.map((r) => {
        if (r instanceof NotificationRbacGroupRecipient && r.isLoading) {
          return (
            <SelectOption key={r.getKey()} value={new RecipientOption(r)}>
              <Skeleton width="100%" />
            </SelectOption>
          );
        }

        return (
          <SelectOption
            key={r.getKey()}
            value={new RecipientOption(r)}
            description={r.description}
          >
            {r.displayName}
          </SelectOption>
        );
      })}
    </SelectGroup>
  ) : null;

const recipientMapper = (
  recipients: ReadonlyArray<BaseNotificationRecipient>
) => {
  // eslint-disable-next-line testing-library/render-result-naming-convention
  const result = renderSelectGroup(rbacGroupKey, rbacGroupLabel, recipients);
  return result ? [result] : [];
};

const loadingMapper = () => {
  return [
    <SelectGroup key={rbacGroupKey} label={rbacGroupLabel}>
      <SelectOption key="loading-group" value={null}>
        <Skeleton width="100%" />
      </SelectOption>
    </SelectGroup>,
  ];
};

const userOptions = [
  renderSelectGroup('users', 'Users', [
    new NotificationUserRecipient(undefined, false, false),
    new NotificationUserRecipient(undefined, true, false),
  ]),
];

export const RecipientTypeahead: React.FunctionComponent<
  RecipientTypeaheadProps
> = (props) => {
  const [isOpen, setOpen] = React.useState(false);
  const [state, dispatchers] = useTypeaheadReducer<BaseNotificationRecipient>();
  const prevOpen = usePrevious(isOpen);
  const { getNotificationRecipients } = useRecipientContext();

  React.useEffect(() => {
    getNotificationRecipients().then((recipients) =>
      dispatchers.setDefaults(recipients)
    );
  }, [getNotificationRecipients, dispatchers]);

  React.useEffect(() => {
    if (state.loadingFilter) {
      getNotificationRecipients().then((recipients) =>
        dispatchers.setFilterValue(state.lastSearch, recipients)
      );
    }
  }, [
    getNotificationRecipients,
    state.loadingFilter,
    state.lastSearch,
    dispatchers,
  ]);

  React.useEffect(() => {
    const onOpenChange = props.onOpenChange;
    if (prevOpen !== undefined && prevOpen !== isOpen) {
      onOpenChange && onOpenChange(isOpen);
    }
  }, [prevOpen, isOpen, props.onOpenChange]);

  const rbacOptions = useRecipientOptionMemo(
    state,
    recipientMapper,
    loadingMapper
  );

  const options = React.useMemo(() => {
    const allOptions: React.ReactNode[] = [];

    userOptions.forEach((option) => {
      if (option) allOptions.push(option);
    });

    rbacOptions.forEach((option) => {
      if (option) allOptions.push(option);
    });

    return allOptions;
  }, [rbacOptions]);

  const selection = React.useMemo(() => {
    const sel = props.selected;
    if (sel === undefined) {
      return [];
    }

    return (sel as ReadonlyArray<NotificationUserRecipient>).map(
      (s) => new RecipientOption(s)
    );
  }, [props.selected]);

  const onSelect = React.useCallback(
    (
      _event: React.MouseEvent | undefined,
      value: string | number | RecipientOption | undefined
    ) => {
      const onSelected = props.onSelected;
      if (value instanceof RecipientOption) {
        onSelected(value);
      }
    },
    [props.onSelected]
  );

  const selectContent = React.useMemo(() => {
    return selection?.map((value) => {
      const unselect =
        (element: RecipientOption) => (evt: React.MouseEvent) => {
          evt.stopPropagation();
          onSelect(evt, element);
        };

      const key = value.recipient.getKey();

      if (value.recipient instanceof NotificationRbacGroupRecipient) {
        if (value.recipient.isLoading) {
          return (
            <Label variant="outline" key={key} onClose={unselect(value)}>
              <Skeleton data-testid="loading-group" width="40px" />
            </Label>
          );
        } else if (value.recipient.hasError) {
          return <GroupNotFound key={key} onClose={unselect(value)} />;
        }
      }

      return (
        <Label variant="outline" onClose={unselect(value)} key={key}>
          {value.recipient.displayName}
        </Label>
      );
    });
  }, [selection, onSelect]);

  const toggleContent = React.useMemo(() => {
    if (selectContent && selectContent.length > 0) {
      return <LabelGroup>{selectContent}</LabelGroup>;
    }
    return 'Select recipients...';
  }, [selectContent]);

  return (
    <div {...getOuiaProps('RecipientTypeahead', props)}>
      <Select
        isOpen={isOpen}
        selected={selection}
        onSelect={onSelect}
        onOpenChange={(isOpen) => setOpen(isOpen)}
        toggle={(toggleRef: React.Ref<MenuToggleElement>) => (
          <MenuToggle
            ref={toggleRef}
            onClick={() => setOpen(!isOpen)}
            isExpanded={isOpen}
            isDisabled={props.isDisabled}
            status={props.error ? 'danger' : undefined}
            style={{ width: '100%' }}
          >
            {toggleContent}
          </MenuToggle>
        )}
      >
        <SelectList>
          {options.map((optionGroup, groupIndex) => {
            if (
              React.isValidElement(optionGroup) &&
              optionGroup.type === SelectGroup
            ) {
              return React.cloneElement(optionGroup, { key: groupIndex });
            }
            return optionGroup;
          })}
        </SelectList>
      </Select>
    </div>
  );
};
