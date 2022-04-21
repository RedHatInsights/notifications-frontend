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
    TextInput
 } from '@patternfly/react-core';
import { HelpIcon } from '@patternfly/react-icons';
import React, { useState } from 'react';

import { useSplunkSetup } from './useSplunkSetup';

const SPLUNK_CLOUD_HEC_DOC =
    'https://docs.splunk.com/Documentation/SplunkCloud/latest/Data/UsetheHTTPEventCollector#Send_data_to_HTTP_Event_Collector';

export const SplunkSetupForm: React.FunctionComponent = () => {

    const [ hecToken, setHecToken ] = useState('');
    const [ splunkServerHostName, setHostName ] = useState('');
    const [ automationLogs, setAutomationLogs ] = useState(`CLICK THE BUTTON TO START THE AUTOMATION\n`);
    const [ disableSubmit, setDisableSubmit ] = useState(false);
    const startSplunkAutomation = useSplunkSetup();

    const onProgress = (message) => {
        setAutomationLogs(prevLogs => `${prevLogs}${message}\n`);
    };

    const onStart = async () => {
        setDisableSubmit(true);
        setAutomationLogs('');
        try {
            await startSplunkAutomation({ hecToken, splunkServerHostName }, onProgress);
        } catch (error) {
            onProgress(`ERROR: ${error}`);
        }

        onProgress('DONE!\n');
    };

    return (
        <Grid>
            <GridItem span={ 6 }>
                <Form className='pf-u-mr-md'>
                    <FormGroup
                        label="Server hostname/IP Address and port (hostname:port)"
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
                            onChange={ (value) => setHostName(value) }
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
                            onChange={ (value) => setHecToken(value) }
                        />
                    </FormGroup>
                    <ActionGroup>
                        <Button variant="primary"
                            onClick={ onStart }
                            isDisabled={ disableSubmit }>
                            Start Setup
                        </Button>
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
