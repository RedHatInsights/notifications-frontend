import { Direction, Page, Sort } from '@redhat-cloud-services/insights-common-typescript';
import { useClient } from 'react-fetching-library';

import { Schemas } from '../generated/OpenapiNotifications';
import { listNotificationsActionCreator } from './useListNotifications';

export const useGetAllEventTypes = () => {
    const { query } = useClient();
    const fetchPage = async (page?: Page) : Promise<Schemas.EventType[]> => {
        if (!page) {
            page = Page.defaultPage().withSort(Sort.by('e.id', Direction.ASCENDING));
        }

        const { errorObject, payload } = await query(listNotificationsActionCreator(page));
        if (errorObject) {
            throw errorObject;
        }

        if (payload?.type === 'PageEventType') {
            const events = payload?.value?.data as Schemas.EventType[];
            if (events.length === 0) {
                return [];
            }

            return [ ...events, ...await fetchPage(page.nextPage()) ];
        }

        throw new Error(`Unknow payload type for eventTypes ${payload?.type}`);
    };

    return fetchPage;
};
