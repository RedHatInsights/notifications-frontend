import { Integration } from '../../../types/Integration';
import { useCallback, useContext, useEffect, useState } from 'react';
import { IntegrationRow } from '../../../components/Integrations/Table';
import { usePrevious } from 'react-use';
import { useSwitchIntegrationEnabledStatus } from '../../../services/useSwitchIntegrationEnabledStatus';
import { addDangerNotification } from '@redhat-cloud-services/insights-common-typescript';
import { Messages } from '../../../properties/Messages';
import { format } from 'react-string-format';
import { listIntegrationHistoryActionCreator } from '../../../services/useListIntegrationHistory';
import { ClientContext } from 'react-fetching-library';
import pLimit from 'p-limit';

const MAX_NUMBER_OF_CONCURRENT_REQUESTS = 5;

export const useIntegrationRows = (integrations: Array<Integration>) => {
    const [ integrationRows, setIntegrationRows ] = useState<Array<IntegrationRow>>([]);
    const prevIntegrations = usePrevious(integrations);

    const switchStatus = useSwitchIntegrationEnabledStatus();
    const { query } = useContext(ClientContext);
    const [ limit ] = useState<pLimit.Limit>(() => pLimit(MAX_NUMBER_OF_CONCURRENT_REQUESTS));

    const setIntegrationRowByIndex = useCallback((index: number, partialIntegration: Partial<IntegrationRow>) => {
        setIntegrationRows(prevIntegrations => {
            const newIntegrations = [ ...prevIntegrations ];
            newIntegrations[index] = { ...newIntegrations[index], ...partialIntegration };
            return newIntegrations;
        });
    }, [ setIntegrationRows ]);

    const setIntegrationRowById = useCallback((id: string, partialIntegration: Partial<IntegrationRow>) => {
        setIntegrationRows(prevIntegrations => {
            const index = prevIntegrations.findIndex(integration => integration.id === id);
            if (index === -1) {
                return prevIntegrations;
            }

            const newIntegrations = [ ...prevIntegrations ];
            newIntegrations[index] = { ...newIntegrations[index], ...partialIntegration };
            return newIntegrations;
        });
    }, [ setIntegrationRows ]);

    useEffect(() => {
        if (integrations !== prevIntegrations) {
            setIntegrationRows(prev => {
                return integrations.map(integration => ({
                    isOpen: false,
                    isSelected: false,
                    isEnabledLoading: false,
                    lastConnectionAttempts: [],
                    isConnectionAttemptLoading: true,
                    ...prev.find(i => i.id === integration.id),
                    ...integration
                }));
            });

            if (integrations) {
                limit.clearQueue();

                integrations.map(integration => integration.id).forEach(integrationId => {
                    limit(() => query(listIntegrationHistoryActionCreator(integrationId))).then(response => {
                        if (response.status === 200) {
                            // Todo: Add correct types
                            const last5 = (response.payload.slice(0, 5) as Array<any>).map(p => ({
                                isSuccess: p.invocationResult,
                                date: new Date(p.created)
                            }));
                            setIntegrationRowById(integrationId, {
                                isConnectionAttemptLoading: false,
                                lastConnectionAttempts: last5
                            });
                        } else {
                            setIntegrationRowById(integrationId, {
                                isConnectionAttemptLoading: false,
                                lastConnectionAttempts: undefined
                            });
                        }
                    });
                });
            }
        }
    }, [ prevIntegrations, integrations, setIntegrationRowById, limit, query ]);

    const onCollapse = useCallback((_integration: IntegrationRow, index: number, isOpen: boolean) => {
        setIntegrationRowByIndex(index, {
            isOpen
        });
    }, [ setIntegrationRowByIndex ]);

    const onEnable = useCallback((_integration: Integration, index: number, isEnabled: boolean) => {
        setIntegrationRowByIndex(index, {
            isEnabledLoading: true
        });

        switchStatus.mutate(_integration).then((response) => {
            if (response.status === 200) {
                setIntegrationRowByIndex(index, {
                    isEnabled,
                    isEnabledLoading: false
                });
            } else {
                const message = isEnabled ? Messages.components.integrations.enableError : Messages.components.integrations.disableError;
                addDangerNotification(
                    message.title,
                    format(message.description, _integration.name),
                    true);
                setIntegrationRowByIndex(index, {
                    isEnabled: _integration.isEnabled,
                    isEnabledLoading: false
                });
            }
        });

    }, [ setIntegrationRowByIndex, switchStatus ]);

    return {
        rows: integrationRows,
        onCollapse,
        onEnable
    };
};
