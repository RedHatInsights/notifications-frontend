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

const EMPTY = '';
const onExport = (type: string) => console.log('[CreatePage]:export to ' + type);
const title = Messages.components.integrations.toolbar.actions;
const choose = Messages.common.choose;
const webhookType = Messages.pages.integrations.types.hooks;

const CreatePage = props => {
    // console.log('CreatePage.initial:props:'+props+':props.isModalOpen:'+props.isModalOpen+':');
    const [isModalOpen, updateModal] = useState({...props.isModalOpen});
    const [newUrl, updateUrl] = useState("");
    const handleModalToggle = (evt) => {
        updateModal(!isModalOpen);
    };
    const handleExit = () => {
        updateModal(!isModalOpen);
        // isModalOpen: !isModalOpen
        // props.updateModalState(!isModalOpen);
        props.isModalOpen = false;
    }
    useEffect(() => {
    },[isModalOpen]);
    const options = [
        { value: 'please choose', label: { choose }, disabled: false },
        { value: 'webhook', label: { webhookType }, disabled: false }
    ];
    const handleInputChange = (evt) => {
        updateUrl(newUrl)
    }
    const handleChange = () => {
        //TODO
    }
    return (
        <div>
            <Modal
                // title={title}
                title="Add integration"
                // title={Messages.components.integrations.toolbar.actions}
                // isOpen={isModalOpen}
                isOpen={props.isModalOpen}
                // isOpen={isModalOpen}
                onClose={ handleExit }
                // onClose={() => updateModal(!isModalOpen)}
                actions={[
                    <Button key="confirm" variant="primary" onClick={handleModalToggle}>
                        Submit
                    </Button>,
                    <Button key="cancel" variant="link" onClick={handleModalToggle}>
                        Cancel
                    </Button>
                ]}
            >
                <Form>
                    <FormGroup
                        label={ Messages.pages.integrations.add.name }
                        type="string"
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
                    <TextInput
                        isRequired
                        type="text"
                        id="simple-form-name"
                        name="simple-form-name"
                        aria-describedby="simple-form-name-helper"
                        // value={value1}
                        value=""
                        onChange={handleChange}
                    />
                    <TextInput
                        value="newUrl"
                        onChange={handleChange}
                        isRequired
                        type="url"
                        id="horizontal-form-email"
                        name="horizontal-form-email"
                    />
                    </FormGroup>
                </Form>
            </Modal>
        </div>
    );
};

export default CreatePage;
