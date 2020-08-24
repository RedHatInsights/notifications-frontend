import { Integration } from '../../../types/Integration';
import { default as React, useCallback, useEffect, useState } from 'react';
import { IntegrationRow } from '../../../components/Integrations/Table';
import { usePrevious } from 'react-use';
import { useSwitchIntegrationEnabledStatus } from '../../../services/useSwitchIntegrationEnabledStatus';
import { addDangerNotification } from '@redhat-cloud-services/insights-common-typescript';
import { Messages } from '../../../properties/Messages';
import { format } from 'react-string-format';

export const useIntegrationRows = (integrations?: Array<Integration>) => {
    const [ integrationRows, setIntegrationRows ] = useState<Array<IntegrationRow>>([]);
    const prevIntegrations = usePrevious(integrations);

    const switchStatus = useSwitchIntegrationEnabledStatus();

    useEffect(() => {
        if (integrations !== prevIntegrations) {
            setIntegrationRows(prev => {
                return (integrations || []).map(integration => ({
                    isOpen: false,
                    isSelected: false,
                    isEnabledLoading: false,
                    ...prev.find(i => i.id === integration.id),
                    ...integration
                }));
            });
        }
    }, [ prevIntegrations, integrations, setIntegrationRows ]);

    const onCollapse = useCallback((_integration: IntegrationRow, index: number, isOpen: boolean) => {
        setIntegrationRows(prevIntegrations => {
            const newIntegrations = [ ...prevIntegrations ];
            newIntegrations[index] = { ...newIntegrations[index], isOpen };
            return newIntegrations;
        });
    }, [ setIntegrationRows ]);

    const onEnable = React.useCallback((_integration: Integration, index: number, isEnabled: boolean) => {
        setIntegrationRows(prevIntegrations => {
            const newIntegrations = [ ...prevIntegrations ];
            newIntegrations[index] = { ...newIntegrations[index], isEnabledLoading: true };
            return newIntegrations;
        });

        switchStatus.mutate(_integration).then((response) => {
            if (response.status === 200) {
                setIntegrationRows(prevIntegrations => {
                    const newIntegrations = [ ...prevIntegrations ];
                    newIntegrations[index] = { ...newIntegrations[index], isEnabled, isEnabledLoading: false };
                    return newIntegrations;
                });
            } else {
                const message = isEnabled ? Messages.components.integrations.enableError : Messages.components.integrations.disableError;
                addDangerNotification(
                    message.title,
                    format(message.description, _integration.name),
                    true);
                setIntegrationRows(prevIntegrations => {
                    const newIntegrations = [ ...prevIntegrations ];
                    newIntegrations[index] = { ...newIntegrations[index], isEnabled: _integration.isEnabled, isEnabledLoading: false };
                    return newIntegrations;
                });
            }
        });

    }, [ setIntegrationRows, switchStatus ]);

    return {
        rows: integrationRows,
        onCollapse,
        onEnable
    };
};
