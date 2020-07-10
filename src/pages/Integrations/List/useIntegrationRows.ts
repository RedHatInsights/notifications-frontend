import { Integration } from '../../../types/Integration';
import { useCallback, useEffect, useState } from 'react';
import { IntegrationRow } from '../../../components/Integrations/Table';
import { usePrevious } from 'react-use';

export const useIntegrationRows = (integrations: Array<Integration>) => {
    const [ integrationRows, setIntegrationRows ] = useState<Array<IntegrationRow>>([]);
    const prevIntegrations = usePrevious(integrations);

    useEffect(() => {
        if (integrations !== prevIntegrations) {
            setIntegrationRows(integrations.map(integration => ({
                ...integration,
                isOpen: false,
                isSelected: false
            })));
        }
    }, [ prevIntegrations, integrations ]);

    const onCollapse = useCallback((integration: IntegrationRow, index: number, isOpen: boolean) => {
        setIntegrationRows(prevIntegrations => {
            const newIntegrations = [ ...prevIntegrations ];
            newIntegrations[index] = { ...integration, isOpen };
            return newIntegrations;
        });
    }, [ setIntegrationRows ]);

    return {
        rows: integrationRows,
        onCollapse
    };
};
