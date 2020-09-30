import {
    Action,
    ActionNotify,
    DefaultNotificationBehavior,
    IntegrationRef,
    NotificationType
} from '../../types/Notification';
import * as React from 'react';
import { style } from 'typestyle';
import { OuiaComponentProps, Spacer } from '@redhat-cloud-services/insights-common-typescript';
import { getOuiaProps } from '../../utils/getOuiaProps';
import { Button, ButtonVariant, Select, SelectOption, SelectOptionObject, SelectVariant } from '@patternfly/react-core';
import { TimesIcon } from '@patternfly/react-icons';
import { Messages } from '../../properties/Messages';
import { FieldArray, useFormikContext } from 'formik';
import { IntegrationType } from '../../types/Integration';

const tableClassName = style({
    paddingTop: Spacer.LG,
    display: 'block',
    $nest: {
        '& td, & th': {
            paddingTop: Spacer.SM,
            paddingBottom: Spacer.SM,
            paddingLeft: Spacer.MD,
            paddingRight: Spacer.MD
        },
        '& th': {
            width: '500px'
        },
        '& th:last-child': {
            width: '80px'
        }
    }
});

export interface EditableActionTableProps extends OuiaComponentProps {
    actions: Array<Action>;
    path: string;
    getRecipients: (search: string) => Array<string>;
    getIntegrations: (type: IntegrationType, search: string) => Array<IntegrationRef>;
    handleRemove?: (index: number) => () => void;
}

type ActionTypeOrIntegration = {
    kind: 'integration';
    type: IntegrationType;
} | {
    kind: 'notification';
    type: NotificationType;
}

class ActionOption implements SelectOptionObject {
    readonly integrationType: IntegrationType | undefined;
    readonly notificationType: NotificationType;

    constructor(type: ActionTypeOrIntegration) {
        if (type.kind === 'integration') {
            this.notificationType = NotificationType.INTEGRATION;
            this.integrationType = type.type;
        } else {
            this.notificationType = type.type;
            this.integrationType = undefined;
        }
    }

    compareTo(selectOption: any): boolean {
        if (selectOption instanceof ActionOption) {
            return selectOption.notificationType === this.notificationType && selectOption.integrationType === this.integrationType;
        }

        return false;
    }

    toString(): string {
        const actionName = Messages.components.notifications.types[this.notificationType];
        if (this.integrationType) {
            const integrationName = Messages.components.integrations.integrationType[this.integrationType];
            return `${actionName}: ${integrationName}`;
        }

        return actionName;
    }
}

class RecipientOption implements SelectOptionObject {
    readonly recipientOrIntegration: string | IntegrationRef;

    constructor(recipientOrIntegration: string | IntegrationRef) {
        this.recipientOrIntegration = recipientOrIntegration;
    }

    compareTo(selectOption: any): boolean {
        if (selectOption instanceof RecipientOption && typeof selectOption.recipientOrIntegration === typeof this.recipientOrIntegration) {
            if (typeof selectOption.recipientOrIntegration === 'string') {
                return selectOption.recipientOrIntegration === this.recipientOrIntegration;
            } else {
                return selectOption.recipientOrIntegration.id === (this.recipientOrIntegration as IntegrationRef).id;
            }
        }

        return false;
    }

    toString(): string {
        if (typeof this.recipientOrIntegration === 'string') {
            return this.recipientOrIntegration;
        } else {
            return this.recipientOrIntegration.name;
        }
    }
}

const getSelectOptions = () => [
    ...([ NotificationType.DRAWER, NotificationType.EMAIL, NotificationType.PLATFORM_ALERT ] as Array<ActionNotify['type']>)
    .map(type => new ActionOption({
        kind: 'notification',
        type
    })),
    ...[ IntegrationType.WEBHOOK ].map(type => new ActionOption({
        kind: 'integration',
        type
    }))
];

export const ActionTypeahead: React.FunctionComponent<{action: Action; path: string}> = (props) => {
    const { setFieldValue } = useFormikContext<Notification | DefaultNotificationBehavior>();
    const [ isOpen, setOpen ] = React.useState(false);

    const toggle = React.useCallback(() => {
        setOpen(prev => !prev);
    }, [ setOpen ]);

    const onSelect = React.useCallback((_event, value: string | SelectOptionObject) => {
        const path = props.path;

        if (value instanceof ActionOption) {
            setFieldValue(`${path}.type`, value.notificationType);
            if (value.integrationType) {
                setFieldValue(`${path}.integration`, {
                    type: value.integrationType
                });
                setFieldValue(`${path}.recipient`, []);
            } else {
                setFieldValue(`${path}.recipient`, []);
                setFieldValue(`${path}.integration`, undefined);
            }

            setOpen(false);
        }

    }, [ setFieldValue, props.path, setOpen ]);

    const selectedOption = React.useMemo(() => {
        if (props.action.type === NotificationType.INTEGRATION) {
            return new ActionOption({
                kind: 'integration',
                type: props.action.integration.type
            });
        }

        return new ActionOption({
            kind: 'notification',
            type: props.action.type
        });
    }, [ props.action ]);

    return (
        <Select
            variant={ SelectVariant.typeahead }
            typeAheadAriaLabel="Select an action type"
            selections={ selectedOption }
            onToggle={ toggle }
            isOpen={ isOpen }
            onSelect={ onSelect }
            direction="up"
        >
            { getSelectOptions().map(o => <SelectOption key={ o.toString() } value={ o } />) }
        </Select>
    );
};

export interface IntegrationRecipientTypeaheadProps {
    selected: Partial<IntegrationRef> | undefined;
    path: string;
    getIntegrations: (type: IntegrationType, search: string) => Array<IntegrationRef>;
    integrationType: IntegrationType;
}

export const IntegrationRecipientTypeahead: React.FunctionComponent<IntegrationRecipientTypeaheadProps> = (props) => {
    const { setFieldValue } = useFormikContext<Notification | DefaultNotificationBehavior>();
    const [ isOpen, setOpen ] = React.useState(false);

    const toggle = React.useCallback((isOpen: boolean) => {
        setOpen(isOpen);
    }, [ setOpen ]);

    const onFilter = React.useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const search = e.target.value;
        const getIntegrations = props.getIntegrations;

        return getIntegrations(
            props.integrationType,
            search !== undefined ? search.trim() : '').map(r => <SelectOption key={ r.id } value={ new RecipientOption(r) }/>
        );
    }, [ props.getIntegrations, props.integrationType ]);

    const defaultIntegration = React.useMemo(() => {
        const getIntegrations = props.getIntegrations;
        return getIntegrations(props.integrationType, '').map(r => <SelectOption key={ r.id } value={ new RecipientOption(r) }/>);
    }, [ props.getIntegrations, props.integrationType ]);

    const selection = React.useMemo(() => {
        const sel = props.selected;
        if (sel === undefined || sel.name === undefined || sel.id === undefined || sel.type === undefined) {
            return undefined;
        }

        return new RecipientOption(sel as IntegrationRef);
    }, [ props.selected ]);

    const onSelect = React.useCallback((_event, value: string | SelectOptionObject) => {
        if (value instanceof RecipientOption) {
            setFieldValue(`${props.path}.integration`, value.recipientOrIntegration);
        }
    }, [ setFieldValue, props.path ]);

    return (
        <Select
            variant={ SelectVariant.typeahead }
            typeAheadAriaLabel="Select the recipients"
            selections={ selection }
            onSelect={ onSelect }
            onToggle={ toggle }
            isOpen={ isOpen }
            direction="up"
            onFilter={ onFilter }
        >
            { defaultIntegration }
        </Select>
    );
};

export interface RecipientTypeaheadProps {
    selected: Array<string> | undefined;
    path: string;
    getRecipients: (search: string) => Array<string>;
}

export const RecipientTypeahead: React.FunctionComponent<RecipientTypeaheadProps> = (props) => {
    const { setFieldValue } = useFormikContext<Notification | DefaultNotificationBehavior>();
    const [ isOpen, setOpen ] = React.useState(false);

    const toggle = React.useCallback((isOpen: boolean) => {
        setOpen(isOpen);
    }, [ setOpen ]);

    const onFilter = React.useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const search = e.target.value;
        const getRecipients = props.getRecipients;

        return getRecipients(search !== undefined ? search.trim() : '').map(r => <SelectOption key={ r } value={ new RecipientOption(r) }/>);
    }, [ props.getRecipients ]);

    const onClear = React.useCallback(() => {
        setFieldValue(`${props.path}.recipient`, []);
    }, [ props.path, setFieldValue ]);

    const defaultRecipients = React.useMemo(() => {
        const getRecipients = props.getRecipients;
        return getRecipients('').map(r => <SelectOption key={ r } value={ new RecipientOption(r) }/>);
    }, [ props.getRecipients ]);

    const selection = React.useMemo(() => {
        const sel = props.selected;
        if (sel === undefined) {
            return undefined;
        }

        return (sel as Array<string>).map(s => new RecipientOption(s));

    }, [ props.selected ]);

    return (
        <FieldArray name={ `${props.path}.recipient` }>
            { helpers => {

                const onSelect = (_event, value: string | SelectOptionObject) => {
                    if (props.selected) {
                        const index = props.selected.indexOf(value.toString());
                        if (index === -1) {
                            helpers.push(value.toString());
                        } else {
                            helpers.remove(index);
                        }
                    }
                };

                return (
                    <Select
                        variant={ SelectVariant.typeaheadMulti }
                        typeAheadAriaLabel="Select the recipients"
                        selections={ selection }
                        onSelect={ onSelect }
                        onToggle={ toggle }
                        isOpen={ isOpen }
                        direction="up"
                        onFilter={ onFilter }
                        onClear={ onClear }
                    >
                        { defaultRecipients }
                    </Select>
                );
            } }
        </FieldArray>
    );
};

export const EditableActionTable: React.FunctionComponent<EditableActionTableProps> = (props) => {

    return (
        <div { ...getOuiaProps('Notifications/EditableActionTable', props) }>
            <table className={ tableClassName }>
                <thead>
                    <tr>
                        <th>Action</th>
                        <th>Recipient</th>
                        <th/>
                    </tr>
                </thead>
                <tbody>
                    {
                        props.actions.map((a, index) => {
                            return (
                                <tr key={ index }>
                                    <td>
                                        <ActionTypeahead
                                            path={ `${props.path}.${index}` }
                                            action={ a }
                                        />
                                    </td>
                                    <td>
                                        { a.type === NotificationType.INTEGRATION ? (
                                            <IntegrationRecipientTypeahead
                                                path={ `${props.path}.${index}` }
                                                integrationType={ a.integration?.type ?? IntegrationType.WEBHOOK }
                                                selected={ a.integration }
                                                getIntegrations={ props.getIntegrations }
                                            />
                                        ) : (
                                            <RecipientTypeahead
                                                path={ `${props.path}.${index}` }
                                                selected={ a.recipient }
                                                getRecipients={ props.getRecipients }
                                            />
                                        ) }
                                    </td>
                                    <td>
                                        <Button
                                            onClick={ props.handleRemove && props.handleRemove(index) }
                                            variant={ ButtonVariant.plain }
                                        >
                                            <TimesIcon/>
                                        </Button>
                                    </td>
                                </tr>
                            );
                        })
                    }
                </tbody>
            </table>
        </div>
    );
};
