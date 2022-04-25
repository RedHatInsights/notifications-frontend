import {
    ActionGroup,
    Button,
    CodeBlock,
    CodeBlockCode,
    Form,
    FormGroup,
    Grid,
    GridItem,
    Popover,
    ProgressStepProps,
    TextInput,
    ValidatedOptions
} from '@patternfly/react-core';
import { CheckCircleIcon, ExclamationCircleIcon, HelpIcon, InProgressIcon } from '@patternfly/react-icons';
import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';

import { useSplunkSetup } from './useSplunkSetup';

const SPLUNK_CLOUD_HEC_DOC =
    'https://docs.splunk.com/Documentation/SplunkCloud/latest/Data/UsetheHTTPEventCollector#Send_data_to_HTTP_Event_Collector';

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
        return <Button variant="primary"><InProgressIcon /> Configuration in progress</Button>;
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
