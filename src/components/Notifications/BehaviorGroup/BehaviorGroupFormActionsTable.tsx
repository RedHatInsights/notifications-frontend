import { Button, ButtonVariant, GridItem } from '@patternfly/react-core';
import { MinusCircleIcon, PlusCircleIcon } from '@patternfly/react-icons';
import {
    cellWidth,
    IActions,
    ICell,
    IRowData,
    Table,
    TableBody,
    TableHeader,
    TableVariant,
    IRow
} from '@patternfly/react-table';
import { important } from 'csx';
import { FieldArrayRenderProps, FormikProps } from 'formik';
import produce, { castDraft, Draft } from 'immer';
import * as React from 'react';
import { DeepPartial } from 'ts-essentials';
import { style } from 'typestyle';

import { IntegrationType } from '../../../types/Integration';
import { Action, BehaviorGroup, NewBehaviorGroup, NotificationType } from '../../../types/Notification';
import { RecipientForm } from '../EditableActionRow/RecipientForm';
import { ActionTypeahead } from '../Form/ActionTypeahead';
import { EditBehaviorGroupProps } from './BehaviorGroupForm';
import {
    SetActionUpdater,
    UseBehaviorGroupActionHandlers,
    useBehaviorGroupActionHandlers
} from './useBehaviorGroupActionHandlers';

export type BehaviorGroupFormTableProps =
    FieldArrayRenderProps & GetRecipientAndIntegrationsHandler & {
    form: FormikProps<FormType>;
}

type FormType = DeepPartial<BehaviorGroup | NewBehaviorGroup>;
type GetRecipientAndIntegrationsHandler = Pick<EditBehaviorGroupProps, 'getRecipients' | 'getIntegrations'>;

const tableHeaderClassName = style({
    $nest: {
        '& tr': {
            borderBottom: important(0)
        },
        '& th:first-child': {
            paddingLeft: important(0)
        },
        '& th:last-child, & td:last-child': {
            paddingRight: important(0)
        }
    }
});

const tableBodyClassName = style({
    $nest: {
        '& td:first-child': {
            paddingLeft: important(0)
        },
        '& td:last-child': {
            paddingRight: important(0)
        }
    }
});

const alignLeftClassName = style({
    textAlign: 'left',
    paddingLeft: 0
});

const cells: Array<ICell> = [
    {
        title: 'Actions',
        transforms: [ cellWidth(50) ]
    },
    {
        title: 'Recipient'
    }
];

const toTableRows = (
    actions: ReadonlyArray<Action>,
    errors: any,
    touched: any,
    selectedNotifications: ReadonlyArray<NotificationType>,
    rowHandlers: UseBehaviorGroupActionHandlers,
    globalHandlers: GetRecipientAndIntegrationsHandler,
    setFieldTouched: (field: string, isTouched?: boolean, shouldValidate?: boolean) => void
): Array<IRow> => {
    return actions.map((action, index) => {
        let error: string | undefined = undefined;
        let isTouched = false;
        let path;

        if (action.type === NotificationType.INTEGRATION) {
            path = `actions.${index}.integration`;
        } else {
            path = `actions.${index}.recipient`;
        }

        if (action.type === NotificationType.INTEGRATION) {
            if (touched[index]?.integration) {
                isTouched = true;
            }

            if (isTouched && errors[index]?.integration) {
                error = 'Select a recipient for this integration.';
            }
        }

        if (!error && isTouched) {
            setFieldTouched(path, false, false);
        }

        return {
            id: index,
            key: index,
            cells: [
                {
                    title: <ActionTypeahead
                        selectedNotifications={ selectedNotifications }
                        action={ action }
                        onSelected={ rowHandlers.handleActionSelected(index) }
                    />
                },
                {
                    title: <RecipientForm
                        action={ action }
                        integrationSelected={ rowHandlers.handleIntegrationSelected(index) }
                        recipientSelected={ rowHandlers.handleRecipientSelected(index) }
                        recipientOnClear={ rowHandlers.handleRecipientOnClear(index) }
                        getRecipients={ globalHandlers.getRecipients }
                        getIntegrations={ globalHandlers.getIntegrations }
                        error={ error }
                        onOpenChange={ isOpen => {
                            if (!isOpen) {
                                setFieldTouched(path, true, false);
                            }
                        } }
                    />
                }
            ]
        };
    });
};

const emptySpan = () => <span />;

export const BehaviorGroupFormActionsTable: React.FunctionComponent<BehaviorGroupFormTableProps> = (props) => {

    const { values, setValues, isSubmitting, errors, touched, setFieldTouched } = props.form;
    const actions = React.useMemo<ReadonlyArray<Action>>(() => values.actions ?? [] as ReadonlyArray<Action>, [ values ]);
    const touchedActions = React.useMemo(() => touched?.actions ?? [], [ touched ]);
    const errorActions = React.useMemo(() => errors?.actions ?? [], [ errors ]);

    const selectedNotifications = React.useMemo(
        () => new Array(...new Set<NotificationType>(actions.map(a => a.type))) as ReadonlyArray<NotificationType>,
        [ actions ]
    );

    const globalHandlers = React.useMemo(() => ({
        getIntegrations: props.getIntegrations,
        getRecipients: props.getRecipients
    }), [ props.getIntegrations, props.getRecipients ]);

    const setValueDispatch = React.useCallback((updater: SetActionUpdater) => {
        setValues(produce(prev => {
            const form = (prev as Draft<FormType>);
            if (updater instanceof Function) {
                form.actions = castDraft(updater(form.actions as ReadonlyArray<DeepPartial<Action>>));
            } else {
                form.actions = castDraft(updater);
            }
        }), false);
    }, [ setValues ]);

    const addAction = React.useCallback(() => {
        const push = props.push;
        let newAction: DeepPartial<Action>;
        if (selectedNotifications.includes(NotificationType.EMAIL_SUBSCRIPTION)) {
            newAction = {
                type: NotificationType.INTEGRATION,
                integration: {
                    type: IntegrationType.WEBHOOK
                }
            };
        } else {
            newAction = {
                type: NotificationType.EMAIL_SUBSCRIPTION,
                integrationId: '',
                recipient: []
            };
        }

        push(newAction);
    }, [ props.push, selectedNotifications ]);

    React.useEffect(() => {
        if (actions.length === 0) {
            addAction();
        }
    }, [ actions, addAction ]);

    const rowHandlers = useBehaviorGroupActionHandlers(setValueDispatch);

    const rows = React.useMemo(
        () => toTableRows(actions, errorActions, touchedActions, selectedNotifications, rowHandlers, globalHandlers, setFieldTouched),
        [ actions, errorActions, touchedActions, selectedNotifications, rowHandlers, globalHandlers, setFieldTouched ]
    );

    const actionResolver = React.useCallback((rowData: IRowData): IActions => {
        const handleRemove = props.handleRemove;
        if (rows.length > 1) {
            return [
                {
                    key: 'delete',
                    title: <Button aria-label="delete-action" variant={ ButtonVariant.plain }>
                        <MinusCircleIcon />
                    </Button>,
                    isOutsideDropdown: true,
                    onClick: handleRemove(rowData.id)
                }
            ];
        }

        return [];
    }, [ rows, props.handleRemove ]);

    return (
        <>
            <Table
                aria-label="behavior-group-actions-form"
                rows={ rows }
                cells={ cells }
                actionResolver={ actionResolver }
                actionsToggle={ emptySpan as any }
                borders={ false }
                variant={ TableVariant.compact }
            >
                <TableHeader className={ tableHeaderClassName } />
                <TableBody className={ tableBodyClassName } />
            </Table>
            <GridItem span={ 12 }>
                <Button
                    className={ alignLeftClassName }
                    variant={ ButtonVariant.link }
                    icon={ <PlusCircleIcon /> }
                    onClick={ addAction }
                    isDisabled={ isSubmitting }
                >
                    Add action
                </Button>
            </GridItem>
        </>
    );
};
