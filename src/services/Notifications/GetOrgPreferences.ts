import { useCallback, useEffect, useState } from 'react';
import {
  OrgPreferencesResponse,
  fetchOrgPreferences,
} from '../../api/helpers/utilization/org-preferences-helper';

export type OrgPreferences = OrgPreferencesResponse;

export const useGetOrgPreferences = () => {
  const [data, setData] = useState<OrgPreferences | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      const result = await fetchOrgPreferences();
      setData(result);
      setError(null);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const refetch = useCallback(() => {
    return load();
  }, [load]);

  return { data, loading, error, refetch };
};
