import { Button, ButtonVariant, GridItem } from '@patternfly/react-core';
import { MinusCircleIcon, PlusCircleIcon } from '@patternfly/react-icons';
import {
  IActions,
  ICell,
  IRow,
  IRowData,
  Table,
  TableBody,
  TableHeader,
  TableVariant,
  cellWidth,
} from '@patternfly/react-table';
import { important } from 'csx';
import { FieldArrayRenderProps, FormikProps } from 'formik';
import produce, { Draft, castDraft } from 'immer';
import * as React from 'react';
import { DeepPartial } from 'ts-essentials';
import { cssRaw, style } from 'typestyle';

import {
  Action,
  BehaviorGroup,
  NewBehaviorGroup,
  NotificationType,
} from '../../../types/Notification';
import { RecipientForm } from '../EditableActionRow/RecipientForm';
import { ActionTypeahead } from '../Form/ActionTypeahead';
import {
  SetActionUpdater,
  UseBehaviorGroupActionHandlers,
  useBehaviorGroupActionHandlers,
} from './useBehaviorGroupActionHandlers';

cssRaw(`
    @media only screen and (max-width: 768px) {
        .pf-c-select .pf-c-select__toggle-typeahead {
            --pf-c-select__toggle-typeahead--FlexBasis: 0;
        }
    }
`);

export type BehaviorGroupFormTableProps = FieldArrayRenderProps & {
  form: FormikProps<FormType>;
};

type FormType = DeepPartial<BehaviorGroup | NewBehaviorGroup>;

const tableHeaderClassName = style({
  $nest: {
    '& tr': {
      borderBottom: important(0),
    },
    '& th:first-child': {
      paddingLeft: important(0),
    },
    '& th:last-child, & td:last-child': {
      paddingRight: important(0),
    },
  },
});

const tableBodyClassName = style({
  $nest: {
    '& td:first-child': {
      paddingLeft: important(0),
    },
    '& td:last-child': {
      paddingRight: important(0),
    },
    '& td': {
      verticalAlign: important('top'),
    },
  },
});

const alignLeftClassName = style({
  textAlign: 'left',
  paddingLeft: 0,
});

const cells: Array<ICell> = [
  {
    title: 'Actions',
    transforms: [cellWidth(50)],
  },
  {
    title: 'Recipient',
  },
];

const toTableRows = (
  actions: ReadonlyArray<Action | undefined>,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  errors: any,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  touched: any,
  selectedNotifications: ReadonlyArray<NotificationType>,
  rowHandlers: UseBehaviorGroupActionHandlers,
  setFieldTouched: (
    field: string,
    isTouched?: boolean,
    shouldValidate?: boolean
  ) => void
): Array<IRow> => {
  return actions.map((action, index) => {
    let error: string | undefined = undefined;
    let isTouched = false;
    let path;

    if (action?.type === NotificationType.INTEGRATION) {
      path = `actions.${index}.integration`;
    } else {
      path = `actions.${index}.recipient`;
    }

    if (action?.type === NotificationType.INTEGRATION) {
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
          title: (
            <ActionTypeahead
              selectedNotifications={selectedNotifications}
              action={action}
              onSelected={rowHandlers.handleActionSelected(index)}
            />
          ),
        },
        {
          title: (
            <RecipientForm
              action={action}
              integrationSelected={rowHandlers.handleIntegrationSelected(index)}
              recipientSelected={rowHandlers.handleRecipientSelected(index)}
              recipientOnClear={rowHandlers.handleRecipientOnClear(index)}
              error={error}
              onOpenChange={(isOpen) => {
                if (!isOpen) {
                  setFieldTouched(path, true, false);
                }
              }}
            />
          ),
        },
      ],
    };
  });
};

const emptySpan = () => <span />;

export const BehaviorGroupFormActionsTable: React.FunctionComponent<BehaviorGroupFormTableProps> =
  (props) => {
    const { values, setValues, errors, touched, setFieldTouched } = props.form;
    const actions = React.useMemo<ReadonlyArray<Action | undefined>>(
      () => values.actions ?? ([] as ReadonlyArray<Action>),
      [values]
    );
    const touchedActions = React.useMemo(
      () => touched?.actions ?? [],
      [touched]
    );
    const errorActions = React.useMemo(() => errors?.actions ?? [], [errors]);

    const selectedNotifications = React.useMemo(
      () =>
        new Array(
          ...new Set<NotificationType>(
            (actions.filter((a) => a) as ReadonlyArray<Action>).map(
              (a) => a.type
            )
          )
        ) as ReadonlyArray<NotificationType>,
      [actions]
    );

    const setValueDispatch = React.useCallback(
      (updater: SetActionUpdater) => {
        setValues(
          produce((prev) => {
            const form = prev as Draft<FormType>;
            if (updater instanceof Function) {
              form.actions = castDraft(
                updater(form.actions as ReadonlyArray<DeepPartial<Action>>)
              );
            } else {
              form.actions = castDraft(updater);
            }
          }),
          false
        );
      },
      [setValues]
    );

    const addAction = React.useCallback(() => {
      const push = props.push;
      push(undefined);
    }, [props.push]);

    React.useEffect(() => {
      if (actions.length === 0) {
        addAction();
      }
    }, [actions, addAction]);

    const rowHandlers = useBehaviorGroupActionHandlers(setValueDispatch);

    const rows = React.useMemo(
      () =>
        toTableRows(
          actions,
          errorActions,
          touchedActions,
          selectedNotifications,
          rowHandlers,
          setFieldTouched
        ),
      [
        actions,
        errorActions,
        touchedActions,
        selectedNotifications,
        rowHandlers,
        setFieldTouched,
      ]
    );

    const actionResolver = React.useCallback(
      (rowData: IRowData): IActions => {
        const handleRemove = props.handleRemove;
        if (rows.length > 1) {
          return [
            {
              key: 'delete',
              title: (
                <Button
                  aria-label="delete-action"
                  variant={ButtonVariant.plain}
                >
                  <MinusCircleIcon />
                </Button>
              ),
              isOutsideDropdown: true,
              onClick: handleRemove(rowData.id),
            },
          ];
        }

        return [];
      },
      [rows, props.handleRemove]
    );

    return (
      <>
        <Table
          aria-label="behavior-group-actions-form"
          rows={rows}
          cells={cells}
          actionResolver={actionResolver}
          actionsToggle={
            emptySpan as any /* eslint-disable-line @typescript-eslint/no-explicit-any */
          }
          borders={false}
          variant={TableVariant.compact}
          isStickyHeader={true}
        >
          <TableHeader className={tableHeaderClassName} />
          <TableBody className={tableBodyClassName} />
        </Table>
        <GridItem span={12}>
          <Button
            className={alignLeftClassName}
            variant={ButtonVariant.link}
            icon={<PlusCircleIcon />}
            onClick={addAction}
          >
            Add action
          </Button>
        </GridItem>
      </>
    );
  };
