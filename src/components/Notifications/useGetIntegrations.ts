import { Filter, Operator, Page } from '@redhat-cloud-services/insights-common-typescript';
import * as React from 'react';
import { useContext } from 'react';
import { ClientContext } from 'react-fetching-library';

import { listIntegrationIntegrationDecoder, listIntegrationsActionCreator } from '../../services/useListIntegrations';
import { UserIntegrationType } from '../../types/Integration';
import { IntegrationRef } from '../../types/Notification';

export const useGetIntegrations = () => {
    const { query } = useContext(ClientContext);

    return React.useCallback(async (type: UserIntegrationType, _search: string) => {
        return query(listIntegrationsActionCreator(
            Page.of(
                1,
                20,
                new Filter()
                .and('type', Operator.EQUAL, type)
            )
        )).then(response => {
            let integrations: Array<IntegrationRef> = [];
            const payload = response.payload ? listIntegrationIntegrationDecoder(response.payload) : undefined;

            if (payload?.type === 'IntegrationPage') {
                integrations = payload.value.data;
            }

            return integrations;
        });
    }, [ query ]);
};
