import { Button, ButtonVariant, Form, Grid, GridItem, Split, SplitItem } from '@patternfly/react-core';
import { MinusCircleIcon, PlusCircleIcon } from '@patternfly/react-icons';
import { global_spacer_md } from '@patternfly/react-tokens';
import {
    FormTextInput,
    OuiaComponentProps,
    ouiaIdConcat
} from '@redhat-cloud-services/insights-common-typescript';
import { FieldArray, FieldArrayRenderProps, FormikProps } from 'formik';
import * as React from 'react';
import { style } from 'typestyle';

import { UserIntegrationType } from '../../../types/Integration';
import {
    Action,
    BehaviorGroup,
    IntegrationRef,
    NewBehaviorGroup, NotificationType
} from '../../../types/Notification';
import { getOuiaProps } from '../../../utils/getOuiaProps';
import { RecipientForm } from '../EditableActionRow/RecipientForm';
import { useEditableActionRow } from '../EditableActionRow/useEditableActionRow';
import { ActionTypeahead } from '../Form/ActionTypeahead';

interface EditBehaviorGroupProps extends OuiaComponentProps {
    getRecipients: (search: string) => Promise<Array<string>>;
    getIntegrations: (type: UserIntegrationType, search: string) => Promise<Array<IntegrationRef>>;
    behaviorGroup?: Partial<BehaviorGroup>;
}

type FormType = BehaviorGroup | NewBehaviorGroup;

type ActionsArraysProps = FieldArrayRenderProps & Pick<EditBehaviorGroupProps, 'getRecipients' | 'getIntegrations'>  & {
    form: FormikProps<FormType>;
}

type ActionRowProps = {
    action: Action;
    path: string;
    getRecipients: (search: string) => Promise<Array<string>>;
    getIntegrations: (type: UserIntegrationType, search: string) => Promise<Array<IntegrationRef>>;
    onRemove?: () => void;
};

const alignLeftClassName = style({
    textAlign: 'left',
    paddingLeft: 0
});

const subtitleClassName = style({
    paddingBottom: global_spacer_md.var
});

const ActionRow: React.FunctionComponent<ActionRowProps> = props => {
    const {
        recipientSelected,
        recipientOnClear,
        integrationSelected,
        actionSelected
    } = useEditableActionRow(props.path);

    return (
        <>
            <GridItem span={ 6 }>
                <ActionTypeahead
                    action={ props.action }
                    onSelected={ actionSelected }
                />
            </GridItem>
            <GridItem span={ 6 }>
                <Split>
                    <SplitItem isFilled>
                        <RecipientForm
                            getRecipients={ props.getRecipients }
                            getIntegrations={ props.getIntegrations }
                            recipientSelected={ recipientSelected }
                            recipientOnClear={ recipientOnClear }
                            integrationSelected={ integrationSelected }
                            action={ props.action }
                        />
                    </SplitItem>
                    { props.onRemove && (
                        <SplitItem>
                            <Button variant={ ButtonVariant.plain } onClick={ props.onRemove }>
                                <MinusCircleIcon />
                            </Button>
                        </SplitItem>
                    ) }
                </Split>
            </GridItem>
        </>
    );
};

const ActionsArray: React.FunctionComponent<ActionsArraysProps> = props => {
    const { values, isSubmitting } = props.form;
    const actions = React.useMemo(() => values.actions ?? [] as Array<Action>, [ values ]);

    const addAction = React.useCallback(() => {
        const push = props.push;
        const newAction: Action = {
            type: NotificationType.EMAIL_SUBSCRIPTION,
            integrationId: '',
            recipient: []
        };

        push(newAction);
    }, [ props.push ]);

    React.useEffect(() => {
        if (actions.length === 0) {
            addAction();
        }
    }, [ actions, addAction ]);

    return (
        <>
            <GridItem span={ 6 }>
                <b>Actions</b>
            </GridItem>
            <GridItem span={ 6 }>
                <b>Recipient</b>
            </GridItem>
            { actions.map((action, index) => (
                <ActionRow key={ `${index}-${action.integrationId}` }
                    action={ action }
                    getIntegrations={ props.getIntegrations }
                    getRecipients={ props.getRecipients }
                    path={ `actions.${index}` }
                    onRemove={ actions.length > 1 ? props.handleRemove(index) : undefined }
                />
            )) }
            <GridItem span={ 6 }>
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

export const EditBehaviorGroupForm: React.FunctionComponent<EditBehaviorGroupProps> = props => {
    return (
        <div { ... getOuiaProps('Notifications/BehaviorGroupForm', props) }>
            <div className={ subtitleClassName }>Enter a name and add actions for your new group.</div>
            <Form>
                <Grid hasGutter>
                    <GridItem span={ 12 }>
                        <FormTextInput
                            ouiaId={ ouiaIdConcat(props.ouiaId, 'group-name') }
                            label="Group name"
                            name="displayName"
                            id="group-name"
                        />
                    </GridItem>
                    <FieldArray name="actions">
                        { helpers => <ActionsArray
                            { ...helpers }
                            getRecipients={ props.getRecipients }
                            getIntegrations={ props.getIntegrations }
                        /> }
                    </FieldArray>
                </Grid>
            </Form>
        </div>
    );
};
