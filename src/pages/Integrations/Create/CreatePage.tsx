import * as React from 'react';
import { Messages } from '../../../properties/Messages';
import {
    Button,
    Form,
    FormGroup,
    FormSelect,
    FormSelectOption,
    Modal,
    TextInput
} from '@patternfly/react-core';
import { useEffect, useState } from 'react';
import { Integration, IntegrationType } from '../../../types/Integration';

const webhookType = Messages.pages.integrations.types.hooks;
const initialValue = '(enter hooks url)';

interface CreatePageProps {
    isModalOpen: boolean;
    model: Integration[];
    updateModal: (isOpen: boolean) => void;
    updateModel: (integrations: Array<Integration>) => void;
    currentRow?: string;
    updateCurrentRow?: (currentRowOpen: string) => void;
}

const CreatePage: React.FunctionComponent<CreatePageProps> = props => {

    const [ newUrl, updateUrl ] = useState(initialValue);
    const [ intCount, updateIntCount ] = useState(0);
    const [ pageTitle, updatePageTitle ] = useState(Messages.components.integrations.toolbar.actions.addIntegration);
    useEffect(() => {
        if (props.currentRow) {
            updatePageTitle(Messages.components.integrations.toolbar.actions.editIntegration);
            const integration = props.model.find(element => element.id === props.currentRow);
            //preload url for editing if available.
            if (integration) {
                updateUrl(integration.url);
            }
        } else {
            updatePageTitle(Messages.components.integrations.toolbar.actions.addIntegration);
        }
    }, [ props.currentRow, props.model ]);

    const handleTextFieldChanges = (evt) => {
        updateUrl(evt);
    };

    const handleExit = () => {
        updateUrl(initialValue);
        if (props.updateCurrentRow) {
            props.updateCurrentRow('');
        }

        props.updateModal(false);
    };

    const handleSubmit = () => {
        if (newUrl) {
            updateIntCount(intCount + 1);
            if (props.currentRow) {
                const integration = props.model.find(element => element.id === props.currentRow);

                if (integration) {
                    const index =  props.model.map(function(element) { return element.id; }).indexOf(integration.id);
                    integration.url = newUrl;
                    if (index === 0) {
                        props.updateModel(
                            [ integration, ...props.model.slice(1) ]
                        );
                    }
                    else if (index === props.model.length - 1) {
                        props.updateModel(
                            [ ...props.model.slice(0, props.model.length - 1), integration ]
                        );
                    }
                    else {
                        props.updateModel(
                            [ ...props.model.slice(0, index - 1), integration, ...props.model.slice(index + 1) ]
                        );
                    }
                }
            } else {
                props.updateModel(
                    [ ...props.model, {
                        id: 'newAddition-' + intCount,
                        isEnabled: true,
                        name: 'Pager duty-' + intCount,
                        type: IntegrationType.HTTP,
                        url: newUrl
                    }]
                );
            }

            handleExit();
        }
    };

    const options = [
        { value: 'webhook', label: { webhookType }, disabled: false }
    ];

    return (
        <div>
            <Modal
                title={ pageTitle }
                isOpen={ props.isModalOpen }
                onClose={ handleExit }
                actions={ [
                    <Button key="confirm" variant="primary" onClick={ handleSubmit }>
                        Submit
                    </Button>,
                    <Button key="cancel" variant="link" onClick={ handleExit }>
                        Cancel
                    </Button>
                ] }
            >
                <Form>
                    <FormGroup
                        label={ Messages.pages.integrations.add.name }
                        fieldId="age-1"
                    >
                        <FormSelect
                            value=""
                            id="horzontal-form-title"
                            name="horizontal-form-title"
                            aria-label="Your title"
                        >
                            {options.map((option, index) => (
                            // <FormSelectOption isDisabled={option.disabled} key={index} value={option.value} label={option.label} />
                                <FormSelectOption isDisabled={ option.disabled } key={ index } value={ option.value } label="Webhook" />
                            ))}
                        </FormSelect>
                        <FormGroup label={ Messages.pages.integrations.types.hooksUrl } isRequired fieldId="form-url">
                            <TextInput
                                value={ newUrl }
                                onChange={ handleTextFieldChanges }
                                isRequired
                                type="text"
                                id="horizontal-form-url"
                                name="horizontal-form-url"
                            />
                        </FormGroup>
                    </FormGroup>
                </Form>
            </Modal>
        </div>
    );
};

export default CreatePage;
