import {
    Button,
    Popover
} from '@patternfly/react-core';
import { ExternalLinkSquareAltIcon, HelpIcon } from '@patternfly/react-icons';
import { Main, PageHeader, PageHeaderTitle } from '@redhat-cloud-services/frontend-components';
import React from 'react';

import { Messages } from '../../../properties/Messages';
import { SplunkSetupForm } from './SplunkSetupForm';

const SplunkSetupTitle: React.FunctionComponent = () => (
    <>
        <PageHeaderTitle title={ <>
            { Messages.pages.splunk.page.title }
            <Popover
                bodyContent={ Messages.pages.splunk.page.help }
                footerContent={ Messages.pages.splunk.page.helpUrl &&
                            <a target="_blank" rel="noopener noreferrer" href={ Messages.pages.splunk.page.helpUrl || '' }>
                                Learn more <ExternalLinkSquareAltIcon />
                            </a> }
            >
                <Button
                    variant='plain'
                    aria-label="Help description"
                    className="title-help-label"
                >
                    <HelpIcon noVerticalAlign />
                </Button>
            </Popover>
        </> } />
        { Messages.pages.splunk.page.description }
    </>
);

export const SplunkSetupPage: React.FunctionComponent = () => {
    return (
        <>
            <PageHeader>
                <SplunkSetupTitle />
            </PageHeader>
            <Main>
                <SplunkSetupForm />
            </Main>
        </>
    );
};
