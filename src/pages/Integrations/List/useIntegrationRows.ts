import { addDangerNotification } from '@redhat-cloud-services/insights-common-typescript';
import pLimit from 'p-limit';
import { useCallback, useContext, useEffect, useState } from 'react';
import { ClientContext } from 'react-fetching-library';
import { useDispatch, useSelector } from 'react-redux';
import { format } from 'react-string-format';
import { usePrevious } from 'react-use';

import { IntegrationRow } from '../../../components/Integrations/Table';
import { Messages } from '../../../properties/Messages';
import { listIntegrationHistoryActionCreator } from '../../../services/useListIntegrationHistory';
import {
    switchIntegrationEnabledStatusActionCreator
} from '../../../services/useSwitchIntegrationEnabledStatus';
import { SavedNotificationScopeActions } from '../../../store/actions/SavedNotificationScopeAction';
import { NotificationAppState } from '../../../store/types/NotificationAppState';
import { SavedNotificationScopeState, Status } from '../../../store/types/SavedNotificationScopeTypes';
import { UserIntegration } from '../../../types/Integration';

const notificationAppStateSelector = (state: NotificationAppState): SavedNotificationScopeState => state.savedNotificationScope;

const notificationAppStateEqualFn = (left: SavedNotificationScopeState, right: SavedNotificationScopeState): boolean => {
    return left?.integration === right?.integration && left?.status === right?.status;
};

const MAX_NUMBER_OF_CONCURRENT_REQUESTS = 5;

export const useIntegrationRows = (integrations: Array<UserIntegration>) => {
    const [ integrationRows, setIntegrationRows ] = useState<Array<IntegrationRow>>([]);
    const prevIntegrationsInput = usePrevious(integrations);

    const reduxDispatch = useDispatch();
    const savedNotificationScope = useSelector<NotificationAppState, SavedNotificationScopeState>(
        notificationAppStateSelector, notificationAppStateEqualFn
    );

    const { query } = useContext(ClientContext);
    const [ limit ] = useState<pLimit.Limit>(() => pLimit(MAX_NUMBER_OF_CONCURRENT_REQUESTS));

    const setIntegrationRowByIndex = useCallback((index: number, partialIntegration: Partial<IntegrationRow>) => {
        setIntegrationRows(prevIntegrations => {
            const newIntegrations = [ ...prevIntegrations ];
            newIntegrations[index] = { ...newIntegrations[index], ...partialIntegration } as IntegrationRow;
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
            newIntegrations[index] = { ...newIntegrations[index], ...partialIntegration } as IntegrationRow;
            return newIntegrations;
        });
    }, [ setIntegrationRows ]);

    useEffect(() => {
        if (integrations !== prevIntegrationsInput) {
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
                    limit(() => query(listIntegrationHistoryActionCreator({
                        integrationId,
                        limit: 5,
                        sortBy: 'created:desc'
                    }))).then(response => {

                        if (response.payload && response.payload.status === 200) {
                            const last5 = response.payload.value.map(p => ({
                                isSuccess: p.invocationResult,
                                date: new Date(p.created as string)
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
    }, [ prevIntegrationsInput, integrations, setIntegrationRowById, limit, query ]);

    const onCollapse = useCallback((_integration: IntegrationRow, index: number, isOpen: boolean) => {
        setIntegrationRowByIndex(index, {
            isOpen
        });
    }, [ setIntegrationRowByIndex ]);

    const onEnable = useCallback((_integration: UserIntegration, index: number, isEnabled: boolean) => {
        setIntegrationRowByIndex(index, {
            isEnabledLoading: true
        });

        if (savedNotificationScope) {
            if (_integration.id === savedNotificationScope.integration.id) {
                reduxDispatch(SavedNotificationScopeActions.start());
            }
        }

        query(switchIntegrationEnabledStatusActionCreator(_integration)).then((response) => {
            if (!response.error) {
                setIntegrationRowByIndex(index, {
                    isEnabled,
                    isEnabledLoading: false
                });
                if (savedNotificationScope) {
                    if (_integration.id === savedNotificationScope.integration.id) {
                        reduxDispatch(SavedNotificationScopeActions.finish(isEnabled));
                    }
                }
            } else {
                const message = isEnabled ? Messages.components.integrations.enableError : Messages.components.integrations.disableError;

                if (savedNotificationScope) {
                    if (_integration.id === savedNotificationScope.integration.id) {
                        reduxDispatch(SavedNotificationScopeActions.finish(_integration.isEnabled));
                    }
                }

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

    }, [ setIntegrationRowByIndex, query, reduxDispatch, savedNotificationScope ]);

    useEffect(() => {
        if (savedNotificationScope) {
            if (savedNotificationScope.status === Status.LOADING) {
                setIntegrationRowById(
                    savedNotificationScope.integration.id,
                    { isEnabledLoading: true }
                );
            } else {
                setIntegrationRowById(
                    savedNotificationScope.integration.id,
                    { isEnabledLoading: false, isEnabled: savedNotificationScope.integration.isEnabled }
                );
            }
        }
    }, [ savedNotificationScope, setIntegrationRowById ]);

    return {
        rows: integrationRows,
        onCollapse,
        onEnable
    };
};
