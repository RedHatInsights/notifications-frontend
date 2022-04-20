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
    TextInput
} from '@patternfly/react-core';
import { CheckCircleIcon, ExclamationCircleIcon, HelpIcon, InProgressIcon } from '@patternfly/react-icons';
import React, { Dispatch, SetStateAction } from 'react';

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
    automationLogs: string;
    setAutomationLogs: Dispatch<SetStateAction<string>>;
}

export const SplunkSetupForm: React.FunctionComponent<SplunkSetupFormProps> = ({
    setStep, stepIsInProgress, setStepIsInProgress, stepVariant, setStepVariant,
    hecToken, setHecToken, splunkServerHostName, setHostName,
    automationLogs, setAutomationLogs
}) => {

    const startSplunkAutomation = useSplunkSetup();

    const onProgress = (message) => {
        setAutomationLogs(prevLogs => `${prevLogs}${message}\n`);
    };

    const onStart = async () => {
        setStepIsInProgress(true);
        setAutomationLogs('');
        try {
            await startSplunkAutomation({ hecToken, splunkServerHostName }, onProgress);
        } catch (error) {
            onProgress(`ERROR: ${error}`);
            setStepIsInProgress(false);
            setStepVariant('danger');
            return;
        }

        setStepIsInProgress(false);
        setStepVariant('success');

        onProgress('DONE!\n');
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
                    >
                        <TextInput
                            isRequired
                            type="text"
                            id="splunk-server-hostname"
                            name="splunk-server-hostname"
                            aria-describedby="splunk-server-hostname-helper"
                            value={ splunkServerHostName }
                            onChange={ (value) => !stepIsInProgress && setHostName(value) }
                        />
                    </FormGroup>
                    <FormGroup
                        label="Splunk HEC Token"
                        fieldId="splunk-hec-token"
                    >
                        <TextInput
                            isRequired
                            type="text"
                            id="splunk-hec-token"
                            name="splunk-hec-token"
                            aria-describedby="splunk-hec-token-helper"
                            value={ hecToken }
                            onChange={ (value) => !stepIsInProgress && setHecToken(value) }
                        />
                    </FormGroup>
                    <ActionGroup>
                        <SplunkAutomationButton { ...{ onStart, onFinish, stepIsInProgress, stepVariant } } />
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

const SplunkAutomationButton = ({ onStart, onFinish, stepIsInProgress, stepVariant }) => {
    if (stepIsInProgress) {
        return <Button variant="primary"><InProgressIcon /> Configuration in progress</Button>;
    } else if (stepVariant === 'success') {
        return <Button variant="primary" onClick={ onFinish }><CheckCircleIcon /> Next: Review</Button>;
    } else if (stepVariant === 'danger') {
        return <Button variant="primary"><ExclamationCircleIcon /> Next: Review</Button>;
    } else {
        return <Button variant="primary" onClick={ onStart }>Run Configuration</Button>;
    }
};
