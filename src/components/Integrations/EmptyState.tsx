import {
    Button,
    Card,
    CardTitle,
    EmptyState,
    EmptyStateBody,
    EmptyStateIcon,
    Gallery,
    Title
} from '@patternfly/react-core';
import { CubesIcon } from '@patternfly/react-icons';
import React from 'react';

import { Messages } from '../../properties/Messages';

// eslint-disable-next-line @typescript-eslint/ban-types
export const IntegrationsEmptyState: React.FunctionComponent<{ onAddIntegration: Function | undefined }> = ({ onAddIntegration }) =>
    (
        <EmptyState>
            <EmptyStateIcon icon={ CubesIcon } />
            <Title headingLevel="h4" size="lg">
            No integrations yet
            </Title>
            <EmptyStateBody>
                <Gallery hasGutter aria-label="Card container">
                    <Card>
                        <CardTitle>Why integrate?</CardTitle>
                    </Card>
                    <Card>
                        <CardTitle>Configure applications</CardTitle>
                    </Card>
                    <Card>
                        <CardTitle>Create behavior groups</CardTitle>
                    </Card>
                </Gallery>
            </EmptyStateBody>
            <Button variant="primary" component="a" disabled={ !onAddIntegration } onClick={ () => onAddIntegration ? onAddIntegration() : null }>
                {Messages.components.integrations.toolbar.actions.addIntegration}
            </Button>
        </EmptyState>
    );
