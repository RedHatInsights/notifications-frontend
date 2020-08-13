import { Integration } from '../../../types/Integration';
import { default as React, useCallback, useEffect, useState } from 'react';
import { IntegrationRow } from '../../../components/Integrations/Table';
import { usePrevious } from 'react-use';

export const useIntegrationRows = (integrations: Array<Integration>) => {
    const [ integrationRows, setIntegrationRows ] = useState<Array<IntegrationRow>>([]);
    const prevIntegrations = usePrevious(integrations);

    useEffect(() => {
        if (integrations !== prevIntegrations) {
            setIntegrationRows(prev => {
                return integrations.map(integration => ({
                    isOpen: false,
                    isSelected: false,
                    isEnabledLoading: false,
                    ...prev.find(i => i.id === integration.id),
                    ...integration
                }));
            });
        }
    }, [ prevIntegrations, integrations ]);

    const onCollapse = useCallback((_integration: IntegrationRow, index: number, isOpen: boolean) => {
        setIntegrationRows(prevIntegrations => {
            const newIntegrations = [ ...prevIntegrations ];
            newIntegrations[index] = { ...newIntegrations[index], isOpen };
            return newIntegrations;
        });
    }, [ setIntegrationRows ]);

    // Todo: Fake implementation just to test UI
    const onEnable = React.useCallback((_integration, index, isEnabled) => {
        setIntegrationRows(prevIntegrations => {
            const newIntegrations = [ ...prevIntegrations ];
            newIntegrations[index] = { ...newIntegrations[index], isEnabledLoading: true };
            return newIntegrations;
        });

        new Promise(resolve => {
            setTimeout(resolve, 1000);
        }).then(() => setIntegrationRows(prevIntegrations => {
            const newIntegrations = [ ...prevIntegrations ];
            newIntegrations[index] = { ...newIntegrations[index], isEnabled, isEnabledLoading: false };
            return newIntegrations;
        }));
    }, [ setIntegrationRows ]);

    return {
        rows: integrationRows,
        onCollapse,
        onEnable
    };
};
