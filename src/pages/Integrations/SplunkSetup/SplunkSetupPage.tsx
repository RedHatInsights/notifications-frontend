import './SplunkSetup.scss';

import {
    ActionGroup,
    Alert,
    Button,
    CodeBlock,
    CodeBlockCode,
    Flex,
    FlexItem,
    Form,
    FormGroup,
    Popover,
    TextInput
} from '@patternfly/react-core';
import HelpIcon from '@patternfly/react-icons/dist/esm/icons/help-icon';
import { Main, PageHeader, PageHeaderTitle, Section } from '@redhat-cloud-services/frontend-components';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';

import { Messages } from '../../../properties/Messages';
import * as Constants from './Constants';

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

export const SplunkSetupPage: React.FunctionComponent = () => {

    const [ hecId, setHecId ] = useState('');
    const [ splunkServerHostName, setHostName ] = useState('');
    const [ automationLogs, setAutomationLogs ] = useState(`CLICK THE BUTTON TO START THE AUTOMATION\n`);

    const createGroup = async () => {
        try {
            const response = await axios.post(Constants.RBAC_GROUPS_API,
                {
                    name: Constants.SPLUNK_GROUP_NAME,
                    description: 'This is a description'
                });
            const result = response.data;
            const message = 'Group created\n';
            setAutomationLogs(prevLogs => `${prevLogs}${message}`);
            return result;
        } catch (error) {
            const message = 'Failed to create group';
            error.message = message;
            throw error;
        }
    };

    const addUserToGroup = async(groupId) => {

        try {
            const username = await window.insights.chrome.auth.getUser().then(user => user.identity.user.username);
            const response = await axios.post(Constants.RBAC_ADD_USER_API.replace('{}', groupId),
                {
                    principals: [
                        {
                            username
                        }
                    ]
                });
            const result = response.data;
            const message = 'User added to group\n';
            setAutomationLogs(prevLogs => `${prevLogs}${message}`);
            return result;
        } catch (error) {
            const message = 'Failed to add user to group';
            error.message = message;
            throw error;
        }
    };

    const addRoleToGroup = async(groupId) => {

        try {
            const response = await axios.post(Constants.RBAC_ROLES_API.replace('{}', groupId),
                {
                    roles: [
                        Constants.NOTIF_ADM_ROLE_UUID
                    ]
                }
            );
            const result = response.data;
            const message = 'Added role to group\n';
            setAutomationLogs(prevLogs => `${prevLogs}${message}`);
            return result;
        } catch (error) {
            const message = 'Failed to add role to group';
            error.message = message;
            throw error;
        }
    };

    const createIntegration = async() => {

        try {
            const response = await axios.post(Constants.CREATE_INTEGRATION_API, {
                name: Constants.SPLUNK_INTEGRATION_NAME,
                enabled: true,
                type: 'camel',
                sub_type: 'splunk',
                description: '',
                properties: {
                    url: splunkServerHostName,
                    disable_ssl_verification: true,
                    secret_token: hecId,
                    basic_authentication: {},
                    extras: {}
                }
            });
            const result = response.data;
            const message = 'Created Integration\n';
            setAutomationLogs(prevLogs => `${prevLogs}${message}`);
            return result;
        } catch (error) {
            const message = 'Failed to create integration';
            error.message = message;
            throw error;
        }
    };

    const createBehaviorGroup = async() => {

        try {
            const response = await axios.post(Constants.CREATE_BEHAVIOR_GROUP_API,
                {
                    bundle_id: Constants.BEHAVIOR_GROUP_BUNDLE_ID,
                    display_name: Constants.SPLUNK_BEHAVIOR_GROUP_NAME
                });

            const result = response.data;
            const message = 'Created behavior group\n';
            setAutomationLogs(prevLogs => `${prevLogs}${message}`);
            return result;
        } catch (error) {
            const message = 'Failed to create behavior group';
            error.message = message;
            throw error;
        }
    };

    const associateIntegrationWithBehaviorGroup = async(behaviorGroupId, integrationId) => {
        try {
            const response = await axios.put(Constants.UPDATE_BEHAVIOR_GROUP_API.replace('{}', behaviorGroupId), [integrationId]);
            const result = response.data;
            const message = 'Associated integration to behavior group\n';
            setAutomationLogs(prevLogs => `${prevLogs}${message}`);
            return result;
        } catch (error) {
            const message = 'Failed to associate integration to behavior group';
            error.message = message;
            throw error;
        }
    };

    const fetchBehaviorGroupsFromEventType = async(eventType) => {
        try {
            const response = await axios.get(Constants.EVENTTYPE_API.replace('{}', eventType));
            const result = response.data;
            const message = 'Fetching behavior groups from event type\n';
            setAutomationLogs(prevLogs => `${prevLogs}${message}`);
            return result;
        } catch (error) {
            const message = 'Failed to fetch behavior groups';
            error.message = message;
            throw error;
        }
    };

    function parseBehaviorGroups(data) {
        const behaviorGroups = [];
        data.forEach(group => behaviorGroups.push(group.id));
        return behaviorGroups;
    }

    const updateEventType = async(eventType, behaviorGroupsArr) => {
        try {
            const response = await axios.put(Constants.EVENTTYPE_API.replace('{}', eventType), behaviorGroupsArr);
            const result = response.data;
            const message = 'Updated Event type with behavior group\n';
            setAutomationLogs(prevLogs => `${prevLogs}${message}`);
            return result;
        } catch (error) {
            const message = 'Failed to update event type with behavior group';
            error.message = message;
            throw error;
        }
    };

    async function startAutomation() {
        try {
            const group = await createGroup();
            await addUserToGroup(group.uuid);
            await addRoleToGroup(group.uuid);
            const integration = await createIntegration();
            const behavior = await createBehaviorGroup();
            await associateIntegrationWithBehaviorGroup(behavior.id, integration.id);
            for (const eventType of Constants.EVENT_TYPES_IDS_ARR) {
                const behaviorGroupsData = await fetchBehaviorGroupsFromEventType(eventType);
                const behaviorGroupsArr = parseBehaviorGroups(behaviorGroupsData);
                behaviorGroupsArr.push(behavior.id);
                await updateEventType(eventType, behaviorGroupsArr);
            }

            const message = 'Setup is done!';
            setAutomationLogs(prevLogs => `${prevLogs}${message}`);
        } catch (error) {
            if (error.response) {
                console.log(error.message);
            } else if (error.request) {
                console.log(error);
            }
            // Send issue Alert to user
            throw error;
        }
    }

    return (
        <>
            <PageHeader>
                <PageHeaderTitle title={Messages.pages.splunk.page.title} />
            </PageHeader>
            <Flex>
                <Main className='c-splunk-setup-display'>
                    <Section>
                        <FlexItem>
                            <Form>
                                <FormGroup
                                    label="Server hostname/IP Address and port (hostname:port)"
                                    labelIcon={<Popover
                                        headerContent={<div>
                                            The server <b>hostname/IP Address</b> and <b>port</b> of your splunk HTTP Event Collector
                                        </div>}
                                        bodyContent={<div>
                                            Usually the port is 8088
                                            See {' '}
                                            <a
                                                target='_blank'
                                                rel='noreferrer'
                                                href='https://docs.splunk.com/Documentation/Splunk/8.2.5/Data/UsetheHTTPEventCollector'>
                                                Splunk HEC setup
                                            </a>
                                        </div>}
                                    >
                                        <button
                                            type="button"
                                            aria-label="More info for name field"
                                            onClick={e => e.preventDefault()}
                                            aria-describedby="simple-form-name-01"
                                            className="pf-c-form__group-label-help"
                                        >
                                            <HelpIcon noVerticalAlign />
                                        </button>
                                    </Popover>}
                                    isRequired
                                    fieldId="simple-form-name-01"
                                >
                                    <TextInput
                                        isRequired
                                        type="text"
                                        id="simple-form-name-01"
                                        name="simple-form-name-01"
                                        aria-describedby="simple-form-name-01-helper"
                                        value={splunkServerHostName}
                                        onChange={ (value) => setHostName(value) }
                                    />
                                </FormGroup>
                                <FormGroup
                                    label="Splunk HEC ID"
                                    fieldId="simple-form-name-01"
                                >
                                    <TextInput
                                        isRequired
                                        type="text"
                                        id="simple-form-name-01"
                                        name="simple-form-name-01"
                                        aria-describedby="simple-form-name-01-helper"
                                        value={hecId}
                                        onChange={ (value) => setHecId(value) }
                                    />
                                </FormGroup>
                                <ActionGroup>
                                    <Button variant="primary"
                                        onClick={startAutomation}>
                                        Start Setup
                                    </Button>
                                </ActionGroup>
                            </Form>
                        </FlexItem>
                    </Section>
                </Main>
                <Main className='c-splunk-setup-display'>
                    <Section>
                        <FlexItem>
                            <CodeBlock>
                                <CodeBlockCode>{automationLogs}</CodeBlockCode>
                            </CodeBlock>
                        </FlexItem>
                    </Section>
                </Main>
            </Flex>
        </>
    );
};

//export const SplunkSetupPage = connect()(SplunkSetupPage);
