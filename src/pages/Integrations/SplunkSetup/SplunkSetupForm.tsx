import {
    ActionGroup,
    Button,
    CodeBlock,
    CodeBlockCode,
    Form,
    FormGroup,
    Grid,
    GridItem,
    List,
    ListItem,
    ListVariant,
    Popover,
    ProgressStepProps,
    TextInput,
    ValidatedOptions
} from '@patternfly/react-core';
import { CheckCircleIcon, ExclamationCircleIcon, HelpIcon } from '@patternfly/react-icons';
import { addDangerNotification } from '@redhat-cloud-services/insights-common-typescript';
import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';

import { DOCUMENTATION_URL, OPEN_CASE_URL, SPLUNK_CLOUD_HEC_DOC } from './Constants';
import { useSplunkSetup } from './useSplunkSetup';

interface SplunkSetupFormProps {
    setStep: Dispatch<SetStateAction<number>>;
    stepIsInProgress: boolean;
    setStepIsInProgress: Dispatch<SetStateAction<boolean>>;
    stepVariant: ProgressStepProps['variant'];
    setStepVariant: Dispatch<SetStateAction<ProgressStepProps['variant']>>;
    hecToken: string;
    setHecToken: Dispatch<SetStateAction<string>>;
    splunkServerHostName: string;
    setHostName: Dispatch<SetStateAction<string>>;
    automationLogs: React.ReactChild[];
    setAutomationLogs: Dispatch<SetStateAction<React.ReactChild[]>>;
}

export const SplunkSetupForm: React.FunctionComponent<SplunkSetupFormProps> = ({
    setStep, stepIsInProgress, setStepIsInProgress, stepVariant, setStepVariant,
    hecToken, setHecToken, splunkServerHostName, setHostName,
    automationLogs, setAutomationLogs
}) => {

    const startSplunkAutomation = useSplunkSetup();
    const [ isDisabled, setIsDisabled ] = useState<boolean>(true);
    const [ validatedServerHostname, setValidatedServerHostname ] = useState<ValidatedOptions>(ValidatedOptions.default);
    const [ validatedHecToken, setValidatedHecToken ] = useState<ValidatedOptions>(ValidatedOptions.default);

    const onHostnameChange = (value) => {
        if (value === '') {
            setValidatedServerHostname(ValidatedOptions.default);
        } else if (/^https?:\/\/[\w\.]+(:\d+)?$/i.test(value)) {
            setValidatedServerHostname(ValidatedOptions.success);
        } else {
            setValidatedServerHostname(ValidatedOptions.error);
        }

        if (!stepIsInProgress) {
            setHostName(value);
        }
    };

    const onHecTokenChange = (value) => {
        if (value === '') {
            setValidatedHecToken(ValidatedOptions.default);
        } else if (/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value)) {
            setValidatedHecToken(ValidatedOptions.success);
        } else {
            setValidatedHecToken(ValidatedOptions.error);
        }

        if (!stepIsInProgress) {
            setHecToken(value);
        }
    };

    useEffect(() => {
        if ([ validatedServerHostname, validatedHecToken ].every(v => v === ValidatedOptions.success)) {
            setIsDisabled(false);
        } else {
            setIsDisabled(true);
        }
    }, [ validatedServerHostname, validatedHecToken ]);

    const onProgress = (message, className?) => {
        let newLog = message;
        if (className) {
            newLog = <span className={ className }>{ message }</span>;
        }

        setAutomationLogs(prevLogs => [ ...prevLogs, newLog ]);
    };

    const onStart = async () => {
        setStepIsInProgress(true);
        setAutomationLogs([]);

        try {
            await startSplunkAutomation({ hecToken, splunkServerHostName }, onProgress);
        } catch (error) {
            onProgress(`\n${error}`, 'pf-u-danger-color-200');
            setStepIsInProgress(false);
            setStepVariant('danger');

            addDangerNotification('Configuration failed', <SplunkSetupFailedToast />, true);
            return;
        }

        setIsDisabled(false);
        setStepIsInProgress(false);
        setStepVariant('success');
        onProgress('\nDONE!', 'pf-u-success-color-200');
    };

    const onFinish = () => {
        setStep(prevStep => prevStep + 1);
    };

    return (
        <Grid>
            <GridItem span={ 6 }>
                <Form className='pf-u-mr-md'>
                    <FormGroup
                        label="Splunk HEC URL"
                        labelIcon={ <Popover
                            headerContent={ <div>
                                The server <b>hostname/IP Address</b> and <b>port</b> of your splunk HTTP Event Collector
                            </div> }
                            bodyContent={ <div>
                                For Splunk Enterprise the port is by default 8088.<br />
                                For Splunk Cloud Platform see
                                {' '}
                                <a
                                    target='_blank'
                                    rel='noreferrer'
                                    href={ SPLUNK_CLOUD_HEC_DOC }>
                                    documentation
                                </a>.
                            </div> }
                        >
                            <button
                                type="button"
                                aria-label="More info for name field"
                                onClick={ e => e.preventDefault() }
                                aria-describedby="splunk-server-hostname"
                                className="pf-c-form__group-label-help"
                            >
                                <HelpIcon noVerticalAlign />
                            </button>
                        </Popover> }
                        isRequired
                        fieldId="splunk-server-hostname"
                        helperTextInvalid="Invalid URL. Example: https://hostname:8088"
                        validated={ validatedServerHostname }
                    >
                        <TextInput
                            isRequired
                            type="text"
                            id="splunk-server-hostname"
                            name="splunk-server-hostname"
                            aria-describedby="splunk-server-hostname-helper"
                            value={ splunkServerHostName }
                            validated={ validatedServerHostname }
                            onChange={ onHostnameChange }
                        />
                    </FormGroup>
                    <FormGroup
                        label="Splunk HEC Token"
                        fieldId="splunk-hec-token"
                        isRequired
                        helperTextInvalid="Invalid HEC token. Example: 123e4567-e89b-12d3-a456-426614174000"
                        validated={ validatedHecToken }
                    >
                        <TextInput
                            isRequired
                            type="text"
                            id="splunk-hec-token"
                            name="splunk-hec-token"
                            aria-describedby="splunk-hec-token-helper"
                            validated={ validatedHecToken }
                            value={ hecToken }
                            onChange={ onHecTokenChange }
                        />
                    </FormGroup>
                    <ActionGroup>
                        <SplunkAutomationButton { ...{ onStart, onFinish, stepIsInProgress, stepVariant, isDisabled } } />
                    </ActionGroup>
                </Form>
            </GridItem>

            <GridItem span={ 6 }>
                <CodeBlock>
                    <CodeBlockCode>{automationLogs}</CodeBlockCode>
                </CodeBlock>
            </GridItem>
        </Grid>
    );
};

const SplunkAutomationButton = ({ onStart, onFinish, stepIsInProgress, stepVariant, isDisabled }) => {
    if (stepIsInProgress) {
        return <Button variant="primary" isLoading={ true }>Configuration in progress</Button>;
    } else if (stepVariant === 'success') {
        return <Button variant="primary" onClick={ onFinish }><CheckCircleIcon /> Next: Review</Button>;
    } else if (stepVariant === 'danger') {
        return <Button variant="primary"><ExclamationCircleIcon /> Next: Review</Button>;
    } else {
        return (
            <Button variant="primary" isDisabled={ isDisabled } onClick={ onStart }>
                Run Configuration
            </Button>
        );
    }
};

const SplunkSetupFailedToast = () => (
    <>
        <p className='pf-u-mb-md'>
            There was a problem processing the request. Please try again.
            If the problem persists, contact Red Hat support by opening the ticket.
        </p>
        <List variant={ ListVariant.inline }>
            <ListItem>
                <a target="_blank" rel="noopener noreferrer" href={ OPEN_CASE_URL }>Open a Red Hat Support ticket</a>
            </ListItem>
            { DOCUMENTATION_URL &&
                <ListItem>
                    <a target="_blank" rel="noopener noreferrer" href={ DOCUMENTATION_URL || '' }>Go to documentation</a>
                </ListItem>
            }
        </List>
    </>
);
