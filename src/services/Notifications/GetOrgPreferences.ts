import { useEffect, useState } from 'react';
import { fetchOrgPreferences } from '../../api/helpers/utilization/org-preferences-helper';

export interface OrgPreferences {
  custom_threshold: number;
  last_modified?: string;
}

export const useGetOrgPreferences = () => {
  const [data, setData] = useState<OrgPreferences | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        setLoading(true);
        const result = await fetchOrgPreferences();
        if (!cancelled) {
          setData(result);
          setError(null);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err as Error);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    load();

    return () => {
      cancelled = true;
    };
  }, []);

  return { data, loading, error };
};
