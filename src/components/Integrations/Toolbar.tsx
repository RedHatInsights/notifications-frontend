import * as React from 'react';
import { PrimaryToolbar } from '@redhat-cloud-services/frontend-components';
import { Messages } from '../../properties/Messages';

interface IntegrationsToolbarProps {
    onAddIntegration: () => void;
    onExport: (type: string) => void;
}

export const IntegrationsToolbar: React.FunctionComponent<IntegrationsToolbarProps> = (props) => {

    const actionsConfig = React.useMemo(() => {
        const actions = [
            {
                key: 'add-integration',
                label: Messages.components.integrations.toolbar.actions.addIntegration,
                onClick: props.onAddIntegration,
                props: {
                    isDisabled: !props.onAddIntegration
                }
            }
        ];

        return {
            actions,
            kebabToggleProps: {
                isDisabled: false
            }
        };
    }, [ props.onAddIntegration ]);

    const exportConfig = React.useMemo(() => {
        const onExport = props.onExport;
        if (onExport) {
            return {
                extraItems: [],
                onSelect: (_event, type: string) => onExport(type)
            };
        }

        return undefined;
    }, [ props.onExport ]);

    return (
        <PrimaryToolbar
            actionsConfig={ actionsConfig }
            exportConfig={ exportConfig }
        />
    );
};
