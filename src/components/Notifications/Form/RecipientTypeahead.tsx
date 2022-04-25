import { Chip, ChipGroup, Select, SelectGroup, SelectOption, SelectOptionObject, SelectVariant, Skeleton } from '@patternfly/react-core';
import { OuiaComponentProps } from '@redhat-cloud-services/insights-common-typescript';
import * as React from 'react';
import { usePrevious } from 'react-use';

import { BaseNotificationRecipient, NotificationRbacGroupRecipient, NotificationUserRecipient } from '../../../types/Recipient';
import { getOuiaProps } from '../../../utils/getOuiaProps';
import { GroupNotFound } from '../Rbac/GroupNotFound';
import { useRecipientContext } from '../RecipientContext';
import { RecipientOption } from './RecipientOption';
import { useRecipientOptionMemo } from './useRecipientOptionMemo';
import { useTypeaheadReducer } from './useTypeaheadReducer';

export interface RecipientTypeaheadProps extends OuiaComponentProps {
    selected: ReadonlyArray<BaseNotificationRecipient>;
    onSelected: (value: RecipientOption) => void;
    isDisabled?: boolean;
    onClear: () => void;
    onOpenChange?: (isOpen: boolean) => void;
    error?: boolean;
}

const rbacGroupKey = 'groups';
const rbacGroupLabel = 'User Access Groups';

const renderSelectGroup = (key: string, label: string, options: ReadonlyArray<BaseNotificationRecipient>) => (
    options.length > 0 ? <SelectGroup key={ key } label={ label }>
        { options.map(r => {
            if (r instanceof NotificationRbacGroupRecipient && r.isLoading) {
                return <SelectOption
                    key={ r.getKey() }
                    isNoResultsOption
                >
                    <Skeleton width="100%" />
                </SelectOption>;
            }

            return <SelectOption
                key={ r.getKey() }
                value={ new RecipientOption(r) }
                description={ r.description }
            />;
        }) }
    </SelectGroup> : <React.Fragment />
);

const recipientMapper = (recipients: ReadonlyArray<BaseNotificationRecipient>) => {
    return [
        renderSelectGroup(rbacGroupKey, rbacGroupLabel, recipients)
    ];
};

const loadingMapper = () => {
    return [
        <SelectGroup key={ rbacGroupKey } label={ rbacGroupLabel }>
            <SelectOption
                key="loading-group"
                isNoResultsOption={ true }
            >
                <Skeleton width="100%" />
            </SelectOption>
        </SelectGroup>
    ];
};

const userOptions = [
    renderSelectGroup('users', 'Users', [
        new NotificationUserRecipient(undefined, false),
        new NotificationUserRecipient(undefined, true)
    ])
];

export const RecipientTypeahead: React.FunctionComponent<RecipientTypeaheadProps> = (props) => {
    const [ isOpen, setOpen ] = React.useState(false);
    const [ state, dispatchers ] = useTypeaheadReducer<BaseNotificationRecipient>();
    const prevOpen = usePrevious(isOpen);
    const { getNotificationRecipients } = useRecipientContext();

    React.useEffect(() => {
        getNotificationRecipients().then(recipients => dispatchers.setDefaults(recipients));
    }, [ getNotificationRecipients, dispatchers ]);

    React.useEffect(() => {
        if (state.loadingFilter) {
            getNotificationRecipients().then(recipients => dispatchers.setFilterValue(
                state.lastSearch,
                recipients
            ));
        }
    }, [ getNotificationRecipients, state.loadingFilter, state.lastSearch, dispatchers ]);

    const toggle = React.useCallback((isOpen: boolean) => {
        setOpen(isOpen);
    }, [ setOpen ]);

    React.useEffect(() => {
        const onOpenChange = props.onOpenChange;
        if (prevOpen !== undefined && prevOpen !== isOpen) {
            onOpenChange && onOpenChange(isOpen);
        }
    }, [ prevOpen, isOpen, props.onOpenChange ]);

    // We probably need to augment these.
    // Change to use this  mapper only for the groups and prepend the Users
    const rbacOptions = useRecipientOptionMemo(state, recipientMapper, loadingMapper);
    // augment rbacOptions
    const options = React.useMemo(() => [ ...userOptions, ...rbacOptions ], [ rbacOptions ]);

    const selection = React.useMemo(() => {
        const sel = props.selected;
        if (sel === undefined) {
            return undefined;
        }

        return (sel as ReadonlyArray<NotificationUserRecipient>).map(s => new RecipientOption(s));

    }, [ props.selected ]);

    const onSelect = React.useCallback((_event, value: string | SelectOptionObject) => {
        const onSelected = props.onSelected;
        if (value instanceof RecipientOption) {
            onSelected(value);
        }

    }, [ props.onSelected ]);

    const selectContent = React.useMemo(() => {
        return selection?.map(value => {
            const unselect = (element: RecipientOption) => (evt: React.MouseEvent) => {
                evt.stopPropagation();
                onSelect(evt, element);
            };

            const key = value.recipient.getKey();

            if (value.recipient instanceof NotificationRbacGroupRecipient) {
                if (value.recipient.isLoading) {
                    return <Chip key={ key } onClick={ unselect(value) }><Skeleton data-testid="loading-group" width="40px" /></Chip>;
                } else if (value.recipient.hasError) {
                    return <GroupNotFound key={ key } onClose={ unselect(value) } />;
                }

            }

            return <Chip onClick={ unselect(value) } key={ key }>{ value.recipient.displayName }</Chip>;
        });
    }, [ selection, onSelect ]);

    return (
        <div { ...getOuiaProps('RecipientTypeahead', props) }>
            <Select
                maxHeight={ 400 }
                variant={ SelectVariant.checkbox }
                selections={ selection }
                onSelect={ onSelect }
                onToggle={ toggle }
                isOpen={ isOpen }
                menuAppendTo={ document.body }
                isDisabled={ props.isDisabled }
                onClear={ props.onClear }
                validated={ props.error ? 'error' : undefined  }
                isGrouped
                isCheckboxSelectionBadgeHidden
                // hasInlineFilter // Disabled filter. see: https://github.com/patternfly/patternfly-react/issues/7134
                isInputValuePersisted
                placeholderText={ <ChipGroup>{ selectContent }</ChipGroup> }
            >
                { options }
            </Select>
        </div>
    );
};
