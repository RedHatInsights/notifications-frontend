import { useCallback, useState } from 'react';
import { saveOrgPreferences } from '../../api/helpers/utilization/org-preferences-helper';

export interface UpdateOrgPreferencesRequest {
  customThreshold: number;
}

export const useUpdateOrgPreferences = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const mutate = useCallback(async (request: UpdateOrgPreferencesRequest) => {
    try {
      setLoading(true);
      setError(null);
      const result = await saveOrgPreferences(request.customThreshold);
      return result;
    } catch (err) {
      setError(err as Error);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { mutate, loading, error };
};
