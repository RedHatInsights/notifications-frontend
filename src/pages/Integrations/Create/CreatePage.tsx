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
import { IntegrationType } from "../../../types/Integration";

const EMPTY = '';
const title = Messages.components.integrations.toolbar.actions;
const choose = Messages.common.choose;
const webhookType = Messages.pages.integrations.types.hooks;

const CreatePage = props => {
    const [pageModal, updatePageModal] = useState({...props.isModalOpen});
    const [newUrl, updateUrl] = useState("(enter hooks url)");
    const [intCount,updateIntCount] = useState(0);
    const handleTextFieldChanges = (evt) => {
        updateUrl(evt);
    };
    const handleSubmit = () => {
        if(newUrl){
            updateIntCount(intCount+1);
            props.updateModel(
                ...props.model,{
                id: 'newAddition-'+intCount,
                isEnabled: true,
                name: 'Pager duty'+intCount,
                type: IntegrationType.HTTP,
                url: newUrl
            }
            );
        }
    }
    const handleExit = () => {
        updatePageModal(!pageModal);
        props.updateModal(!pageModal);
    }
    useEffect(() => {
    },[pageModal]);
    const options = [
        { value: 'please choose', label: { choose }, disabled: false },
        { value: 'webhook', label: { webhookType }, disabled: false }
    ];
    const handleInputChange = (evt) => {
        updateUrl(newUrl)
    }
    const handleChange = () => {
    }
    return (
        <div>
            <Modal
                // title={title}
                title="Add integration"
                // title={Messages.components.integrations.toolbar.actions}
                // isOpen={isModalOpen}
                isOpen={props.isModalOpen}
                onClose={ handleExit }
                actions={[
                    <Button key="confirm" variant="primary" onClick={handleSubmit}>
                        Submit
                    </Button>,
                    <Button key="cancel" variant="link" onClick={handleExit}>
                        Cancel
                    </Button>
                ]}
            >
                <Form>
                    <FormGroup
                        label={ Messages.pages.integrations.add.name }
                        fieldId="age-1"
                    >
                    <FormSelect
                        value=""
                        onChange={handleChange}
                        id="horzontal-form-title"
                        name="horizontal-form-title"
                        aria-label="Your title"
                    >
                        {options.map((option, index) => (
                            // <FormSelectOption isDisabled={option.disabled} key={index} value={option.value} label={option.label} />
                            <FormSelectOption isDisabled={option.disabled} key={index} value={option.value} label="Webhook" />
                        ))}
                    </FormSelect>
                        <FormGroup label={Messages.pages.integrations.types.hooksUrl} isRequired fieldId="form-url">
                            <TextInput
                                value={newUrl}
                                onChange={handleTextFieldChanges}
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
