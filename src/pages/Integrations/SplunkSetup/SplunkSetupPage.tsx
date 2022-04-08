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
    TextInput } from '@patternfly/react-core';
import HelpIcon from '@patternfly/react-icons/dist/js/icons/help-icon';
import { Main, PageHeader, PageHeaderTitle } from '@redhat-cloud-services/frontend-components';
import React, { useState } from 'react';

import { Messages } from '../../../properties/Messages';

/*
Steps:

1) Create a group under /api/rbac/v1/groups/ with the payload:

{
  "name": "GroupA",
  "description": "A description of GroupA"
}

2) Add user to group under /api/rbac/v1/groups/{uuid}/principals/ with the payload:

{
  "principals": [
    {
      "username": "smithj"
    }
  ]
}

3) Add role to group under /api/rbac/v1/groups/{uuid}/roles/ with the payload:

{
  "roles": [
    "94846f2f-cced-474f-b7f3-47e2ec51dd11"
  ]
}

4) [POST] Create Integrations under /api/integrations/v1.0/endpoints with the payload:
{
    "name": "Splunk Automation",
    "enabled": true,
    "type": "camel",
    "sub_type": "splunk",
    "description": "",
    "properties": {
        "url": "http://decd-187-3-186-244.ngrok.io",
        "disable_ssl_verification": false,
        "secret_token": "MYHEC_TOKEN",
        "basic_authentication": {},
        "extras": {}
    }
}

5) Create behavior group under /api/notifications/v1.0/notifications/behaviorGroups with the payload:

{
  "bundle_id":"35fd787b-a345-4fe8-a135-7773de15905e",
  "display_name":"Splunk-automation"
}

6) [POST] Update behavior group under api/notifications/v1.0/notifications/behaviorGroups/{BEHAVIOR_GROUP_ID}/actions with the payload:

  ["8d8dca57-1834-48dd-b6ac-265c949c5e60"] <<-- Id of the integration

7) [PUT] Update eventType under /api/notifications/v1.0/notifications/eventTypes/{EVENT_TYPE_UUID}/behaviorGroups with the payload:

["ff59b502-da25-4297-bd88-6934ad0e0d63"] <<- Behavior group ID
*/

const SPLUNK_CLOUD_HEC_DOC =
    'https://docs.splunk.com/Documentation/SplunkCloud/latest/Data/UsetheHTTPEventCollector#Send_data_to_HTTP_Event_Collector';

export const SplunkSetupPage: React.FunctionComponent = () => {

    const [ hecToken, setHecToken ] = useState('');
    const [ splunkServerHostName, setHostName ] = useState('');
    const [ automationLogs, setAutomationLogs ] = useState(`CLICK THE BUTTON TO START THE AUTOMATION\n`);
    const [ disableSubmit, setDisableSubmit ] = useState(false);

    const onStart = () => {
        setDisableSubmit(true);
        setAutomationLogs('WIP');
    };

    return (
        <>
            <PageHeader>
                <PageHeaderTitle title={ Messages.pages.splunk.page.title } />
            </PageHeader>
            <Main>
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
            </Main>
        </>
    );
};
