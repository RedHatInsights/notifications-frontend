import { useCallback, useMemo, useState } from 'react';
import { useUrlState } from '@redhat-cloud-services/insights-common-typescript';

export const useUrlStateExclusiveOptions = <T extends string, AT extends Array<T>>(name: string, initialOptions: AT, defaultValue?: T) => {
    const [ options ] = useState(initialOptions);
    const lowerCaseOptions = useMemo(() => options.map(o => o.trim().toLowerCase()), [ options ]);

    const serializer = useCallback((val: string | undefined) => {
        const value = val?.trim().toLowerCase();
        if (value && lowerCaseOptions.includes(value)) {
            return value;
        }

        return undefined;
    }, [ lowerCaseOptions ]);

    const deserializer = useCallback((val: string | undefined) => {
        return val?.trim().toLowerCase();
    }, [ ]);

    return useUrlState(name, serializer, deserializer, defaultValue);
};
