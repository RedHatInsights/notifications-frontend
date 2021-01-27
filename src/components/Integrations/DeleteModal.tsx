import { ExpandableSection, List, ListItem, Skeleton } from '@patternfly/react-core';
import { DeleteModal, DeleteModalProps } from '@redhat-cloud-services/insights-common-typescript';
import * as React from 'react';

import { UserIntegration } from '../../types/Integration';
import { Notification } from '../../types/Notification';

type UsedProps = 'isOpen' | 'title' | 'content' | 'onDelete';

interface IntegrationDeleteModalProps extends Omit<DeleteModalProps, UsedProps> {
    integration?: UserIntegration;
    onDelete: (integration: UserIntegration) => boolean | Promise<boolean>;
    notifications?: Array<Notification>;
}

export const IntegrationDeleteModal: React.FunctionComponent<IntegrationDeleteModalProps> = (props) => {

    const onDeleteInternal = React.useCallback(() => {
        const integration = props.integration;
        const onDelete = props.onDelete;
        if (integration) {
            return onDelete(integration);
        }

        return false;
    }, [ props.onDelete, props.integration ]);

    const content = React.useMemo(() => {
        if (props.notifications === undefined) {
            return (
                <>
                    <Skeleton />
                </>
            );
        } else {
            const eventText = props.notifications.length !== 1 ? 'events' : 'event';
            return (
                <>
                    Removing this integration affects {props.notifications.length} notification {eventText}.
                    { props.notifications.length > 0 && <ExpandableSection toggleText={ `View ${props.notifications.length} ${eventText}.` }>
                        <List>
                            { props.notifications.map(notification => (
                                <ListItem
                                    key={ notification.id }
                                >
                                    { notification.applicationDisplayName }: { notification.eventTypeDisplayName }
                                </ListItem>
                            )) }
                        </List>
                    </ExpandableSection> }
                </>
            );
        }
    }, [ props.notifications ]);

    if (!props.integration) {
        return null;
    }

    return (
        <DeleteModal
            isOpen={ true }
            isDeleting={ props.isDeleting }
            title={ 'Remove integration' }
            content={ content }
            onClose={ props.onClose }
            onDelete={ onDeleteInternal }
            error={ props.error }
            titleIconVariant="warning"
        />
    );
};
