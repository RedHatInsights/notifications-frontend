import {
    Action,
    ActionIntegration,
    ActionNotify,
    ActionType,
    DefaultNotificationBehavior
} from '../../types/Notification';
import * as React from 'react';
import { style } from 'typestyle';
import { OuiaComponentProps, Spacer } from '@redhat-cloud-services/insights-common-typescript';
import { getOuiaProps } from '../../utils/getOuiaProps';
import { Select, SelectOption, SelectOptionObject, SelectVariant } from '@patternfly/react-core';
import { Messages } from '../../properties/Messages';
import { FieldArray, useFormikContext } from 'formik';

const tableClassName = style({
    paddingTop: Spacer.LG,
    display: 'block',
    $nest: {
        '& td, & th': {
            paddingTop: Spacer.SM,
            paddingBottom: Spacer.SM,
            paddingLeft: Spacer.MD,
            paddingRight: Spacer.MD
        }
    }
});

export interface EditableActionTableProps extends OuiaComponentProps {
    actions: Array<Action>;
    path: string;
}

class ActionOption implements SelectOptionObject {
    readonly action: Readonly<Action>;

    constructor(action: Action) {
        this.action = { ...action };
    }

    compareTo(selectOption: any): boolean {
        if (selectOption instanceof ActionOption) {
            if (this.action.type === selectOption.action.type) {
                if (this.action.type === ActionType.INTEGRATION) {
                    const integrationAction = selectOption.action as ActionIntegration;
                    return this.action.integrationName === integrationAction.integrationName;
                } else {
                    return true;
                }
            }
        }

        return false;
    }

    toString(): string {
        const actionName = Messages.components.notifications.types[this.action.type];
        if (this.action.type === ActionType.INTEGRATION) {
            return `${actionName}: ${this.action.integrationName}`;
        }

        return actionName;
    }
}

const getSelectOptions = () => [
    ...([ ActionType.DRAWER, ActionType.EMAIL, ActionType.PLATFORM_ALERT ] as Array<ActionNotify['type']>)
    .map(type => new ActionOption({
        type,
        recipient: []
    })),
    ...[ 'Slack', 'PagerDuty', 'Webhook' ].map(name => new ActionOption({
        type: ActionType.INTEGRATION,
        integrationName: name
    }))
];

const getRecipientOptions = () => [
    'Admin',
    'Another one',
    'Default user access',
    'Security admin',
    'Stakeholders'
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
            setFieldValue(`${path}.type`, value.action.type);
            if (value.action.type === ActionType.INTEGRATION) {
                setFieldValue(`${path}.integrationName`, value.action.integrationName);
            }

            setOpen(false);
        }

    }, [ setFieldValue, props.path, setOpen ]);

    return (
        <Select
            variant={ SelectVariant.typeahead }
            typeAheadAriaLabel="Select an action type"
            selections={ new ActionOption(props.action) }
            onToggle={ toggle }
            isOpen={ isOpen }
            onSelect={ onSelect }
        >
            { getSelectOptions().map(o => <SelectOption key={ o.toString() } value={ o } />) }
        </Select>
    );
};

export interface RecipientTypeaheadProps {
    selected: Array<string> | undefined;
    path: string;
}

export const RecipientTypeahead: React.FunctionComponent<RecipientTypeaheadProps> = (props) => {
    const [ isOpen, setOpen ] = React.useState(false);

    const toggle = React.useCallback((isOpen: boolean) => {
        setOpen(isOpen);
    }, [ setOpen ]);

    if (props.selected === undefined) {
        return (
            <Select
                variant={ SelectVariant.typeahead }
                isDisabled={ true }
                selections={ 'N/A' }
                onToggle={ toggle }
            >
                { [ <SelectOption key="N/A" value="N/A" /> ] }
            </Select>
        );
    }

    return (
        <FieldArray name={ `${props.path}.recipient` }>
            { helpers => {

                const onSelect = (_event, value: string | SelectOptionObject) => {
                    if (props.selected) {
                        const index = props.selected.indexOf(value.toString());
                        if (index === -1) {
                            helpers.push(value);
                        } else {
                            helpers.remove(index);
                        }
                    }
                };

                return (
                    <Select
                        variant={ SelectVariant.typeaheadMulti }
                        typeAheadAriaLabel="Select the recipients"
                        selections={ props.selected }
                        onSelect={ onSelect }
                        onToggle={ toggle }
                        isOpen={ isOpen }
                    >
                        { getRecipientOptions().map(r => <SelectOption key={ r } value={ r } />) }
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
                                        <RecipientTypeahead
                                            path={ `${props.path}.${index}` }
                                            selected={ a.type === ActionType.INTEGRATION ? undefined : a.recipient }
                                        />
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
